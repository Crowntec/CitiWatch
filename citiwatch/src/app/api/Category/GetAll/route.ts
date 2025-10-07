import { NextResponse } from 'next/server';
export async function GET() {
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
