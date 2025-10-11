"use client";

import React from 'react';
import Image from 'next/image';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'white' | 'gray';
  className?: string;
  withLogo?: boolean;
}

/**
 * Loading spinner component for API loading states
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  color = 'blue',
  className = '',
  withLogo = false
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const logoSizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-4 h-4',
    lg: 'w-6 h-6'
  };

  const colorClasses = {
    blue: 'border-blue-600',
    white: 'border-white',
    gray: 'border-gray-600'
  };

  if (withLogo) {
    return (
      <div className={`relative ${className}`} role="status" aria-label="Loading">
        {/* Spinning outer circle */}
        <div
          className={`animate-spin rounded-full border-2 border-t-transparent ${sizeClasses[size]} ${colorClasses[color]}`}
        />
        {/* Centered logo with fill animation */}
        <div className={`absolute inset-0 flex items-center justify-center ${sizeClasses[size]}`}>
          <div className="relative overflow-hidden rounded-full">
            <Image
              src="/primarylogo.png"
              alt="CitiWatch Logo"
              width={size === 'sm' ? 16 : size === 'md' ? 32 : 48}
              height={size === 'sm' ? 16 : size === 'md' ? 32 : 48}
              className={`${logoSizeClasses[size]} object-contain relative z-10`}
            />
            {/* Fill animation overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-blue-500/30 to-transparent animate-fill-up"></div>
          </div>
        </div>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

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
  withLogo?: boolean;
}

/**
 * Full page loading overlay
 */
export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  message = 'Loading...', 
  className = '',
  withLogo = true
}) => (
  <div className={`fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 ${className}`}>
    <div className="bg-gray-800 rounded-lg p-6 flex flex-col items-center space-y-4">
      <LoadingSpinner size="lg" color="blue" withLogo={withLogo} />
      <p className="text-white text-lg">{message}</p>
    </div>
  </div>
);

interface LoadingCardProps {
  message?: string;
  className?: string;
  withLogo?: boolean;
}

/**
 * Loading card for section-specific loading states
 */
export const LoadingCard: React.FC<LoadingCardProps> = ({ 
  message = 'Loading...', 
  className = '',
  withLogo = true
}) => (
  <div className={`bg-gray-800 border border-gray-700 rounded-lg p-8 flex flex-col items-center justify-center space-y-4 ${className}`}>
    <LoadingSpinner size="lg" color="blue" withLogo={withLogo} />
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
  withLogo?: boolean;
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
  type = 'button',
  withLogo = false
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={isLoading || disabled}
    className={`flex items-center justify-center space-x-2 transition-opacity ${
      isLoading || disabled ? 'opacity-50 cursor-not-allowed' : ''
    } ${className}`}
  >
    {isLoading && <LoadingSpinner size="sm" color="white" withLogo={withLogo} />}
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

interface LoadingTableProps {
  columns: number;
  rows?: number;
  message?: string;
  withLogo?: boolean;
  className?: string;
}

/**
 * Complete loading table with header spinner
 */
export const LoadingTable: React.FC<LoadingTableProps> = ({ 
  columns,
  rows = 5,
  message = 'Loading table data...',
  withLogo = true,
  className = ''
}) => (
  <div className={`bg-gray-800 border border-gray-700 rounded-lg overflow-hidden ${className}`}>
    <div className="p-6 border-b border-gray-700 flex items-center justify-center space-x-3">
      <LoadingSpinner size="sm" color="blue" withLogo={withLogo} />
      <span className="text-gray-300">{message}</span>
    </div>
    <table className="w-full">
      <tbody>
        <LoadingTableRows columns={columns} rows={rows} />
      </tbody>
    </table>
  </div>
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

interface LoadingPageProps {
  title?: string;
  message?: string;
  withLogo?: boolean;
  className?: string;
}

/**
 * Full page loading component for page transitions
 */
export const LoadingPage: React.FC<LoadingPageProps> = ({
  title = 'CitiWatch',
  message = 'Loading your experience...',
  withLogo = true,
  className = ''
}) => (
  <div className={`min-h-screen bg-gray-900 flex flex-col items-center justify-center ${className}`}>
    <div className="text-center">
      <div className="mb-6">
        <LoadingSpinner size="lg" color="blue" withLogo={withLogo} />
      </div>
      <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
      <p className="text-gray-300">{message}</p>
    </div>
  </div>
);

interface LoadingInlineProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  withLogo?: boolean;
  className?: string;
}

/**
 * Inline loading component for small sections
 */
export const LoadingInline: React.FC<LoadingInlineProps> = ({
  message,
  size = 'sm',
  withLogo = false,
  className = ''
}) => (
  <div className={`flex items-center space-x-2 ${className}`}>
    <LoadingSpinner size={size} color="blue" withLogo={withLogo} />
    {message && <span className="text-gray-300 text-sm">{message}</span>}
  </div>
);

export default LoadingSpinner;
