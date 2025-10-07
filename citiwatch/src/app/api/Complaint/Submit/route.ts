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

    // Forward the request to the real API
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5182/api';
    
    // Create FormData for the API request
    const apiFormData = new FormData();
    apiFormData.append('title', title);
    apiFormData.append('description', description);
    apiFormData.append('categoryId', categoryId);
    
    if (latitude) apiFormData.append('latitude', latitude);
    if (longitude) apiFormData.append('longitude', longitude);
    if (file) apiFormData.append('formFile', file);

    const response = await fetch(`${apiBaseUrl}/Complaint/Submit`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
      },
      body: apiFormData,
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
      data: data.data || data,
      message: data.message || 'Complaint submitted successfully'
    });

  } catch (error) {
    console.error('Error submitting complaint:', error);
    return NextResponse.json(
      { status: 'error', message: 'Internal server error' },
      { status: 500 }
    );
  }
}
