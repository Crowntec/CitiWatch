import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Check for authorization header
    const authorization = request.headers.get('authorization');
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return NextResponse.json(
        { status: 'error', message: 'Authorization token required' },
        { status: 401 }
      );
    }

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5182/api';
    
    const response = await fetch(`${apiBaseUrl}/User/GetAll`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authorization,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { status: 'error', message: `API request failed: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      status: 'success',
      data: data.data || data,
      message: data.message || 'All users retrieved successfully'
    });

  } catch {
    return NextResponse.json(
      { status: 'error', message: 'Internal server error' },
      { status: 500 }
    );
  }
}
