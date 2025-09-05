import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Check for authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { status: 'error', message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const categoryId = formData.get('categoryId') as string;
    const latitude = formData.get('latitude') as string;
    const longitude = formData.get('longitude') as string;
    const file = formData.get('formFile') as File;

    // Validation
    if (!title || !description || !categoryId) {
      return NextResponse.json(
        { status: 'error', message: 'Title, description, and category are required' },
        { status: 400 }
      );
    }

    if (title.length < 5 || title.length > 200) {
      return NextResponse.json(
        { status: 'error', message: 'Title must be between 5 and 200 characters' },
        { status: 400 }
      );
    }

    if (description.length < 10 || description.length > 2000) {
      return NextResponse.json(
        { status: 'error', message: 'Description must be between 10 and 2000 characters' },
        { status: 400 }
      );
    }

    // File validation
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { status: 'error', message: 'Only JPEG, PNG, and GIF images are allowed' },
          { status: 400 }
        );
      }

      if (file.size > 10 * 1024 * 1024) { // 10MB
        return NextResponse.json(
          { status: 'error', message: 'File size must be less than 10MB' },
          { status: 400 }
        );
      }
    }

    // Simulate successful complaint submission
    const newComplaint = {
      id: `complaint-${Date.now()}`,
      title,
      description,
      categoryId,
      latitude: latitude || null,
      longitude: longitude || null,
      status: 'pending',
      createdAt: new Date().toISOString(),
      userId: 'user-1', // In real app, extract from token
      imageUrl: file ? `/uploads/${file.name}` : null
    };

    // In real app, save to database and upload file
    console.log('New complaint submitted:', newComplaint);

    return NextResponse.json({
      status: 'success',
      data: newComplaint,
      message: 'Complaint submitted successfully'
    });

  } catch (error) {
    console.error('Error submitting complaint:', error);
    return NextResponse.json(
      { status: 'error', message: 'Internal server error' },
      { status: 500 }
    );
  }
}
