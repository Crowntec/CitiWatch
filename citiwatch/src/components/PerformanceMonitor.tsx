'use client';

import { usePerformanceMonitoring, usePageLoadMetrics, useNetworkStatus } from '@/hooks/usePerformance';

export default function PerformanceMonitor({ children }: { children: React.ReactNode }) {
  // Initialize performance monitoring
  usePerformanceMonitoring();
  usePageLoadMetrics();
  useNetworkStatus();

  return <>{children}</>;
}