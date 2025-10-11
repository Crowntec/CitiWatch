// Quick API test script for browser console
// Copy and paste this into the browser console on any CitiWatch page

async function testComplaintsAPI() {
  console.group('🧪 Testing Complaints API');
  
  // Get current token
  const token = localStorage.getItem('authToken');
  console.log('Token available:', !!token);
  
  if (token) {
    // Decode token payload
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('Token payload:', {
        sub: payload.sub,
        role: payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
        exp: new Date(payload.exp * 1000).toISOString(),
        isExpired: Date.now() / 1000 > payload.exp
      });
    } catch (e) {
      console.error('Failed to decode token:', e);
    }
  }
  
  // Test the exact endpoint that's failing
  try {
    console.log('Testing GET /api/proxy/Complaint/GetAllUserComplaints...');
    
    const response = await fetch('/api/proxy/Complaint/GetAllUserComplaints', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    let responseData;
    try {
      responseData = await response.json();
    } catch {
      responseData = await response.text();
    }
    
    console.log('Response data:', responseData);
    
  } catch (error) {
    console.error('Request failed:', error);
  }
  
  console.groupEnd();
}

// Run the test
testComplaintsAPI();