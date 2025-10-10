/**
 * Debug utility for authentication issues
 * Use this in browser console to diagnose and fix token storage issues
 */

import { SecureTokenStorage } from './secureStorage';

export class AuthDebugger {
  static inspectTokenStorage() {
    console.group('🔍 Auth Token Storage Inspection');
    
    // Check localStorage contents
    console.log('📦 localStorage contents:');
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('auth') || key.includes('token') || key.includes('user'))) {
        const value = localStorage.getItem(key);
        console.log(`  ${key}: ${value ? value.substring(0, 50) + '...' : 'null'}`);
      }
    }
    
    // Test SecureTokenStorage methods
    console.log('\n🔐 SecureTokenStorage tests:');
    
    try {
      const token = SecureTokenStorage.getToken();
      console.log('  getToken():', token ? `${token.substring(0, 20)}... (length: ${token.length})` : 'null');
      
      const user = SecureTokenStorage.getUser();
      console.log('  getUser():', user ? `${user.email} (${user.role})` : 'null');
      
      const hasToken = SecureTokenStorage.hasToken();
      console.log('  hasToken():', hasToken);
      
      // Validate JWT format if token exists
      if (token) {
        const parts = token.split('.');
        console.log('  JWT parts count:', parts.length);
        if (parts.length === 3) {
          try {
            const payload = JSON.parse(atob(parts[1]));
            console.log('  JWT payload keys:', Object.keys(payload));
            console.log('  JWT expires:', payload.exp ? new Date(payload.exp * 1000) : 'no expiry');
          } catch (e) {
            console.error('  JWT decode error:', e);
          }
        }
      }
    } catch (error) {
      console.error('  SecureTokenStorage error:', error);
    }
    
    console.groupEnd();
  }
  
  static clearAllAuthData() {
    console.log('🧹 Clearing all authentication data...');
    SecureTokenStorage.clearAuth();
    console.log('✅ All auth data cleared');
  }
  
  static fixCorruptedTokens() {
    console.log('🔧 Attempting to fix corrupted tokens...');
    
    // Get raw token from localStorage
    const rawToken = localStorage.getItem('authToken');
    if (rawToken) {
      // Check if it's a JWT token
      if (rawToken.split('.').length === 3) {
        console.log('✅ Found valid JWT token, re-storing properly...');
        SecureTokenStorage.setToken(rawToken);
        console.log('✅ Token re-stored successfully');
      } else {
        console.log('❌ Token does not appear to be a valid JWT');
        this.clearAllAuthData();
      }
    } else {
      console.log('ℹ️ No token found in localStorage');
    }
  }
  
  static testApiCall() {
    console.log('🌐 Testing API call with current token...');
    
    const token = SecureTokenStorage.getToken();
    if (!token) {
      console.error('❌ No token available for testing');
      return;
    }
    
    fetch('/api/proxy/User/GetCurrentUser', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      console.log('🌐 API Response status:', response.status);
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    })
    .then(data => {
      console.log('✅ API call successful:', data);
    })
    .catch(error => {
      console.error('❌ API call failed:', error);
    });
  }
}

// Make available globally in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (globalThis as { AuthDebugger?: typeof AuthDebugger }).AuthDebugger = AuthDebugger;
  console.log('🔧 AuthDebugger available: window.AuthDebugger');
}