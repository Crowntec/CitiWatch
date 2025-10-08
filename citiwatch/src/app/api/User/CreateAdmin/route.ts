import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, email, password, adminKey } = body;

    // Check for admin key (you can set this in your environment variables)
    const ADMIN_CREATION_KEY = process.env.ADMIN_CREATION_KEY || 'CitiWatch-Admin-2024';
    
    if (!adminKey || adminKey !== ADMIN_CREATION_KEY) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid admin creation key' },
        { status: 403 }
      );
    }

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

    // Forward the request to the real API with Admin role
    const apiBaseUrl = 'http://citiwatch.runasp.net/api';
    
    const response = await fetch(`${apiBaseUrl}/User/Create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fullName,
        email,
        password,
        role: 1, // 1 = Admin role
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
      message: 'Admin user created successfully',
      user: data.user || data.data || data
    });

  } catch (error) {
    console.error('Admin creation error:', error);
    return NextResponse.json(
      { status: 'error', message: 'Internal server error' },
      { status: 500 }
    );
  }
}