'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import PerformanceMonitor from '@/components/PerformanceMonitor';

// Create a client with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache data for 5 minutes by default
      staleTime: 1000 * 60 * 5,
      // Keep data in cache for 10 minutes
      gcTime: 1000 * 60 * 10,
      // Retry failed requests 3 times with exponential backoff
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus only if data is stale
      refetchOnWindowFocus: false,
      // Refetch on reconnect
      refetchOnReconnect: true,
      // Network-based configuration for better performance
      networkMode: 'online',
    },
    mutations: {
      // Retry mutations once to avoid duplicate submissions
      retry: 1,
      networkMode: 'online',
    },
  },
});

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <PerformanceMonitor>
        {children}
        {/* Only show devtools in development */}
        {process.env.NODE_ENV === 'development' && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </PerformanceMonitor>
    </QueryClientProvider>
  );
}