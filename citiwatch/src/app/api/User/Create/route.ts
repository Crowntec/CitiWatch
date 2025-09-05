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

    // Check if user already exists (dummy check)
    if (email === 'demo@citiwatch.com') {
      return NextResponse.json(
        { status: 'error', message: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Simulate successful registration
    const newUser = {
      id: `user-${Date.now()}`,
      fullName,
      email,
      role: role || 0, // 0 = User, 1 = Admin
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({
      status: 'success',
      message: 'User registered successfully',
      user: newUser
    });

  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'Internal server error' },
      { status: 500 }
    );
  }
}
