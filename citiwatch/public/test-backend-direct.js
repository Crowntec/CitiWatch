// Direct backend test - run this in browser console
async function testBackendDirect() {
  const token = localStorage.getItem('authToken');
  
  console.log('🎯 Testing DIRECT backend API call...');
  console.log('Token:', token ? `${token.substring(0,20)}...${token.slice(-10)}` : 'none');
  
  try {
    // Test direct backend call
    const response = await fetch('http://citiwatch.runasp.net/api/Complaint/GetAllUserComplaints', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    
    console.log('🔍 Direct Backend Response:');
    console.log('Status:', response.status, response.statusText);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('Raw response:', responseText);
    
    if (responseText) {
      try {
        const json = JSON.parse(responseText);
        console.log('Parsed JSON:', json);
      } catch {
        console.log('Response is not JSON');
      }
    }
    
  } catch (error) {
    console.error('❌ Direct backend test failed:', error);
  }
}

// Run the test
testBackendDirect();