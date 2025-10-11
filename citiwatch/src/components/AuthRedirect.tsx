'use client';

import { useEffect, useState } from 'react';

interface AuthRedirectProps {
  message?: string;
  redirecting?: boolean;
}

export default function AuthRedirect({ 
  message = "Session expired. Redirecting to home...", 
  redirecting = true 
}: AuthRedirectProps) {
  const [dots, setDots] = useState('');

  useEffect(() => {
    if (!redirecting) return;

    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    return () => clearInterval(interval);
  }, [redirecting]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
      <div className="text-center p-8">
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-4">
          {redirecting ? 'Redirecting' : 'Authentication Required'}
        </h2>
        <p className="text-gray-400 text-lg">
          {message}{redirecting ? dots : ''}
        </p>
        {!redirecting && (
          <a 
            href="/login" 
            className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Go to Login
          </a>
        )}
      </div>
    </div>
  );
}