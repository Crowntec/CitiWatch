import { NextRequest, NextResponse } from 'next/server';

// This route acts as a proxy to the backend API
// It helps avoid CORS issues and allows HTTPS frontend to call HTTP backend
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  return handleApiProxy(request, resolvedParams.path, 'GET');
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  return handleApiProxy(request, resolvedParams.path, 'POST');
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  return handleApiProxy(request, resolvedParams.path, 'PUT');
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  return handleApiProxy(request, resolvedParams.path, 'DELETE');
}

async function handleApiProxy(
  request: NextRequest,
  pathSegments: string[],
  method: string
) {
  try {
    const backendUrl = 'http://citiwatch.runasp.net/api';
    const apiPath = pathSegments.join('/');
    const url = `${backendUrl}/${apiPath}`;

    // Get query parameters
    const searchParams = new URLSearchParams();
    request.nextUrl.searchParams.forEach((value, key) => {
      searchParams.append(key, value);
    });

    const finalUrl = searchParams.toString() 
      ? `${url}?${searchParams.toString()}`
      : url;

    // Prepare headers
    const headers: Record<string, string> = {};
    
    // Copy relevant headers from the original request
    request.headers.forEach((value, key) => {
      if (
        key.toLowerCase() === 'authorization' ||
        key.toLowerCase() === 'content-type' ||
        key.toLowerCase().startsWith('x-')
      ) {
        headers[key] = value;
      }
    });

    // Prepare request options
    const requestOptions: RequestInit = {
      method,
      headers,
    };

    // Add body for POST/PUT requests
    if (method === 'POST' || method === 'PUT') {
      const contentType = request.headers.get('content-type');
      
      if (contentType?.includes('application/json')) {
        requestOptions.body = JSON.stringify(await request.json());
      } else if (contentType?.includes('multipart/form-data')) {
        requestOptions.body = await request.formData();
        // Remove content-type header to let fetch set it with boundary
        delete headers['content-type'];
      } else {
        requestOptions.body = await request.text();
      }
    }

    // Make the request to the backend
    const response = await fetch(finalUrl, requestOptions);

    // Get response headers to pass through
    const responseHeaders = new Headers();
    response.headers.forEach((value, key) => {
      // Pass through most headers except some that could cause issues
      if (
        !key.toLowerCase().startsWith('transfer-encoding') &&
        !key.toLowerCase().startsWith('connection') &&
        !key.toLowerCase().startsWith('content-encoding')
      ) {
        responseHeaders.set(key, value);
      }
    });

    // Add CORS headers for browser requests
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Get response body
    const contentType = response.headers.get('content-type');
    let responseBody;

    if (contentType?.includes('application/json')) {
      responseBody = await response.json();
      return NextResponse.json(responseBody, {
        status: response.status,
        headers: responseHeaders,
      });
    } else {
      responseBody = await response.text();
      return new NextResponse(responseBody, {
        status: response.status,
        headers: responseHeaders,
      });
    }

  } catch (error) {
    console.error('Proxy API Error:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: error instanceof Error ? error.message : 'Proxy request failed' 
      },
      { status: 500 }
    );
  }
}

// Handle preflight OPTIONS requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}