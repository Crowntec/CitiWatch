import { NextRequest, NextResponse } from 'next/server';

// Mock category data - replace with actual database queries
const mockCategories = [
  {
    id: '1',
    name: 'Road Maintenance',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Street Lighting',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    name: 'Waste Management',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    name: 'Water & Sewage',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '5',
    name: 'Public Safety',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '6',
    name: 'Parks & Recreation',
    createdAt: '2024-01-01T00:00:00Z'
  }
];

export async function GET(request: NextRequest) {
  try {
    // TODO: Add authentication check here
    // const authHeader = request.headers.get('authorization');
    // if (!authHeader) {
    //   return NextResponse.json(
    //     { success: false, message: 'Authentication required' },
    //     { status: 401 }
    //   );
    // }

    // TODO: Replace with actual database query
    // const categories = await prisma.category.findMany({
    //   orderBy: {
    //     name: 'asc'
    //   }
    // });

    const categories = mockCategories;

    return NextResponse.json({
      success: true,
      data: categories,
      message: 'Categories retrieved successfully'
    });

  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}
