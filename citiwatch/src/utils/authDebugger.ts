import { apiClient } from '@/lib/api-client';
import { SecureTokenStorage } from '@/utils/secureStorage';

export class AuthDebugger {
  static async testAuth() {
    console.log('🔍 Auth Debugger - Starting tests...');
    
    // Test 1: Check local storage
    const localToken = SecureTokenStorage.getToken();
    console.log('📱 Local token:', localToken ? `Present (${localToken.length} chars)` : 'Missing');
    
    // Test 2: Check cookies
    const cookieToken = document.cookie.split(';').find(c => c.trim().startsWith('token='));
    console.log('🍪 Cookie token:', cookieToken ? 'Present' : 'Missing');
    
    // Test 3: Test API auth endpoint
    try {
      const authTest = await apiClient.get('/debug/auth');
      console.log('🌐 Auth API test:', authTest);
    } catch (error) {
      console.error('❌ Auth API test failed:', error);
    }
    
    // Test 4: Test category API
    try {
      const categoryTest = await apiClient.get('/Category/GetAll');
      console.log('📋 Category API test:', categoryTest);
    } catch (error) {
      console.error('❌ Category API test failed:', error);
    }
    
    console.log('🔍 Auth Debugger - Tests completed');
  }
}

// Make it available globally for console debugging
if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).AuthDebugger = AuthDebugger;
}