'use client';

import { useState } from 'react';
import { SecureTokenStorage } from '@/utils/secureStorage';

interface TestResult {
  endpoint: string;
  method: string;
  status?: number;
  headers?: Record<string, string>;
  response?: string | Record<string, unknown>;
  error?: string;
  timestamp: string;
}

export default function APITestPage() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addTestResult = (result: TestResult) => {
    setTestResults(prev => [result, ...prev]);
  };

  const testEndpoint = async (endpoint: string, method: 'GET' | 'POST' = 'GET') => {
    setIsLoading(true);
    const timestamp = new Date().toISOString();
    
    try {
      const token = SecureTokenStorage.getToken();
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      console.log(`Testing ${method} ${endpoint} with headers:`, headers);

      const response = await fetch(endpoint, {
        method,
        headers
      });

      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      let responseData;
      try {
        responseData = await response.json();
      } catch {
        responseData = await response.text();
      }

      addTestResult({
        endpoint,
        method,
        status: response.status,
        headers: responseHeaders,
        response: responseData,
        timestamp
      });

    } catch (error) {
      addTestResult({
        endpoint,
        method,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Test the backend API directly
  const testBackendDirect = async () => {
    await testEndpoint('http://citiwatch.runasp.net/api/Complaint/GetAllUserComplaints', 'GET');
  };

  // Test via our proxy
  const testViaProxy = async () => {
    await testEndpoint('/api/proxy/Complaint/GetAllUserComplaints', 'GET');
  };

  // Test a simple endpoint to verify auth works
  const testSimpleAuth = async () => {
    await testEndpoint('/api/proxy/User/Profile', 'GET');
  };

  // Test with different auth header formats
  const testDifferentAuthFormat = async () => {
    const timestamp = new Date().toISOString();
    const endpoint = '/api/proxy/Complaint/GetAllUserComplaints';
    
    try {
      const token = SecureTokenStorage.getToken();
      
      if (!token) {
        addTestResult({
          endpoint: endpoint + ' (No Token Test)',
          method: 'GET',
          error: 'No token available',
          timestamp
        });
        return;
      }

      // Test without Bearer prefix
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token, // Without "Bearer " prefix
        }
      });

      let responseData;
      try {
        responseData = await response.json();
      } catch {
        responseData = await response.text();
      }

      addTestResult({
        endpoint: endpoint + ' (Raw Token)',
        method: 'GET',
        status: response.status,
        response: responseData,
        timestamp
      });

    } catch (error) {
      addTestResult({
        endpoint: endpoint + ' (Raw Token)',
        method: 'GET',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp
      });
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">API Endpoint Testing</h1>
      
      <div className="mb-6 flex gap-4 flex-wrap">
        <button
          onClick={testViaProxy}
          disabled={isLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Test via Proxy (GetAllUserComplaints)
        </button>
        
        <button
          onClick={testBackendDirect}
          disabled={isLoading}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
        >
          Test Backend Direct
        </button>
        
        <button
          onClick={testSimpleAuth}
          disabled={isLoading}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
        >
          Test User Profile
        </button>

        <button
          onClick={testDifferentAuthFormat}
          disabled={isLoading}
          className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 disabled:opacity-50"
        >
          Test Raw Token Format
        </button>
        
        <button
          onClick={clearResults}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Clear Results
        </button>

        <a
          href="/debug-auth"
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 inline-block"
        >
          Auth Debug
        </a>
      </div>

      {isLoading && (
        <div className="mb-4 p-3 bg-blue-100 border border-blue-300 rounded">
          Testing API endpoint...
        </div>
      )}

      <div className="space-y-6">
        {testResults.map((result, index) => (
          <div key={index} className="border rounded-lg p-4 bg-white shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg">
                  {result.method} {result.endpoint}
                </h3>
                <p className="text-sm text-gray-600">{result.timestamp}</p>
              </div>
              <div className={`px-3 py-1 rounded text-sm font-medium ${
                result.status 
                  ? result.status < 300 
                    ? 'bg-green-100 text-green-800' 
                    : result.status < 500
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {result.status || 'Error'}
              </div>
            </div>

            {result.error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded">
                <h4 className="font-medium text-red-800">Error:</h4>
                <p className="text-red-600">{result.error}</p>
              </div>
            )}

            {result.headers && (
              <div className="mb-4">
                <h4 className="font-medium mb-2">Response Headers:</h4>
                <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto">
                  {JSON.stringify(result.headers, null, 2)}
                </pre>
              </div>
            )}

            {result.response && (
              <div>
                <h4 className="font-medium mb-2">Response Body:</h4>
                <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto max-h-64">
                  {typeof result.response === 'string' 
                    ? result.response 
                    : JSON.stringify(result.response, null, 2)
                  }
                </pre>
              </div>
            )}
          </div>
        ))}

        {testResults.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No test results yet. Click a button above to test an API endpoint.
          </div>
        )}
      </div>
    </div>
  );
}