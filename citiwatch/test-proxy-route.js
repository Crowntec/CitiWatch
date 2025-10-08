// Quick test to verify the fixes are working
const testUrl = window.location.origin + '/api/proxy/Category/GetAll';
console.log('Testing proxy route:', testUrl);

// Test if we can get categories (this should work without authentication)
fetch(testUrl)
  .then(response => response.json())
  .then(data => {
    console.log('✅ Proxy route working - Categories response:', data);
  })
  .catch(error => {
    console.error('❌ Proxy route failed:', error);
  });