import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Check for authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { status: 'error', message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const apiBaseUrl = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://citiwatch.runasp.net/api';
    const fullUrl = `${apiBaseUrl}/Complaint/GetAllUserComplaints`;
    
    console.log('Proxying request to:', fullUrl, 'with auth:', authHeader ? 'present' : 'missing');
    
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
    });

    if (!response.ok) {
      // Get the actual error from the backend
      const errorData = await response.json().catch(() => ({}));
      console.error('Backend API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
        url: `${apiBaseUrl}/Complaint/GetAllUserComplaints`
      });
      
      return NextResponse.json(
        { 
          status: 'error', 
          message: errorData.message || `API request failed: ${response.status} ${response.statusText}`,
          details: errorData
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      status: 'success',
      data: data.data || data,
      message: data.message || 'Complaints retrieved successfully'
    });

  } catch {
    return NextResponse.json(
      { status: 'error', message: 'Internal server error' },
      { status: 500 }
    );
  }
}
