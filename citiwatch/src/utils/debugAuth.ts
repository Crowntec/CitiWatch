/**
 * Authentication Debug Utilities
 * Helper functions to debug authentication issues
 */

import { SecureTokenStorage } from '@/utils/secureStorage';

interface TokenInfo {
  hasToken: boolean;
  tokenLength: number;
  isValid: boolean;
  payload?: Record<string, unknown>;
  expiresAt?: string;
  isExpired?: boolean;
}

export class AuthDebugger {
  /**
   * Get detailed information about the current token
   */
  static getTokenInfo(): TokenInfo {
    const token = SecureTokenStorage.getToken();
    
    if (!token) {
      return {
        hasToken: false,
        tokenLength: 0,
        isValid: false
      };
    }

    try {
      // Decode JWT payload
      const parts = token.split('.');
      if (parts.length !== 3) {
        return {
          hasToken: true,
          tokenLength: token.length,
          isValid: false
        };
      }

      const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
      const exp = payload.exp;
      const expiresAt = exp ? new Date(exp * 1000).toISOString() : undefined;
      const isExpired = exp ? Date.now() / 1000 > exp : false;

      return {
        hasToken: true,
        tokenLength: token.length,
        isValid: true,
        payload,
        expiresAt,
        isExpired
      };
    } catch {
      return {
        hasToken: true,
        tokenLength: token.length,
        isValid: false
      };
    }
  }

  /**
   * Log comprehensive auth debug information
   */
  static logAuthStatus(): void {
    if (process.env.NODE_ENV !== 'development') return;

    const tokenInfo = this.getTokenInfo();
    const user = SecureTokenStorage.getUser();

    console.group('🔐 Authentication Debug Status');
    console.log('Token Info:', tokenInfo);
    console.log('User Data:', user ? {
      id: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName
    } : 'No user data');
    console.log('Storage Type:', process.env.NODE_ENV !== 'development' ? 'Secure' : 'localStorage');
    console.groupEnd();
  }

  /**
   * Check if user should be authenticated based on stored data
   */
  static shouldBeAuthenticated(): boolean {
    const tokenInfo = this.getTokenInfo();
    const user = SecureTokenStorage.getUser();
    
    return tokenInfo.hasToken && 
           tokenInfo.isValid && 
           !tokenInfo.isExpired && 
           user !== null;
  }

  /**
   * Clear authentication and log the action
   */
  static clearAuthWithLogging(): void {
    if (process.env.NODE_ENV === 'development') {
      console.log('🧹 Clearing authentication data due to invalid/expired token');
    }
    SecureTokenStorage.clearAuth();
  }
}
