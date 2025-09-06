/**
 * Utility functions for making authenticated API requests
 * Implements proper token handling, status checks, and error handling
 */

interface ApiResponse<T = unknown> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
  [key: string]: unknown;
}

/**
 * Makes an authenticated API request with proper error handling
 * @param url - The API endpoint URL
 * @param options - Fetch options
 * @returns Promise with API response or null if authentication failed
 */
export const makeAuthenticatedRequest = async <T = unknown>(
  url: string, 
  options: RequestInit = {}
): Promise<ApiResponse<T> | null> => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    // Redirect to login if no token
    window.location.href = '/login';
    return null;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      },
    });

    // Handle token expiration
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      return null;
    }

    const data: ApiResponse<T> = await response.json();
    
    // Always check status field as per guidelines
    if (data.status !== 'success') {
      throw new Error(data.message || 'Request failed');
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

/**
 * Makes a public API request (no authentication required)
 * @param url - The API endpoint URL
 * @param options - Fetch options
 * @returns Promise with API response
 */
export const makePublicRequest = async <T = unknown>(
  url: string, 
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      },
    });

    const data: ApiResponse<T> = await response.json();
    
    // Always check status field
    if (data.status !== 'success') {
      throw new Error(data.message || 'Request failed');
    }

    return data;
  } catch (error) {
    console.error('Public API request failed:', error);
    throw error;
  }
};

/**
 * Utility function to check if user has admin role
 */
export const isUserAdmin = (): boolean => {
  const userData = localStorage.getItem('user');
  if (!userData) return false;
  
  try {
    const user = JSON.parse(userData);
    return user.role === 'admin';
  } catch (error) {
    console.error('Error parsing user data:', error);
    return false;
  }
};

/**
 * Utility function to get current user data
 */
export const getCurrentUser = (): { fullName: string; email: string; role?: string } | null => {
  const userData = localStorage.getItem('user');
  if (!userData) return null;
  
  try {
    return JSON.parse(userData);
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

/**
 * Validation utilities matching backend validation rules
 */
export const validation = {
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  },
  
  password: (password: string): boolean => {
    return password.length >= 8;
  },
  
  fullName: (name: string): boolean => {
    return name.trim().length >= 2;
  },
  
  required: (value: string): boolean => {
    return value.trim().length > 0;
  }
};

/**
 * Client-side validation for forms
 */
export const validateForm = (fields: Record<string, string>, rules: Record<string, string[]>): string[] => {
  const errors: string[] = [];
  
  Object.entries(rules).forEach(([field, fieldRules]) => {
    const value = fields[field] || '';
    
    fieldRules.forEach(rule => {
      switch (rule) {
        case 'required':
          if (!validation.required(value)) {
            errors.push(`${field} is required`);
          }
          break;
        case 'email':
          if (value && !validation.email(value)) {
            errors.push(`${field} must be a valid email address`);
          }
          break;
        case 'password':
          if (value && !validation.password(value)) {
            errors.push(`${field} must be at least 8 characters long`);
          }
          break;
        case 'fullName':
          if (value && !validation.fullName(value)) {
            errors.push(`${field} must be at least 2 characters long`);
          }
          break;
      }
    });
  });
  
  return errors;
};
