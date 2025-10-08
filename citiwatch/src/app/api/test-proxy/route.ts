import { NextResponse } from 'next/server';

// Simple test endpoint to verify proxy functionality
export async function GET() {
  try {
    // Test the backend API connection using a known endpoint
    const response = await fetch('http://citiwatch.runasp.net/api/Complaint/GetAll', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // For testing, we expect 401 (unauthorized) which means the API is working
    if (!response.ok && response.status !== 401) {
      return NextResponse.json(
        { 
          status: 'error', 
          message: `Backend API returned ${response.status}`,
          backendUrl: 'http://citiwatch.runasp.net/api/Complaint/GetAll'
        },
        { status: 502 }
      );
    }

    const data = await response.text();
    
    return NextResponse.json({
      status: 'success',
      message: 'Proxy is working correctly - backend API is accessible',
      backendResponse: response.status === 401 ? '401 Unauthorized (expected)' : data,
      backendStatus: response.status,
      backendUrl: 'http://citiwatch.runasp.net/api/Complaint/GetAll',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Test proxy error:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Failed to connect to backend API',
        error: error instanceof Error ? error.message : 'Unknown error',
        backendUrl: 'http://citiwatch.runasp.net/api/Complaint/GetAll'
      },
      { status: 500 }
    );
  }
}