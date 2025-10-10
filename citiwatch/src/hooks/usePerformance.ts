import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

// Performance monitoring hook for React Query
export function usePerformanceMonitoring() {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Monitor cache hits and performance metrics
    const queryCache = queryClient.getQueryCache();
    
    // Log cache statistics in development
    if (process.env.NODE_ENV === 'development') {
      const logCacheStats = () => {
        const queries = queryCache.getAll();
        const staleQueries = queries.filter(query => query.isStale());
        const cachedQueries = queries.filter(query => !query.isStale() && query.state.data);
        
        console.group('🚀 React Query Performance Stats');
        console.log(`Total queries: ${queries.length}`);
        console.log(`Cached queries: ${cachedQueries.length}`);
        console.log(`Stale queries: ${staleQueries.length}`);
        console.log(`Cache hit ratio: ${queries.length > 0 ? ((cachedQueries.length / queries.length) * 100).toFixed(1) : 0}%`);
        console.groupEnd();
      };

      // Log stats every 30 seconds in development
      const interval = setInterval(logCacheStats, 30000);
      
      // Initial log
      setTimeout(logCacheStats, 2000);

      return () => clearInterval(interval);
    }
  }, [queryClient]);

  // Return cache utilities for components that need them
  return {
    prefetchQuery: queryClient.prefetchQuery.bind(queryClient),
    invalidateQueries: queryClient.invalidateQueries.bind(queryClient),
    getQueryData: queryClient.getQueryData.bind(queryClient),
    setQueryData: queryClient.setQueryData.bind(queryClient),
    clear: queryClient.clear.bind(queryClient)
  };
}

// Performance metrics collection
export function usePageLoadMetrics() {
  useEffect(() => {
    // Collect Web Vitals metrics
    if (typeof window !== 'undefined' && window.performance) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          // Log performance metrics in development
          if (process.env.NODE_ENV === 'development') {
            console.log(`Performance: ${entry.name} = ${entry.duration.toFixed(2)}ms`);
          }
        }
      });

      // Observe navigation and measure entries
      observer.observe({ entryTypes: ['navigation', 'measure'] });

      return () => observer.disconnect();
    }
  }, []);
}

// Network status monitoring for better UX
export function useNetworkStatus() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'navigator' in window && 'onLine' in navigator) {
      const handleOnline = () => {
        console.log('📡 Network: Online');
        // Optionally refetch queries when back online
      };

      const handleOffline = () => {
        console.log('📡 Network: Offline');
      };

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);
}