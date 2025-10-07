'use client';

import { useState, useEffect } from 'react';
import { SecureTokenStorage } from '@/utils/secureStorage';

export default function AuthDebugPage() {
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    // Check authentication status
    const token = SecureTokenStorage.getToken();
    const user = SecureTokenStorage.getUser();
    
    setDebugInfo({
      hasToken: !!token,
      tokenPreview: token ? `${token.substring(0, 20)}...` : 'No token',
      tokenLength: token ? token.length : 0,
      user: user,
      localStorage: {
        token: localStorage.getItem('token'),
        authToken: localStorage.getItem('authToken'),
      },
      cookies: document.cookie,
    });
  }, []);

  const testApiCall = async () => {
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5182/api';
      const token = SecureTokenStorage.getToken();
      
      console.log('Testing API call with token:', token ? `${token.substring(0, 20)}...` : 'No token');
      
      const response = await fetch(`${apiBaseUrl}/Category/GetAll`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      console.log('API Response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      });

      const data = await response.text();
      console.log('Response body:', data);
      
      alert(`API Test: ${response.status} - ${response.statusText}\nSee console for details`);
    } catch (error) {
      console.error('API Test Error:', error);
      alert(`API Test Failed: ${error}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Authentication Debug</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test API Call</h2>
          <button 
            onClick={testApiCall}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Test Categories API
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <button 
              onClick={() => {
                SecureTokenStorage.clearAuth();
                window.location.reload();
              }}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 mr-2"
            >
              Clear Auth & Reload
            </button>
            <button 
              onClick={() => window.location.href = '/login'}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}