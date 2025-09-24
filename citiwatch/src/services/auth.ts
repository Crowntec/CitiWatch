import { apiClient } from '@/lib/api-client';
import { LoginRequest, RegisterRequest, AuthResponse, LoginResponse } from '@/types/api';

export class AuthService {
  static async login(credentials: LoginRequest): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      // First call login to get token
      const loginResponse = await apiClient.post<LoginResponse>('/User/Login', credentials);
      
      if (loginResponse.token) {
        // Store token in localStorage
        localStorage.setItem('token', loginResponse.token);
        
        // Also store token in cookies for middleware
        document.cookie = `token=${loginResponse.token}; path=/; max-age=${3 * 60 * 60}`; // 3 hours
        
        // Decode JWT to get user info (simplified - in production use a proper JWT library)
        const tokenPayload = JSON.parse(atob(loginResponse.token.split('.')[1]));
        
        // Debug: Log the token payload to see what claims are available
        console.log('JWT Token Payload:', tokenPayload);
        
        // Create user object from token
        const userData = {
          id: tokenPayload.sub || tokenPayload.nameid,
          email: tokenPayload.email || credentials.email,
          role: tokenPayload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || tokenPayload.role || 'User',
          fullName: tokenPayload.name || credentials.email // fallback
        };
        
        // Debug: Log the extracted user data
        console.log('Extracted User Data:', userData);
        
        localStorage.setItem('user', JSON.stringify(userData));
        
        return {
          success: true,
          message: 'Login successful',
          data: userData
        };
      }
      
      return { success: false, message: 'Login failed' };
    } catch (error: any) {
      // Extract meaningful error message
      let errorMessage = 'Login failed';
      if (error.message) {
        // Remove "HTTP 400: " prefix if present
        errorMessage = error.message.replace(/^HTTP \d+:\s*/, '');
      }
      
      return { 
        success: false, 
        message: errorMessage
      };
    }
  }

  static async register(userData: RegisterRequest): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.post<AuthResponse>('/User/Create', userData);
      return {
        success: response.status,
        message: response.message
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Registration failed'
      };
    }
  }

  static logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Also remove token from cookies
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }

  static getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  }

  static getUser(): any | null {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }
}