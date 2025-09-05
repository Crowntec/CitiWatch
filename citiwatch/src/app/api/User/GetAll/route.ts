import { NextRequest, NextResponse } from 'next/server';

// Mock data for all users (admin view)
const mockAllUsers = [
  {
    id: '1',
    fullName: 'Demo User',
    email: 'demo@citiwatch.com',
    role: 1, // 1 = Admin
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    fullName: 'John Doe',
    email: 'john.doe@email.com',
    role: 0, // 0 = User
    createdAt: '2024-01-15T08:30:00Z'
  },
  {
    id: '3',
    fullName: 'Jane Smith',
    email: 'jane.smith@email.com',
    role: 0, // 0 = User
    createdAt: '2024-02-01T12:00:00Z'
  },
  {
    id: '4',
    fullName: 'Mike Johnson',
    email: 'mike.johnson@email.com',
    role: 0, // 0 = User
    createdAt: '2024-02-15T16:45:00Z'
  },
  {
    id: '5',
    fullName: 'Sarah Wilson',
    email: 'sarah.wilson@email.com',
    role: 1, // 1 = Admin
    createdAt: '2024-03-01T10:20:00Z'
  }
];

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

  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'Internal server error' },
      { status: 500 }
    );
  }
}
