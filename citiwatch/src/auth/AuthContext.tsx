'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/services/auth';
import { UserService } from '@/services/user';
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
  isAdmin?: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in on app start
    const savedUser = SecureTokenStorage.getUser();
    if (savedUser && SecureTokenStorage.hasToken()) {
      setUser(savedUser);
      
      // Try to fetch updated user profile data if available
      // This will work for admin users and help refresh stale data
      if (savedUser.id) {
        fetchUserProfile(savedUser.id);
      }
    }
    setIsLoading(false);
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const profileResponse = await UserService.getCurrentUserProfile(userId);
      if (profileResponse.success && profileResponse.data) {
        const roleValue = typeof profileResponse.data.role === 'number' ? 
          (profileResponse.data.role === 1 ? 'admin' : 'user') : 
          profileResponse.data.role.toLowerCase();
        
        const updatedUser: User = {
          id: profileResponse.data.id,
          fullName: profileResponse.data.fullName,
          email: profileResponse.data.email,
          role: roleValue === 'admin' ? 'admin' : 'user',
          isActive: true
        };
        
        console.log('Updated user profile from API:', updatedUser.fullName);
        setUser(updatedUser);
        SecureTokenStorage.setUser(updatedUser);
      }
    } catch (error) {
      // Silently fail - this is just an enhancement, not critical
      console.log('Could not fetch user profile (likely insufficient permissions):', error);
    }
  };

  const login = async (email: string, password: string, redirectTo?: string) => {
    setIsLoading(true);
    try {
      const response = await AuthService.login({ email, password });
      
      if (response.success && response.data) {
        setUser(response.data);
        
        // Use setTimeout to ensure state is updated before redirect
        setTimeout(() => {
          // Redirect to intended page or default based on role
          const targetUrl = redirectTo || 
            (response.data?.role?.toLowerCase() === 'admin' ? '/admin' : '/dashboard');
          
          console.log('Login successful, redirecting to:', targetUrl);
          
          // Try router.replace first, fallback to window.location
          try {
            router.replace(targetUrl);
          } catch (error) {
            console.log('Router redirect failed, using window.location:', error);
            window.location.href = targetUrl;
          }
        }, 100);
        
        setIsLoading(false);
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

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
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
