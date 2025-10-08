// Test submitting a complaint first, then fetching user complaints
const testCompleteFlow = async () => {
  try {
    console.log("1. Logging in...");
    
    // Login first
    const loginResponse = await fetch("http://citiwatch.runasp.net/api/User/Login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: "test@example.com",
        password: "TestPassword123"
      })
    });
    
    if (!loginResponse.ok) {
      console.log("Login failed");
      return;
    }
    
    const loginData = await loginResponse.json();
    const token = loginData.token;
    console.log("✅ Login successful, got token");
    
    console.log("\n2. Getting categories...");
    
    // Get categories first to submit a complaint
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
        console.log("✅ Got categories, using:", firstCategory.name);
        
        console.log("\n3. Submitting a test complaint...");
        
        // Submit a complaint
        const formData = new FormData();
        formData.append('title', 'Test Pothole Issue');
        formData.append('description', 'There is a large pothole on the main road causing vehicle damage.');
        formData.append('categoryId', firstCategory.id);
        formData.append('latitude', '40.7128');
        formData.append('longitude', '-74.0060');
        
        const submitResponse = await fetch("http://citiwatch.runasp.net/api/Complaint/Submit", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`
            // Don't set Content-Type for FormData
          },
          body: formData
        });
        
        console.log("Submit response status:", submitResponse.status);
        const submitText = await submitResponse.text();
        console.log("Submit response:", submitText);
        
        if (submitResponse.ok) {
          console.log("✅ Complaint submitted successfully!");
          
          console.log("\n4. Fetching user complaints...");
          
          // Now fetch user complaints
          const complaintsResponse = await fetch("http://citiwatch.runasp.net/api/Complaint/GetAllUserComplaints", {
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          });
          
          console.log("User complaints response status:", complaintsResponse.status);
          const complaintsText = await complaintsResponse.text();
          console.log("User complaints response:", complaintsText);
          
          if (complaintsResponse.ok) {
            console.log("\n🎉 COMPLETE SUCCESS! The entire flow is working:");
            console.log("  ✅ User login");
            console.log("  ✅ JWT authentication");
            console.log("  ✅ Category retrieval");
            console.log("  ✅ Complaint submission");
            console.log("  ✅ User complaints retrieval");
            
            const complaintsData = JSON.parse(complaintsText);
            if (complaintsData.data && complaintsData.data.length > 0) {
              console.log(`\n📋 User now has ${complaintsData.data.length} complaint(s)`);
            }
          }
        }
      }
    }
    
  } catch (error) {
    console.error("Test failed:", error);
  }
};

// Run the complete test
testCompleteFlow();