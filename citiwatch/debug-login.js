// Simple test to debug login issue
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

        console.log('Making request to:', requestOptions);

        const req = https.request(requestOptions, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                console.log('Response status:', res.statusCode);
                console.log('Response headers:', res.headers);
                console.log('Response data:', data);
                
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

        req.on('error', (error) => {
            console.error('Request error:', error);
            reject(error);
        });
        
        if (options.body) {
            console.log('Request body:', options.body);
            req.write(options.body);
        }
        
        req.end();
    });
}

async function testLogin() {
    try {
        console.log('🚀 Testing login...');

        const API_BASE = 'https://citiwatch-kappa.vercel.app/api/proxy';
        
        const loginResponse = await makeRequest(`${API_BASE}/User/Login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'testflow1759933298357@example.com',
                password: 'TestPass123!'
            })
        });

        console.log('Login response ok:', loginResponse.ok);
        console.log('Login response status:', loginResponse.status);

        if (loginResponse.ok) {
            const data = await loginResponse.json();
            console.log('✅ Login successful:', data);
        } else {
            const errorText = await loginResponse.text();
            console.log('❌ Login failed:', errorText);
        }

    } catch (error) {
        console.error('❌ Error:', error);
    }
}

testLogin();