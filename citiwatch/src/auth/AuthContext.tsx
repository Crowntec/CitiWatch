'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, AuthContextType } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user credentials for development
const mockCredentials = [
  {
    email: 'admin@citiwatch.com',
    password: 'admin123',
    user: {
      id: '1',
      fullName: 'Admin User',
      email: 'admin@citiwatch.com',
      role: 'admin' as const,
      createdAt: new Date().toISOString(),
      isActive: true
    }
  },
  {
    email: 'user@citiwatch.com',
    password: 'user123',
    user: {
      id: '2',
      fullName: 'Regular User',
      email: 'user@citiwatch.com',
      role: 'user' as const,
      createdAt: new Date().toISOString(),
      isActive: true
    }
  },
  {
    email: 'demo@citiwatch.com',
    password: 'password123',
    user: {
      id: '3',
      fullName: 'Demo User',
      email: 'demo@citiwatch.com',
      role: 'user' as const,
      createdAt: new Date().toISOString(),
      isActive: true
    }
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for existing auth on mount
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find matching credentials
    const matchedCredential = mockCredentials.find(
      cred => cred.email === email && cred.password === password
    );
    
    if (!matchedCredential) {
      setIsLoading(false);
      throw new Error('Invalid email or password');
    }
    
    // Generate token
    const token = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Store auth data
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(matchedCredential.user));
    
    // Also store in cookies for middleware
    document.cookie = `token=${token}; path=/; secure; samesite=strict`;
    
    setUser(matchedCredential.user);
    setIsLoading(false);
    
    // Redirect based on role
    if (matchedCredential.user.role === 'admin') {
      router.push('/admin');
    } else {
      router.push('/dashboard');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Clear cookies
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    
    setUser(null);
    router.push('/login');
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
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
