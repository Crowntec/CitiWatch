// Test direct API call to GetAllUserComplaints
const testDirectAPICall = async () => {
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJwcmluY2VtYXR0aGlhczY0QGdtYWlsLmNvbSIsImp0aSI6IjMwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlVzZXIiLCJleHAiOjE3Mzg0MzMwOTYsImlzcyI6IkNpdGlXYXRjaCIsImF1ZCI6IkNpdGlXYXRjaC1Vc2VycyJ9.ZGD8hsJoEB1RDjH8KX7YJAvgXpYiMD3X0m7OLmKLT-E";
  
  try {
    console.log("Testing direct API call to GetAllUserComplaints...");
    
    // Test 1: Direct call to backend
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
    
    // Test 2: Via proxy
    console.log("\n2. Testing via proxy:");
    const proxyResponse = await fetch("http://localhost:3000/api/proxy/Complaint/GetAllUserComplaints", {
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
    
  } catch (error) {
    console.error("Test failed:", error);
  }
};

// Run the test
testDirectAPICall();