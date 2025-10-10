'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/services/auth';
import { UserService, UserProfile } from '@/services/user';
import { SecureTokenStorage } from '@/utils/secureStorage';
import { User } from '@/types/auth';

interface RegisterData {
  fullName: string;
  email: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, redirectTo?: string) => Promise<{ success: boolean; message: string }>;
  register: (userData: RegisterData) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  isAdmin?: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to map UserProfile to User
function mapProfileToUser(profile: UserProfile, baseUser: User): User {
  return {
    id: profile.id,
    fullName: profile.fullName,
    email: profile.email,
    role: baseUser.role, // Keep the role from JWT token/base user
    createdAt: baseUser.createdAt,
    isActive: baseUser.isActive
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in on app start
    const initializeAuth = async () => {
      const savedUser = SecureTokenStorage.getUser();
      
      if (savedUser && SecureTokenStorage.hasToken()) {
        try {
          // Try to fetch the latest user profile
          const profileResponse = await UserService.getUserProfile();
          
          if (profileResponse.success && profileResponse.data) {
            // Update with fresh profile data
            const fullUserData = mapProfileToUser(profileResponse.data, savedUser);
            // Update stored user data with fresh profile
            SecureTokenStorage.setUser(fullUserData);
            setUser(fullUserData);
          } else {
            // Use stored data if profile fetch fails
            setUser(savedUser);
          }
        } catch {
          // If profile fetch fails, fallback to stored user data
          setUser(savedUser);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string, redirectTo?: string) => {
    setIsLoading(true);
    try {
      const response = await AuthService.login({ email, password });
      
      if (response.success && response.data) {
        // Set user state immediately
        setUser(response.data);
        
        // After successful login, fetch the full user profile
        try {
          const profileResponse = await UserService.getUserProfile();
          
          if (profileResponse.success && profileResponse.data) {
            // Update the user data with the full profile information
            const fullUserData = mapProfileToUser(profileResponse.data, response.data);
            
            // Update stored user data with full profile
            SecureTokenStorage.setUser(fullUserData);
            setUser(fullUserData);
          } else {
            // If profile fetch fails, still use the basic user data from JWT
            // User is already set above
          }
        } catch {
          // If profile fetch fails, still use the basic user data from JWT
          // User is already set above
        }
        
        setIsLoading(false);
        
        // Use window.location.href for more reliable navigation in production
        if (redirectTo) {
          window.location.href = redirectTo;
        } else if (response.data?.role?.toLowerCase() === 'admin') {
          window.location.href = '/admin';
        } else {
          window.location.href = '/dashboard';
        }
        
        return { success: true, message: response.message };
      }
      
      setIsLoading(false);
      return { success: false, message: response.message };
    } catch (error) {
      setIsLoading(false);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Login failed' 
      };
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      const response = await AuthService.register(userData);
      return response;
    } catch (error) {
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Registration failed' 
      };
    }
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
    router.push('/login');
  };

  const refreshProfile = async () => {
    if (user && SecureTokenStorage.hasToken()) {
      try {
        const profileResponse = await UserService.getUserProfile();
        
        if (profileResponse.success && profileResponse.data) {
          const fullUserData = mapProfileToUser(profileResponse.data, user);
          // Update stored user data
          SecureTokenStorage.setUser(fullUserData);
          setUser(fullUserData);
        }
      } catch {
        // Silently fail - profile refresh is not critical
      }
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    refreshProfile,
    isAdmin: user?.role?.toLowerCase() === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
