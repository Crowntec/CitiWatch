import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, email, password, role } = body;

    // Basic validation
    if (!fullName || !email || !password) {
      return NextResponse.json(
        { status: 'error', message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Password validation
    if (password.length < 8) {
      return NextResponse.json(
        { status: 'error', message: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Full name validation
    if (fullName.length < 2) {
      return NextResponse.json(
        { status: 'error', message: 'Full name must be at least 2 characters long' },
        { status: 400 }
      );
    }

    // Forward the request to the real API
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5182/api';
    
    const response = await fetch(`${apiBaseUrl}/User/Create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fullName,
        email,
        password,
        role: role || 0, // 0 = User, 1 = Admin
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { status: 'error', message: errorData.message || `API request failed: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      status: 'success',
      message: data.message || 'User registered successfully',
      user: data.user || data.data || data
    });

  } catch {
    return NextResponse.json(
      { status: 'error', message: 'Internal server error' },
      { status: 500 }
    );
  }
}
