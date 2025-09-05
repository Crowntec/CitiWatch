"use client";

import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

/**
 * Error Boundary component to catch and display API errors gracefully
 * Implements the error boundary requirement from API guidelines
 */
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log API errors for debugging
    console.error('API Error caught by boundary:', error);
    console.error('Error Info:', errorInfo);
    
    // You can also send error reports to a logging service here
    // Example: logErrorToService(error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      // If a custom fallback component is provided, use it
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return (
          <FallbackComponent 
            error={this.state.error!} 
            resetError={this.resetError} 
          />
        );
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center mb-4">
              <div className="bg-red-500/20 p-2 rounded-full mr-3">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L5.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="text-red-400 text-xl font-semibold">Something went wrong</h2>
            </div>
            
            <p className="text-gray-300 mb-4">
              An error occurred while loading this page. This might be due to a network issue or server problem.
            </p>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="bg-gray-800/50 border border-gray-700 rounded p-3 mb-4">
                <p className="text-red-300 text-sm font-mono">
                  {this.state.error.message}
                </p>
              </div>
            )}
            
            <div className="flex space-x-3">
              <button
                onClick={this.resetError}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Try Again
              </button>
              
              <button
                onClick={() => window.location.href = '/'}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Custom error fallback component for specific use cases
 */
export const ApiErrorFallback: React.FC<{ error: Error; resetError: () => void }> = ({ 
  error, 
  resetError 
}) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4 my-4">
    <div className="flex items-center">
      <div className="flex-shrink-0">
        <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div className="ml-3 flex-1">
        <h3 className="text-sm font-medium text-red-800">
          Failed to load data
        </h3>
        <p className="text-sm text-red-700 mt-1">
          {error.message || 'An unexpected error occurred'}
        </p>
      </div>
      <div className="ml-auto">
        <button
          onClick={resetError}
          className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded text-sm transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  </div>
);

export default ErrorBoundary;
