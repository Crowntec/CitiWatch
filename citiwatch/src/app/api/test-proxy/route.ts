import { NextResponse } from 'next/server';

// Simple test endpoint to verify proxy functionality
export async function GET() {
  try {
    // Test the backend API connection
    const response = await fetch('http://citiwatch.runasp.net/api/Status/Health', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { 
          status: 'error', 
          message: `Backend API returned ${response.status}`,
          backendUrl: 'http://citiwatch.runasp.net/api/Status/Health'
        },
        { status: 502 }
      );
    }

    const data = await response.text();
    
    return NextResponse.json({
      status: 'success',
      message: 'Proxy is working correctly',
      backendResponse: data,
      backendUrl: 'http://citiwatch.runasp.net/api/Status/Health',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Test proxy error:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Failed to connect to backend API',
        error: error instanceof Error ? error.message : 'Unknown error',
        backendUrl: 'http://citiwatch.runasp.net/api/Status/Health'
      },
      { status: 500 }
    );
  }
}