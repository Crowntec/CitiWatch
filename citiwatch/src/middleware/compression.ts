import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Clone the request headers
  const requestHeaders = new Headers(request.headers);
  
  // Add compression acceptance for better performance
  if (!requestHeaders.has('accept-encoding')) {
    requestHeaders.set('accept-encoding', 'gzip, deflate, br');
  }
  
  // Create response with compression headers
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Add performance headers for caching static assets
  const { pathname } = request.nextUrl;
  
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

  // Add compression for text-based assets
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('text/') || 
      contentType.includes('application/json') ||
      contentType.includes('application/javascript') ||
      contentType.includes('text/css')) {
    
    response.headers.set('Content-Encoding', 'gzip');
  }

  // Security headers for better performance and security
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Apply middleware to all other routes including API routes
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};