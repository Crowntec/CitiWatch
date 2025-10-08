import { NextRequest, NextResponse } from 'next/server';

// Mock data for all complaints (admin view)
const mockAllComplaints = [
  {
    id: '1',
    title: 'Broken streetlight on Main Street',
    description: 'The streetlight near the bus stop has been out for 3 days, making it dangerous for pedestrians at night.',
    status: 'pending',
    category: 'Street Lighting',
    userName: 'Demo User',
    createdAt: '2024-12-01T10:00:00Z',
    imageUrl: null
  },
  {
    id: '2',
    title: 'Pothole on Oak Avenue',
    description: 'Large pothole causing damage to vehicles. Located near house number 123.',
    status: 'in progress',
    category: 'Road & Transportation',
    userName: 'Demo User',
    createdAt: '2024-11-28T14:30:00Z',
    imageUrl: null
  },
  {
    id: '3',
    title: 'Noise complaint from construction site',
    description: 'Construction work starting before 6 AM is violating city noise ordinances.',
    status: 'resolved',
    category: 'Noise Complaints',
    userName: 'Demo User',
    createdAt: '2024-11-25T09:15:00Z',
    imageUrl: null
  },
  {
    id: '4',
    title: 'Overflowing garbage bin at Central Park',
    description: 'The garbage bin is overflowing and attracting pests. Needs immediate attention.',
    status: 'pending',
    category: 'Waste Management',
    userName: 'John Doe',
    createdAt: '2024-11-20T16:45:00Z',
    imageUrl: null
  },
  {
    id: '5',
    title: 'Broken playground equipment',
    description: 'The swing set at Riverside Park has a broken chain, making it unsafe for children.',
    status: 'in progress',
    category: 'Parks & Recreation',
    userName: 'Jane Smith',
    createdAt: '2024-11-18T11:20:00Z',
    imageUrl: null
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

    // Sort complaints by creation date (newest first)
    const sortedComplaints = mockAllComplaints.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({
      status: 'success',
      data: sortedComplaints,
      message: 'All complaints retrieved successfully'
    });

  } catch {
    return NextResponse.json(
      { status: 'error', message: 'Internal server error' },
      { status: 500 }
    );
  }
}
