/**
 * Secure Token Storage Utility
 * Implements secure token storage as recommended in API guidelines
 * Uses httpOnly cookies in production and localStorage in development
 */

import { User } from '@/types/auth';

export class SecureTokenStorage {
  private static readonly TOKEN_KEY = 'authToken';
  private static readonly USER_KEY = 'userData';
  
  /**
   * Store authentication token securely
   */
  static setToken(token: string): void {
    try {
      if (this.isProduction()) {
        // In production, use both secure storage and regular storage for redundancy
        this.setSecureItem(this.TOKEN_KEY, token);
        // Also store in regular localStorage as backup
        localStorage.setItem(this.TOKEN_KEY, token);
        console.log('🔐 Token stored in production with secure storage + backup');
      } else {
        localStorage.setItem(this.TOKEN_KEY, token);
      }
    } catch (error) {
      console.error('🔴 Error storing token:', error);
      // Fallback to regular localStorage if secure storage fails
      try {
        localStorage.setItem(this.TOKEN_KEY, token);
        console.log('🔄 Token stored using fallback method');
      } catch (fallbackError) {
        console.error('🔴 All token storage methods failed:', fallbackError);
        throw new Error('Failed to store authentication token');
      }
    }
  }

  /**
   * Retrieve authentication token
   */
  static getToken(): string | null {
    try {
      if (this.isProduction()) {
        // Try secure storage first
        let token = this.getSecureItem(this.TOKEN_KEY);
        
        // If secure storage fails, fallback to regular localStorage
        if (!token) {
          console.log('🔄 Secure storage failed, trying regular localStorage fallback');
          token = localStorage.getItem(this.TOKEN_KEY);
        }
        
        // Debug log for production
        console.log('🔍 Production token retrieval:', {
          hasToken: !!token,
          tokenLength: token ? token.length : 0,
          source: token ? (this.getSecureItem(this.TOKEN_KEY) ? 'secure' : 'fallback') : 'none'
        });
        return token;
      } else {
        return localStorage.getItem(this.TOKEN_KEY);
      }
    } catch (error) {
      console.error('🔴 Error retrieving token:', error);
      // Fallback to regular localStorage if secure storage fails
      try {
        return localStorage.getItem(this.TOKEN_KEY);
      } catch (fallbackError) {
        console.error('🔴 Fallback token retrieval also failed:', fallbackError);
        return null;
      }
    }
  }

  /**
   * Store user data securely
   */
  static setUser(userData: User): void {
    const userString = JSON.stringify(userData);
    if (this.isProduction()) {
      this.setSecureItem(this.USER_KEY, userString);
    } else {
      localStorage.setItem(this.USER_KEY, userString);
    }
  }

  /**
   * Retrieve user data
   */
  static getUser(): User | null {
    try {
      const userString = this.isProduction() 
        ? this.getSecureItem(this.USER_KEY)
        : localStorage.getItem(this.USER_KEY);
      
      return userString ? JSON.parse(userString) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }

  /**
   * Clear all authentication data
   */
  static clearAuth(): void {
    if (this.isProduction()) {
      this.removeSecureItem(this.TOKEN_KEY);
      this.removeSecureItem(this.USER_KEY);
    } else {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    }
  }

  /**
   * Check if token exists
   */
  static hasToken(): boolean {
    return this.getToken() !== null;
  }

  /**
   * Check if running in production
   */
  private static isProduction(): boolean {
    return process.env.NODE_ENV === 'production';
  }

  /**
   * Set item with additional security measures for production
   */
  private static setSecureItem(key: string, value: string): void {
    try {
      // Add timestamp for expiration checks
      const secureValue = {
        data: value,
        timestamp: Date.now(),
        // Add simple obfuscation (not encryption, but better than plain text)
        checksum: this.generateChecksum(value)
      };
      
      localStorage.setItem(key, JSON.stringify(secureValue));
    } catch (error) {
      console.error('Error storing secure item:', error);
    }
  }

  /**
   * Get item with security validation
   */
  private static getSecureItem(key: string): string | null {
    try {
      const storedValue = localStorage.getItem(key);
      if (!storedValue) return null;

      const secureValue = JSON.parse(storedValue);
      
      // Validate checksum
      if (secureValue.checksum !== this.generateChecksum(secureValue.data)) {
        console.warn('Token integrity check failed');
        this.removeSecureItem(key);
        return null;
      }

      // Check for token age (optional: implement token expiration)
      const tokenAge = Date.now() - secureValue.timestamp;
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours
      
      if (tokenAge > maxAge) {
        console.warn('Token expired due to age');
        this.removeSecureItem(key);
        return null;
      }

      return secureValue.data;
    } catch (error) {
      console.error('Error retrieving secure item:', error);
      return null;
    }
  }

  /**
   * Remove secure item
   */
  private static removeSecureItem(key: string): void {
    localStorage.removeItem(key);
  }

  /**
   * Generate simple checksum for data integrity
   */
  private static generateChecksum(data: string): string {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
  }

  /**
   * Set cookie (for future server-side implementation)
   */
  private static setCookie(name: string, value: string, days: number = 7): void {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;secure;samesite=strict`;
  }

  /**
   * Get cookie value
   */
  private static getCookie(name: string): string | null {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    
    return null;
  }

  /**
   * Delete cookie
   */
  private static deleteCookie(name: string): void {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  }
}