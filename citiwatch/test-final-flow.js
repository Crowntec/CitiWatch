// Complete end-to-end test: register -> login -> submit complaint
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

async function testCompleteFlow() {
    try {
        const API_BASE = 'https://citiwatch-kappa.vercel.app/api/proxy';
        const timestamp = Date.now();
        const testUser = {
            email: `complainttest${timestamp}@example.com`,
            password: 'TestPass123!',
            fullName: 'Complaint Test User'
        };

        console.log('🚀 Starting complete flow test...\n');

        // Step 1: Register user
        console.log('1️⃣ Registering new user:', testUser.email);
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

        const registerData = await registerResponse.json();
        console.log('✅ Registration successful:', registerData.message);

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
        console.log('✅ Login successful, token obtained');

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
        console.log(`✅ Using category: ${roadCategory.name} (${roadCategory.id})`);

        // Step 4: Submit complaint (no file)
        console.log('\n4️⃣ Submitting complaint without file...');
        
        const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substr(2);
        const formFields = [
            { name: 'title', value: 'Test Road Issue - Complete Flow' },
            { name: 'description', value: 'This is a test complaint from the complete end-to-end flow verification' },
            { name: 'categoryId', value: roadCategory.id },
            { name: 'latitude', value: '40.7128' },
            { name: 'longitude', value: '-74.0060' }
        ];

        let formBody = '';
        formFields.forEach(field => {
            formBody += `--${boundary}\r\n`;
            formBody += `Content-Disposition: form-data; name="${field.name}"\r\n\r\n`;
            formBody += field.value + '\r\n';
        });
        formBody += `--${boundary}--\r\n`;

        const submitResponse = await makeRequest(`${API_BASE}/Complaint/Submit`, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': `multipart/form-data; boundary=${boundary}`,
                'Content-Length': Buffer.byteLength(formBody)
            },
            body: formBody
        });

        console.log('📡 Complaint submission status:', submitResponse.status);

        if (submitResponse.ok) {
            const submitData = await submitResponse.json();
            console.log('✅ Complaint submitted successfully!');
            console.log('📝 Response:', JSON.stringify(submitData, null, 2));
        } else {
            const errorData = await submitResponse.text();
            console.log('❌ Complaint submission failed:', errorData);
        }

        // Step 5: Verify by getting user complaints
        console.log('\n5️⃣ Verifying complaint was created...');
        const verifyResponse = await makeRequest(`${API_BASE}/Complaint/GetAllUserComplaints`, {
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (verifyResponse.ok) {
            const verifyData = await verifyResponse.json();
            console.log('✅ User complaints retrieved:', JSON.stringify(verifyData, null, 2));
            
            if (verifyData.status && verifyData.data && verifyData.data.length > 0) {
                console.log('\n🎉 SUCCESS! Complete end-to-end flow working:');
                console.log('   ✅ User registration');
                console.log('   ✅ User login'); 
                console.log('   ✅ JWT authentication');
                console.log('   ✅ Category retrieval');
                console.log('   ✅ Complaint submission');
                console.log('   ✅ Complaint verification');
                console.log('\n🔧 All major issues have been resolved!');
            } else {
                console.log('⚠️ Complaint submission may have failed - no complaints found');
            }
        } else {
            const errorData = await verifyResponse.text();
            console.log('❌ Failed to verify complaints:', errorData);
        }

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error('Stack trace:', error.stack);
    }
}

testCompleteFlow();