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

    // In real app, verify admin role from token
    // For demo, assume user is admin if they have a token

    return NextResponse.json({
      status: 'success',
      data: mockAllUsers,
      message: 'All users retrieved successfully'
    });

  } catch {
    return NextResponse.json(
      { status: 'error', message: 'Internal server error' },
      { status: 500 }
    );
  }
}
