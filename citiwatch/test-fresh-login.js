// Test fresh login to get new JWT token
const testFreshLogin = async () => {
  try {
    console.log("Testing fresh login...");
    
    const loginResponse = await fetch("http://citiwatch.runasp.net/api/User/Login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        email: "princematthias64@gmail.com",
        password: "Prince@123"
      })
    });
    
    console.log("Login response status:", loginResponse.status);
    console.log("Login response headers:", Object.fromEntries(loginResponse.headers.entries()));
    const loginText = await loginResponse.text();
    console.log("Login response body:", loginText);
    
    if (loginResponse.ok) {
      const loginData = JSON.parse(loginText);
      if (loginData.token) {
        console.log("\n✅ Fresh token obtained!");
        
        // Decode the new token
        const payload = JSON.parse(Buffer.from(loginData.token.split('.')[1], 'base64').toString());
        console.log("New token payload:", JSON.stringify(payload, null, 2));
        
        // Test with the fresh token
        console.log("\nTesting GetAllUserComplaints with fresh token...");
        const testResponse = await fetch("http://citiwatch.runasp.net/api/Complaint/GetAllUserComplaints", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${loginData.token}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
          }
        });
        
        console.log("Test response status:", testResponse.status);
        const testText = await testResponse.text();
        console.log("Test response body:", testText);
        
        if (testResponse.ok) {
          console.log("\n🎉 SUCCESS! The API works with fresh token!");
        } else {
          console.log("\n❌ Still failing with fresh token");
        }
      }
    }
    
  } catch (error) {
    console.error("Test failed:", error);
  }
};

// Run the test
testFreshLogin();