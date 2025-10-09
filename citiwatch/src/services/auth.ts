import { apiClient } from '@/lib/api-client';
import { LoginRequest, RegisterRequest, AuthResponse, LoginResponse } from '@/types/api';
import { User } from '@/types/auth';
import { SecureTokenStorage } from '@/utils/secureStorage';

export class AuthService {
  static async login(credentials: LoginRequest): Promise<{ success: boolean; message: string; data?: User }> {
    try {
      // First call login to get token
      const loginResponse = await apiClient.post<LoginResponse>('/User/Login', credentials);
      
      if (loginResponse.token) {
        // Store token securely
        SecureTokenStorage.setToken(loginResponse.token);
        
        // Also store token in cookies for middleware
        document.cookie = `token=${loginResponse.token}; path=/; max-age=${3 * 60 * 60}`; // 3 hours
        
        // Decode JWT to get user info (simplified - in production use a proper JWT library)
        const tokenPayload = JSON.parse(atob(loginResponse.token.split('.')[1]));
        
        // Extract user info from JWT claims
        const roleString = tokenPayload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || tokenPayload.role || 'User';
        const userId = tokenPayload.jti || tokenPayload.sub || tokenPayload.nameid;
        const userEmail = tokenPayload.sub || tokenPayload.email || credentials.email;
        
        // Try to fetch full user profile data from API (only works for admin users)
        let fullName = 'User'; // Default fallback
        let createdAt = new Date().toISOString();
        
        // Only try to fetch user profile if user is an admin (has access to GetAll endpoint)
        if (roleString === 'Admin') {
          try {
            const userProfileResponse = await apiClient.get<{
              message: string;
              status: boolean;
              data: Array<{
                id: string;
                fullName: string;
                email: string;
                role: number;
                createdOn: string;
                lastModifiedOn: string;
              }>;
            }>('/User/GetAll');

            // Find current user in the response
            const currentUser = userProfileResponse.data.find(user => user.id === userId);
            if (currentUser) {
              fullName = currentUser.fullName;
              createdAt = currentUser.createdOn;
            }
          } catch (profileError) {
            console.warn('Failed to fetch admin user profile:', profileError);
            // Keep using default fallback values
          }
        }
        
        const userData: User = {
          id: userId,
          email: userEmail,
          role: roleString === 'Admin' ? 'admin' : 'user',
          fullName: fullName,
          createdAt: createdAt,
          isActive: true
        };
        
        console.log('Login successful for:', userData.email, 'FullName:', userData.fullName, 'Role:', userData.role);
        
        SecureTokenStorage.setUser(userData);
        
        return {
          success: true,
          message: 'Login successful',
          data: userData
        };
      }
      
      return { success: false, message: 'Login failed' };
    } catch (error: unknown) {
      // Extract meaningful error message
      let errorMessage = 'Login failed';
      if (error instanceof Error && error.message) {
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
    } catch (error: unknown) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Registration failed'
      };
    }
  }

  static logout(): void {
    SecureTokenStorage.clearAuth();
    // Also remove token from cookies
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }

  static getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return SecureTokenStorage.getToken();
  }

  static getUser(): User | null {
    if (typeof window === 'undefined') return null;
    return SecureTokenStorage.getUser();
  }

  static isAuthenticated(): boolean {
    return SecureTokenStorage.hasToken();
  }
}