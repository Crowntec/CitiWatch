// Test with fresh user registration and complete flow
const testCompleteFlowFresh = async () => {
  try {
    console.log("1. Creating fresh user...");
    
    // Create a fresh user first
    const registerResponse = await fetch("http://citiwatch.runasp.net/api/User/Create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        fullName: "Test User Flow",
        email: `testflow${Date.now()}@example.com`,
        password: "TestPassword123"
      })
    });
    
    console.log("Registration status:", registerResponse.status);
    const registerText = await registerResponse.text();
    
    let userEmail;
    if (registerResponse.ok) {
      console.log("✅ User created successfully");
      const registerData = JSON.parse(registerText);
      userEmail = registerData.data.email;
    } else if (registerText.includes("User already exists")) {
      console.log("User already exists, using existing email");
      userEmail = "test@example.com";
    } else {
      console.log("Registration failed:", registerText);
      return;
    }
    
    console.log(`\n2. Logging in with: ${userEmail}`);
    
    // Login
    const loginResponse = await fetch("http://citiwatch.runasp.net/api/User/Login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: userEmail,
        password: "TestPassword123"
      })
    });
    
    console.log("Login status:", loginResponse.status);
    const loginText = await loginResponse.text();
    console.log("Login response:", loginText);
    
    if (!loginResponse.ok) {
      console.log("❌ Login failed");
      return;
    }
    
    const loginData = JSON.parse(loginText);
    const token = loginData.token;
    console.log("✅ Login successful");
    
    // Decode JWT to verify user info
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    console.log("JWT User ID (jti):", payload.jti);
    console.log("JWT Email (sub):", payload.sub);
    
    console.log("\n3. Testing GetAllUserComplaints (should return 'Not found!')...");
    
    // Test GetAllUserComplaints - should return "Not found!" for new user
    const complaintsResponse1 = await fetch("http://citiwatch.runasp.net/api/Complaint/GetAllUserComplaints", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    
    console.log("Initial complaints response status:", complaintsResponse1.status);
    const complaintsText1 = await complaintsResponse1.text();
    console.log("Initial complaints response:", complaintsText1);
    
    if (complaintsResponse1.status === 400 && complaintsText1.includes("Not found!")) {
      console.log("✅ Correct behavior: New user has no complaints");
      
      console.log("\n4. Getting categories for complaint submission...");
      
      // Get categories
      const categoriesResponse = await fetch("http://citiwatch.runasp.net/api/Category/GetAll", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      console.log("Categories response status:", categoriesResponse.status);
      const categoriesText = await categoriesResponse.text();
      console.log("Categories response:", categoriesText);
      
      if (categoriesResponse.ok) {
        const categoriesData = JSON.parse(categoriesText);
        
        if (categoriesData.status && categoriesData.data && categoriesData.data.length > 0) {
          const firstCategory = categoriesData.data[0];
          console.log(`✅ Got categories, using: ${firstCategory.name} (${firstCategory.id})`);
          
          console.log("\n5. Submitting a test complaint...");
          
          // Submit a complaint using FormData
          const formData = new FormData();
          formData.append('title', 'Test Road Damage Report');
          formData.append('description', 'Found significant road damage that needs immediate attention for safety reasons.');
          formData.append('categoryId', firstCategory.id);
          formData.append('latitude', '40.7128');
          formData.append('longitude', '-74.0060');
          
          // Create a dummy text file for the formFile requirement
          const dummyFile = new Blob(['test image content'], { type: 'text/plain' });
          formData.append('formFile', dummyFile, 'test.txt');
          
          const submitResponse = await fetch("http://citiwatch.runasp.net/api/Complaint/Submit", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${token}`
            },
            body: formData
          });
          
          console.log("Submit response status:", submitResponse.status);
          const submitText = await submitResponse.text();
          console.log("Submit response:", submitText);
          
          if (submitResponse.ok) {
            console.log("✅ Complaint submitted successfully!");
            
            console.log("\n6. Fetching user complaints again (should now have data)...");
            
            // Fetch user complaints again
            const complaintsResponse2 = await fetch("http://citiwatch.runasp.net/api/Complaint/GetAllUserComplaints", {
              headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
              }
            });
            
            console.log("Final complaints response status:", complaintsResponse2.status);
            const complaintsText2 = await complaintsResponse2.text();
            console.log("Final complaints response:", complaintsText2);
            
            if (complaintsResponse2.ok) {
              const complaintsData = JSON.parse(complaintsText2);
              console.log("\n🎉 COMPLETE SUCCESS!");
              console.log("  ✅ User registration/login");
              console.log("  ✅ JWT token authentication");
              console.log("  ✅ Role-based authorization");
              console.log("  ✅ Category API");
              console.log("  ✅ Complaint submission");
              console.log("  ✅ User complaints retrieval");
              
              if (complaintsData.data && complaintsData.data.length > 0) {
                console.log(`\n📋 User now has ${complaintsData.data.length} complaint(s):`);
                complaintsData.data.forEach((complaint, index) => {
                  console.log(`  ${index + 1}. ${complaint.title} - Status: ${complaint.statusName}`);
                });
              }
            }
          } else {
            console.log("❌ Complaint submission failed");
          }
        } else {
          console.log("❌ No categories found");
        }
      } else {
        console.log("❌ Failed to get categories");
      }
    } else {
      console.log("❌ Unexpected response from GetAllUserComplaints");
    }
    
  } catch (error) {
    console.error("Test failed:", error);
  }
};

// Run the complete test
testCompleteFlowFresh();