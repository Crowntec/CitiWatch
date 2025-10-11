'use client';

import { useEffect, useState } from 'react';
import { AuthDebugger } from '@/utils/debugAuth';
import { SecureTokenStorage } from '@/utils/secureStorage';
import { apiClient } from '@/lib/api-client';

interface AuthTestResult {
  tokenInfo: Record<string, unknown>;
  user: Record<string, unknown> | null;
  testApiCall?: {
    success: boolean;
    error?: string;
  };
}

export default function AuthTestPage() {
  const [authTest, setAuthTest] = useState<AuthTestResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runAuthTest = async () => {
    setIsLoading(true);
    
    try {
      const tokenInfo = AuthDebugger.getTokenInfo();
      const user = SecureTokenStorage.getUser();
      
      // Test API call to see if authentication works
      let testApiCall;
      try {
        await apiClient.get('/Complaint/GetAllUserComplaints');
        testApiCall = { success: true };
      } catch (error) {
        testApiCall = {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }

      setAuthTest({
        tokenInfo: tokenInfo as unknown as Record<string, unknown>,
        user: user as unknown as Record<string, unknown> | null,
        testApiCall
      });
    } catch (error) {
      console.error('Auth test failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runAuthTest();
  }, []);

  const clearAuth = () => {
    AuthDebugger.clearAuthWithLogging();
    setAuthTest(null);
    window.location.href = '/login';
  };

  if (!authTest) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Authentication Test</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Authentication Debug Test</h1>
      
      <div className="space-y-6">
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Token Information</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(authTest.tokenInfo, null, 2)}
          </pre>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">User Data</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(authTest.user, null, 2)}
          </pre>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">API Test Result</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(authTest.testApiCall, null, 2)}
          </pre>
          
          {authTest.testApiCall && !authTest.testApiCall.success && (
            <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded">
              <p className="text-red-800 font-medium">API call failed!</p>
              <p className="text-red-600 text-sm mt-1">
                {authTest.testApiCall.error}
              </p>
            </div>
          )}
          
          {authTest.testApiCall && authTest.testApiCall.success && (
            <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded">
              <p className="text-green-800 font-medium">API call succeeded!</p>
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button
            onClick={runAuthTest}
            disabled={isLoading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? 'Testing...' : 'Run Test Again'}
          </button>
          
          <button
            onClick={clearAuth}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Clear Auth & Go to Login
          </button>
          
          <a
            href="/dashboard"
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 inline-block"
          >
            Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}