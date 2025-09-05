"use client";

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'white' | 'gray';
  className?: string;
}

/**
 * Loading spinner component for API loading states
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  color = 'blue',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const colorClasses = {
    blue: 'border-blue-600',
    white: 'border-white',
    gray: 'border-gray-600'
  };

  return (
    <div
      className={`animate-spin rounded-full border-2 border-t-transparent ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

interface LoadingOverlayProps {
  message?: string;
  className?: string;
}

/**
 * Full page loading overlay
 */
export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  message = 'Loading...', 
  className = '' 
}) => (
  <div className={`fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 ${className}`}>
    <div className="bg-gray-800 rounded-lg p-6 flex flex-col items-center space-y-4">
      <LoadingSpinner size="lg" color="blue" />
      <p className="text-white text-lg">{message}</p>
    </div>
  </div>
);

interface LoadingCardProps {
  message?: string;
  className?: string;
}

/**
 * Loading card for section-specific loading states
 */
export const LoadingCard: React.FC<LoadingCardProps> = ({ 
  message = 'Loading...', 
  className = '' 
}) => (
  <div className={`bg-gray-800 border border-gray-700 rounded-lg p-8 flex flex-col items-center justify-center space-y-4 ${className}`}>
    <LoadingSpinner size="lg" color="blue" />
    <p className="text-gray-300 text-center">{message}</p>
  </div>
);

interface LoadingButtonProps {
  isLoading: boolean;
  children: React.ReactNode;
  loadingText?: string;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

/**
 * Button with loading state
 */
export const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading,
  children,
  loadingText = 'Loading...',
  disabled = false,
  className = '',
  onClick,
  type = 'button'
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={isLoading || disabled}
    className={`flex items-center justify-center space-x-2 transition-opacity ${
      isLoading || disabled ? 'opacity-50 cursor-not-allowed' : ''
    } ${className}`}
  >
    {isLoading && <LoadingSpinner size="sm" color="white" />}
    <span>{isLoading ? loadingText : children}</span>
  </button>
);

interface LoadingTableRowsProps {
  columns: number;
  rows?: number;
}

/**
 * Loading skeleton for table rows
 */
export const LoadingTableRows: React.FC<LoadingTableRowsProps> = ({ 
  columns, 
  rows = 5 
}) => (
  <>
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <tr key={rowIndex} className="border-b border-gray-700">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <td key={colIndex} className="px-6 py-4">
            <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
          </td>
        ))}
      </tr>
    ))}
  </>
);

interface LoadingSectionProps {
  lines?: number;
  className?: string;
}

/**
 * Loading skeleton for content sections
 */
export const LoadingSection: React.FC<LoadingSectionProps> = ({ 
  lines = 3, 
  className = '' 
}) => (
  <div className={`animate-pulse ${className}`}>
    {Array.from({ length: lines }).map((_, index) => (
      <div
        key={index}
        className={`h-4 bg-gray-700 rounded mb-3 ${
          index === lines - 1 ? 'w-3/4' : 'w-full'
        }`}
      ></div>
    ))}
  </div>
);

export default LoadingSpinner;
