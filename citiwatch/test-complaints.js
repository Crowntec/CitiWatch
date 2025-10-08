// Test the JWT token with GetAllUserComplaints endpoint
const testGetUserComplaints = async () => {
  try {
    // Use the JWT token we got from the previous login
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0dXNlckBleGFtcGxlLmNvbSIsImp0aSI6IjMzNDE4ODUzLTNiZGMtNGM0Mi04NDllLTM3YzMzOTc4NmY0ZCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlVzZXIiLCJleHAiOjE3Mjg0MDQ3MjMsImlzcyI6IkNpdGlXYXRjaCIsImF1ZCI6IkNpdGlXYXRjaC1Vc2VycyJ9.b0oSRdZ3u6GsNKc4_l8Vd5YjYz7h4mR3H9rL4sG6yCU";
    
    console.log("Testing GetAllUserComplaints with fresh JWT token...");
    
    // Test 1: Direct backend call
    console.log("\n1. Testing direct backend call:");
    const directResponse = await fetch("http://citiwatch.runasp.net/api/Complaint/GetAllUserComplaints", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    });
    
    console.log("Direct response status:", directResponse.status);
    console.log("Direct response headers:", Object.fromEntries(directResponse.headers.entries()));
    const directText = await directResponse.text();
    console.log("Direct response body:", directText);
    
    // Test 2: Via local proxy
    console.log("\n2. Testing via proxy:");
    const proxyResponse = await fetch("http://localhost:3001/api/proxy/Complaint/GetAllUserComplaints", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    });
    
    console.log("Proxy response status:", proxyResponse.status);
    console.log("Proxy response headers:", Object.fromEntries(proxyResponse.headers.entries()));
    const proxyText = await proxyResponse.text();
    console.log("Proxy response body:", proxyText);
    
    // Decode the JWT to show the claims
    console.log("\n3. JWT Token Claims:");
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    console.log("User ID (jti):", payload.jti);
    console.log("Email (sub):", payload.sub);
    console.log("Role:", payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']);
    console.log("Expires:", new Date(payload.exp * 1000).toISOString());
    
  } catch (error) {
    console.error("Test failed:", error);
  }
};

// Run the test
testGetUserComplaints();