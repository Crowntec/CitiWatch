'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/auth/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  fallbackPath?: string;
}

export function ProtectedRoute({ 
  children, 
  requireAdmin = false, 
  fallbackPath = '/login' 
}: ProtectedRouteProps) {
  const { isLoading, isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push(fallbackPath);
      return;
    }

    if (requireAdmin && !isAdmin) {
      // Non-admin users trying to access admin routes
      router.push('/dashboard');
      return;
    }

    // Admin users accessing regular user routes should be redirected to admin
    if (isAdmin && window.location.pathname.startsWith('/dashboard')) {
      router.push('/admin');
      return;
    }
  }, [isAuthenticated, isAdmin, isLoading, router, requireAdmin, fallbackPath]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated || (requireAdmin && !isAdmin)) {
    return null;
  }

  return <>{children}</>;
}

// HOC for admin-only pages
export function withAdminAuth<P extends object>(Component: React.ComponentType<P>) {
  return function AdminProtectedComponent(props: P) {
    return (
      <ProtectedRoute requireAdmin>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}

// HOC for authenticated pages
export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function AuthProtectedComponent(props: P) {
    return (
      <ProtectedRoute>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}
