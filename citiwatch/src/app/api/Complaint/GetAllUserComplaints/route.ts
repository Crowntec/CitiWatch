import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Check for authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Dummy complaints data
    const dummyComplaints = [
      {
        id: '1',
        title: 'Broken streetlight on Main Street',
        description: 'The streetlight near the bus stop has been out for 3 days, making it dangerous for pedestrians at night.',
        status: 'Under Review',
        category: 'Infrastructure',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        imageUrl: null
      },
      {
        id: '2',
        title: 'Pothole on Oak Avenue',
        description: 'Large pothole causing damage to vehicles. Located near house number 123.',
        status: 'In Progress',
        category: 'Roads',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        imageUrl: null
      },
      {
        id: '3',
        title: 'Noise complaint from construction site',
        description: 'Construction work starting before 6 AM is violating city noise ordinances.',
        status: 'Resolved',
        category: 'Noise',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
        imageUrl: null
      }
    ];

    return NextResponse.json({
      success: true,
      data: dummyComplaints,
      message: 'Complaints retrieved successfully'
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
