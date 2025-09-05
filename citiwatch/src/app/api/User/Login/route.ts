import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Dummy credentials for development
    const dummyCredentials = {
      email: 'demo@citiwatch.com',
      password: 'password123',
    };

    // Check credentials
    if (email === dummyCredentials.email && password === dummyCredentials.password) {
      // Return success with dummy token
      return NextResponse.json({
        status: 'success',
        token: `dummy-api-token-${Date.now()}`,
        user: {
          id: '1',
          fullName: 'Demo User',
          email: 'demo@citiwatch.com',
          role: 'admin'
        },
        message: 'Login successful'
      });
    }

    // Invalid credentials
    return NextResponse.json(
      { status: 'error', message: 'Invalid email or password' },
      { status: 401 }
    );

  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'Internal server error' },
      { status: 500 }
    );
  }
}
