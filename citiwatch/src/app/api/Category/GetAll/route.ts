import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Check for authorization header and pass it through
    const authHeader = request.headers.get('authorization');
    
    const apiBaseUrl = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://citiwatch.runasp.net/api';
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // Add authorization header if present
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }
    
    const response = await fetch(`${apiBaseUrl}/Category/GetAll`, {
      method: 'GET',
      headers,
    });

    console.log('Category API request to:', `${apiBaseUrl}/Category/GetAll`, 'Auth:', authHeader ? 'present' : 'missing');
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Category API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
        url: `${apiBaseUrl}/Category/GetAll`
      });
      
      return NextResponse.json(
        { 
          success: false, 
          message: errorData.message || `API request failed: ${response.status} ${response.statusText}`,
          details: errorData
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      data: data.data || data,
      message: data.message || 'Categories retrieved successfully'
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
