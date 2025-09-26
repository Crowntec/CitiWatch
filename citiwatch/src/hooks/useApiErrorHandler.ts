'use client';

import { useCallback } from 'react';
import { useAuth } from '@/auth/AuthContext';

export function useApiErrorHandler() {
  const { logout } = useAuth();

  const handleApiError = useCallback((error: unknown) => {
    // Check if it's an authentication error
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes('Session expired') || 
        errorMessage.includes('Unauthorized') ||
        errorMessage.includes('401')) {
      
      console.log('Authentication error detected, logging out...');
      
      // Clear auth state and redirect to login
      logout();
      return;
    }

    // For other errors, just log them
    console.error('API Error:', error);
  }, [logout]);

  return { handleApiError };
}