// Test complaint submission using the EXACT same format as the working frontend
const https = require('https');
const { URL } = require('url');

function makeRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const requestOptions = {
            hostname: urlObj.hostname,
            port: urlObj.port || 443,
            path: urlObj.pathname + urlObj.search,
            method: options.method || 'GET',
            headers: options.headers || {}
        };

        const req = https.request(requestOptions, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    resolve({ 
                        ok: res.statusCode >= 200 && res.statusCode < 300, 
                        status: res.statusCode, 
                        json: () => Promise.resolve(parsed),
                        text: () => Promise.resolve(data)
                    });
                } catch (e) {
                    resolve({ 
                        ok: res.statusCode >= 200 && res.statusCode < 300, 
                        status: res.statusCode, 
                        text: () => Promise.resolve(data),
                        json: () => Promise.reject(new Error('Invalid JSON'))
                    });
                }
            });
        });

        req.on('error', reject);
        
        if (options.body) {
            req.write(options.body);
        }
        
        req.end();
    });
}

// Proper FormData implementation (simplified version of what browser does)
function createFormDataBody(fields, boundary) {
    let body = '';
    
    for (const [key, value] of fields) {
        body += `--${boundary}\r\n`;
        body += `Content-Disposition: form-data; name="${key}"\r\n`;
        body += '\r\n';
        body += value;
        body += '\r\n';
    }
    
    body += `--${boundary}--\r\n`;
    return body;
}

async function testComplaintSubmission() {
    try {
        const API_BASE = 'https://citiwatch-kappa.vercel.app/api/proxy';
        const timestamp = Date.now();
        const testUser = {
            email: `testcomplaint${timestamp}@example.com`,
            password: 'TestPass123!',
            fullName: 'Test Complaint User'
        };

        console.log('🚀 Testing complaint submission (frontend format)...\n');

        // Step 1: Register user
        console.log('1️⃣ Registering user:', testUser.email);
        const registerResponse = await makeRequest(`${API_BASE}/User/Create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testUser)
        });

        if (!registerResponse.ok) {
            const errorData = await registerResponse.json();
            console.error('❌ Registration failed:', errorData.message);
            return;
        }
        console.log('✅ Registration successful');

        // Step 2: Login
        console.log('\n2️⃣ Logging in...');
        const loginResponse = await makeRequest(`${API_BASE}/User/Login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: testUser.email,
                password: testUser.password
            })
        });

        if (!loginResponse.ok) {
            const errorData = await loginResponse.json();
            console.error('❌ Login failed:', errorData.message);
            return;
        }

        const loginData = await loginResponse.json();
        const token = loginData.token;
        console.log('✅ Login successful');

        // Step 3: Get categories
        console.log('\n3️⃣ Getting categories...');
        const categoryResponse = await makeRequest(`${API_BASE}/Category/GetAll`, {
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const categoryData = await categoryResponse.json();
        if (!categoryData.status || !categoryData.data?.length) {
            console.error('❌ No categories found');
            return;
        }

        const roadCategory = categoryData.data.find(cat => cat.name === 'Road') || categoryData.data[0];
        console.log(`✅ Using category: ${roadCategory.name}`);

        // Step 4: Submit complaint using FRONTEND FORMAT
        console.log('\n4️⃣ Submitting complaint (frontend format)...');
        
        const boundary = `----formdata-node-${Math.random().toString(36)}`;
        
        // Use EXACT same field names as frontend: Title, Description, CategoryId, Latitude, Longitude
        const formFields = [
            ['Title', 'Test Road Issue - Frontend Format'],
            ['Description', 'This is a test complaint using the exact same format as the working frontend application'],
            ['CategoryId', roadCategory.id],
            ['Latitude', '40.7128'],
            ['Longitude', '-74.0060']
        ];

        const formBody = createFormDataBody(formFields, boundary);

        const submitResponse = await makeRequest(`${API_BASE}/Complaint/Submit`, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': `multipart/form-data; boundary=${boundary}`
            },
            body: formBody
        });

        console.log('📡 Complaint submission status:', submitResponse.status);

        if (submitResponse.ok) {
            const submitData = await submitResponse.json();
            console.log('✅ Complaint submitted successfully!');
            console.log('📝 Response:', JSON.stringify(submitData, null, 2));

            // Step 5: Verify complaint was created
            console.log('\n5️⃣ Verifying complaint creation...');
            const verifyResponse = await makeRequest(`${API_BASE}/Complaint/GetAllUserComplaints`, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (verifyResponse.ok) {
                const verifyData = await verifyResponse.json();
                console.log('✅ Verification response:', JSON.stringify(verifyData, null, 2));
                
                if (verifyData.status && verifyData.data && verifyData.data.length > 0) {
                    console.log('\n🎉 COMPLETE SUCCESS!');
                    console.log('   ✅ User registration working');
                    console.log('   ✅ User login working'); 
                    console.log('   ✅ JWT authentication working');
                    console.log('   ✅ Proxy routing working');
                    console.log('   ✅ Category retrieval working');
                    console.log('   ✅ Complaint submission working');
                    console.log('   ✅ Complaint verification working');
                    console.log('\n🔧 ALL ISSUES RESOLVED - APPLICATION IS FULLY FUNCTIONAL!');
                } else {
                    console.log('⚠️ Complaint created but not found in user list');
                }
            } else {
                const errorText = await verifyResponse.text();
                console.log('❌ Verification failed:', errorText);
            }

        } else {
            const errorData = await submitResponse.text();
            console.log('❌ Complaint submission failed:', errorData);
        }

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testComplaintSubmission();