'use client';

import dynamic from 'next/dynamic';
import { LoadingCard } from '@/components/Loading';

// Lazy load admin components for better performance
// Regular users won't download admin code unless they access admin routes
export const LazyAdminLayout = dynamic(() => import('@/components/AdminLayout'), {
  ssr: false,
  loading: () => <LoadingCard />
});

export const LazyUsersPage = dynamic(() => import('@/app/admin/users/page'), {
  ssr: false,
  loading: () => (
    <div className="p-8">
      <LoadingCard />
    </div>
  )
});

export const LazyCategoriesPage = dynamic(() => import('@/app/admin/categories/page'), {
  ssr: false,
  loading: () => (
    <div className="p-8">
      <LoadingCard />
    </div>
  )
});

export const LazyStatusPage = dynamic(() => import('@/app/admin/status/page'), {
  ssr: false,
  loading: () => (
    <div className="p-8">
      <LoadingCard />
    </div>
  )
});

export const LazyComplaintsPage = dynamic(() => import('@/app/admin/complaints/page'), {
  ssr: false,
  loading: () => (
    <div className="p-8">
      <LoadingCard />
    </div>
  )
});

export const LazyPendingComplaintsPage = dynamic(() => import('@/app/admin/complaints/pending/page'), {
  ssr: false,
  loading: () => (
    <div className="p-8">
      <LoadingCard />
    </div>
  )
});