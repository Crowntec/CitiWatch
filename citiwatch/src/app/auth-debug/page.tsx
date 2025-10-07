'use client';

import { useState, useEffect } from 'react';
import { SecureTokenStorage } from '@/utils/secureStorage';

export default function AuthDebugPage() {
  const [tokenInfo, setTokenInfo] = useState<string>('');
  const [userInfo, setUserInfo] = useState<string>('');
  const [testResult, setTestResult] = useState<string>('');

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = () => {
    // Check token
    const token = SecureTokenStorage.getToken();
    if (token) {
      try {
        // Decode JWT token
        const payload = JSON.parse(atob(token.split('.')[1]));
        const now = Math.floor(Date.now() / 1000);
        const isExpired = payload.exp && payload.exp < now;
        
        setTokenInfo(`
Token exists: Yes
Token length: ${token.length}
Expires: ${payload.exp ? new Date(payload.exp * 1000).toISOString() : 'No expiry'}
Is Expired: ${isExpired}
Payload: ${JSON.stringify(payload, null, 2)}
        `);
      } catch (error) {
        setTokenInfo(`
Token exists: Yes
Token length: ${token.length}
Error decoding: ${error instanceof Error ? error.message : 'Unknown error'}
Raw token (first 50 chars): ${token.substring(0, 50)}...
        `);
      }
    } else {
      setTokenInfo('Token exists: No');
    }

    // Check user info
    const user = SecureTokenStorage.getUser();
    setUserInfo(user ? JSON.stringify(user, null, 2) : 'No user data');
  };

  const testAuthenticatedRequest = async () => {
    setTestResult('Testing authenticated request...');
    
    try {
      const { apiClient } = await import('@/lib/api-client');
      
      // Test the same endpoint that's failing
      const response = await apiClient.get('/Complaint/GetAllUserComplaints');
      
      setTestResult(`
✅ SUCCESS!
Response: ${JSON.stringify(response, null, 2)}
      `);
      
    } catch (error) {
      setTestResult(`
❌ FAILED!
Error: ${error instanceof Error ? error.message : 'Unknown error'}
Full error: ${JSON.stringify(error, Object.getOwnPropertyNames(error), 2)}
      `);
    }
  };

  const clearAuth = () => {
    SecureTokenStorage.clearAuth();
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    checkAuthState();
    setTestResult('');
  };

  const loginAsAdmin = async () => {
    setTestResult('Logging in as admin...');
    
    try {
      const { AuthService } = await import('@/services/auth');
      
      const result = await AuthService.login({
        email: 'admin@citiwatch.com',
        password: 'Admin123'
      });
      
      if (result.success) {
        setTestResult('✅ Login successful!');
        checkAuthState();
      } else {
        setTestResult(`❌ Login failed: ${result.message}`);
      }
    } catch (error) {
      setTestResult(`❌ Login error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-2xl font-bold mb-6">Authentication Debug Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Token Info */}
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Token Information</h2>
          <pre className="text-sm whitespace-pre-wrap overflow-auto">
            {tokenInfo}
          </pre>
        </div>
        
        {/* User Info */}
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">User Information</h2>
          <pre className="text-sm whitespace-pre-wrap overflow-auto">
            {userInfo}
          </pre>
        </div>
      </div>
      
      {/* Actions */}
      <div className="mt-6 space-x-4">
        <button
          onClick={checkAuthState}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
        >
          Refresh Auth State
        </button>
        
        <button
          onClick={loginAsAdmin}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
        >
          Login as Admin
        </button>
        
        <button
          onClick={testAuthenticatedRequest}
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded"
        >
          Test Auth Request
        </button>
        
        <button
          onClick={clearAuth}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
        >
          Clear Auth
        </button>
      </div>
      
      {/* Test Results */}
      {testResult && (
        <div className="mt-6 bg-gray-800 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Test Results</h2>
          <pre className="text-sm whitespace-pre-wrap overflow-auto">
            {testResult}
          </pre>
        </div>
      )}
    </div>
  );
}