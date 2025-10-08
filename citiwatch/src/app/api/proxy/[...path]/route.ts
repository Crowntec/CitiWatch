import { NextRequest, NextResponse } from 'next/server';

const BACKEND_API_URL = 'http://citiwatch.runasp.net/api';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxyRequest(request, path, 'GET');
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxyRequest(request, path, 'POST');
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxyRequest(request, path, 'PUT');
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxyRequest(request, path, 'DELETE');
}

async function proxyRequest(
  request: NextRequest,
  pathSegments: string[],
  method: string
) {
  try {
    // Construct the target URL
    const path = pathSegments.join('/');
    const url = new URL(request.url);
    const targetUrl = `${BACKEND_API_URL}/${path}${url.search}`;

    // Log the proxy request for debugging
    console.log(`[PROXY] ${method} ${targetUrl}`);

    // Prepare headers - forward relevant headers from the original request
    const headers = new Headers();
    
    // Copy important headers
    const headersToForward = [
      'authorization',
      'content-type',
      'accept',
      'user-agent',
      'accept-language',
    ];

    headersToForward.forEach(headerName => {
      const value = request.headers.get(headerName);
      if (value) {
        headers.set(headerName, value);
        // Log auth headers for debugging (but mask the token)
        if (headerName === 'authorization' && value.startsWith('Bearer ')) {
          console.log(`[PROXY] Auth header present: Bearer ${value.slice(-10)}`);
        }
      }
    });

    // Prepare the request body for POST/PUT requests
    let body: BodyInit | undefined;
    if (method === 'POST' || method === 'PUT') {
      // For multipart/form-data, we need to pass the raw body stream
      // Don't parse it as FormData as that consumes the stream
      if (request.headers.get('content-type')?.includes('multipart/form-data')) {
        // Get the raw body as ArrayBuffer to preserve the multipart stream
        body = await request.arrayBuffer();
      } else if (request.headers.get('content-type')?.includes('application/json')) {
        body = await request.text();
      }
    }

    // Make the proxied request
    const response = await fetch(targetUrl, {
      method,
      headers,
      body,
    });

    console.log(`[PROXY] Response status: ${response.status} for ${targetUrl}`);
    
    // Log error responses for debugging
    if (!response.ok) {
      const errorText = await response.clone().text();
      console.log(`[PROXY] Error response: ${errorText}`);
    }

    // Create response with the same status and headers
    const responseData = await response.text();
    
    const proxyResponse = new NextResponse(responseData, {
      status: response.status,
      statusText: response.statusText,
    });

    // Forward relevant response headers
    const responseHeadersToForward = [
      'content-type',
      'cache-control',
      'etag',
      'expires',
      'last-modified',
    ];

    responseHeadersToForward.forEach(headerName => {
      const value = response.headers.get(headerName);
      if (value) {
        proxyResponse.headers.set(headerName, value);
      }
    });

    // Add CORS headers
    proxyResponse.headers.set('Access-Control-Allow-Origin', '*');
    proxyResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    proxyResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return proxyResponse;
  } catch (error) {
    console.error('[PROXY] Error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      method,
      pathSegments,
      targetUrl: `${BACKEND_API_URL}/${pathSegments.join('/')}`
    });
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Proxy request failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        target: `${BACKEND_API_URL}/${pathSegments.join('/')}`
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}