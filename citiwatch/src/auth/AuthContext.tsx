'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/services/auth';

interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  createdOn?: string;
  lastModifiedOn?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (userData: any) => Promise<{ success: boolean; message: string }>;
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
    const savedUser = AuthService.getUser();
    if (savedUser) {
      setUser(savedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await AuthService.login({ email, password });
      
      if (response.success) {
        setUser(response.data);
        
        // Redirect based on role
        if (response.data?.role?.toLowerCase() === 'admin') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
        
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

  const register = async (userData: any) => {
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
