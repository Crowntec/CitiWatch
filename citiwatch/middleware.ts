import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes
const protectedRoutes = ['/admin', '/dashboard'];
const adminRoutes = ['/admin'];

interface JWTPayload {
  sub?: string;
  nameid?: string;
  email?: string;
  role?: string;
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: string;
  exp?: number;
}

function decodeJWT(token: string): JWTPayload | null {
  try {
    // Decode JWT payload (simplified - in production use a proper JWT library)
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    return payload;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Clone request headers for performance enhancements
  const requestHeaders = new Headers(request.headers);
  
  // Add compression acceptance for better performance
  if (!requestHeaders.has('accept-encoding')) {
    requestHeaders.set('accept-encoding', 'gzip, deflate, br');
  }
  
  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  const isAdminRoute = adminRoutes.some(route => 
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    // Check for auth token in cookies first, then headers
    const token = request.cookies.get('token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      console.log('No token found, redirecting to home');
      // Redirect to home page if no token (immediate redirect, no saved state)
      const homeUrl = new URL('/', request.url);
      return NextResponse.redirect(homeUrl);
    }

    // Verify token and extract payload
    const payload = decodeJWT(token);
    if (!payload) {
      console.log('Invalid token, redirecting to home');
      const homeUrl = new URL('/', request.url);
      return NextResponse.redirect(homeUrl);
    }

    // Check token expiration
    const currentTime = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < currentTime) {
      console.log('Token expired, redirecting to home');
      const homeUrl = new URL('/', request.url);
      return NextResponse.redirect(homeUrl);
    }

    // For admin routes, check if user has admin role
    if (isAdminRoute) {
      const userRole = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || payload.role;
      console.log('User role for admin route:', userRole);
      
      if (userRole?.toLowerCase() !== 'admin') {
        console.log('User not admin, redirecting to dashboard');
        // Redirect non-admin users to dashboard
        const dashboardUrl = new URL('/dashboard', request.url);
        return NextResponse.redirect(dashboardUrl);
      }
    }
  }

  // Create response with performance optimizations
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Add performance and caching headers
  // Cache static assets for better performance
  if (pathname.startsWith('/_next/static/') || 
      pathname.startsWith('/images/') ||
      pathname.endsWith('.ico') ||
      pathname.endsWith('.png') ||
      pathname.endsWith('.jpg') ||
      pathname.endsWith('.jpeg') ||
      pathname.endsWith('.gif') ||
      pathname.endsWith('.webp') ||
      pathname.endsWith('.svg')) {
    
    response.headers.set(
      'Cache-Control',
      'public, max-age=31536000, immutable' // Cache for 1 year
    );
  }
  
  // Cache API responses with shorter duration
  if (pathname.startsWith('/api/')) {
    response.headers.set(
      'Cache-Control', 
      'public, max-age=60, s-maxage=60' // Cache for 1 minute
    );
  }

  // Performance and security headers
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

export const config = {
  matcher: [
    // Protected routes for authentication
    '/admin/:path*', 
    '/dashboard/:path*',
    // Performance optimization for all routes except static files
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ]
};
