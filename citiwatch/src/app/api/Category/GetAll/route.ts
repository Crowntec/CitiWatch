import { NextRequest, NextResponse } from 'next/server';

// Mock data for categories
const mockCategories = [
  { id: '1', name: 'Road & Transportation', createdAt: '2024-01-01T00:00:00Z' },
  { id: '2', name: 'Water & Sewage', createdAt: '2024-01-02T00:00:00Z' },
  { id: '3', name: 'Waste Management', createdAt: '2024-01-03T00:00:00Z' },
  { id: '4', name: 'Street Lighting', createdAt: '2024-01-04T00:00:00Z' },
  { id: '5', name: 'Parks & Recreation', createdAt: '2024-01-05T00:00:00Z' },
  { id: '6', name: 'Public Safety', createdAt: '2024-01-06T00:00:00Z' },
  { id: '7', name: 'Noise Complaints', createdAt: '2024-01-07T00:00:00Z' },
  { id: '8', name: 'Building & Construction', createdAt: '2024-01-08T00:00:00Z' },
  { id: '9', name: 'Environmental Issues', createdAt: '2024-01-09T00:00:00Z' },
  { id: '10', name: 'Other', createdAt: '2024-01-10T00:00:00Z' }
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

    // Return mock categories
    return NextResponse.json({
      status: 'success',
      data: mockCategories,
      message: 'Categories retrieved successfully'
    });

  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'Internal server error' },
      { status: 500 }
    );
  }
}
