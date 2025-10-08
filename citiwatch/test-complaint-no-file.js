// Test complaint submission without file upload
const https = require('https');
const { URL } = require('url');

const API_BASE = 'https://citiwatch-kappa.vercel.app/api/proxy';

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
                    resolve({ ok: res.statusCode < 400, status: res.statusCode, json: () => Promise.resolve(parsed) });
                } catch (e) {
                    resolve({ ok: res.statusCode < 400, status: res.statusCode, text: () => Promise.resolve(data) });
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

async function testComplaintSubmissionNoFile() {
    try {
        console.log('\n🚀 Testing Complaint Submission (No File)...\n');

        // First login to get token
        const loginResponse = await makeRequest(`${API_BASE}/User/Login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'testflow1759933298357@example.com',
                password: 'TestPass123!'
            })
        });

        if (!loginResponse.ok) {
            const errorText = loginResponse.text ? await loginResponse.text() : 'Login failed';
            console.error('❌ Login failed:', errorText);
            return;
        }

        const loginData = await loginResponse.json();
        const token = loginData.token;
        console.log('✅ Login successful, token obtained');

        // Get categories to get a valid category ID
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

        // Create multipart form data manually
        const boundary = '----formdata-boundary-' + Math.random().toString(36);
        const formFields = [
            { name: 'title', value: 'Test Road Issue - No File' },
            { name: 'description', value: 'This is a test complaint submission without file upload to verify the API works correctly' },
            { name: 'categoryId', value: roadCategory.id },
            { name: 'latitude', value: '40.7128' },
            { name: 'longitude', value: '-74.0060' }
        ];

        let formBody = '';
        formFields.forEach(field => {
            formBody += `--${boundary}\r\n`;
            formBody += `Content-Disposition: form-data; name="${field.name}"\r\n\r\n`;
            formBody += `${field.value}\r\n`;
        });
        formBody += `--${boundary}--\r\n`;

        // Submit complaint
        const submitResponse = await makeRequest(`${API_BASE}/Complaint/Submit`, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': `multipart/form-data; boundary=${boundary}`
            },
            body: formBody
        });

        console.log('📡 Complaint submission response status:', submitResponse.status);

        const submitData = submitResponse.json ? await submitResponse.json() : await submitResponse.text();
        console.log('📄 Response:', typeof submitData === 'string' ? submitData : JSON.stringify(submitData, null, 2));

        if (submitData.status) {
            console.log('✅ Complaint submitted successfully!');
            
            // Now verify by getting user complaints
            console.log('\n🔍 Verifying complaint was created...');
            const verifyResponse = await makeRequest(`${API_BASE}/Complaint/GetAllUserComplaints`, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const verifyData = await verifyResponse.json();
            console.log('✅ User complaints after submission:', JSON.stringify(verifyData, null, 2));
            
        } else {
            console.error('❌ Complaint submission failed:', submitData.message || 'Unknown error');
        }

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error('Stack trace:', error.stack);
    }
}

testComplaintSubmissionNoFile();