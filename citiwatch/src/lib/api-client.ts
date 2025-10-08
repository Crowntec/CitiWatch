import { SecureTokenStorage } from '@/utils/secureStorage';

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5182/api';
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    // Get token from secure storage
    const token = typeof window !== 'undefined' ? SecureTokenStorage.getToken() : null;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    // Safe logging for development only
    if (process.env.NODE_ENV === 'development') {
      console.log('🌐 API Request:', {
        method: options.method || 'GET',
        endpoint: endpoint,
        url: url.replace(this.baseUrl, ''), // Just show the endpoint path
        hasAuth: !!token,
        // Never log the actual token or sensitive headers
      });
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        // Handle 401 Unauthorized - redirect to login
        if (response.status === 401) {
          // Only log in development
          if (process.env.NODE_ENV === 'development') {
            console.warn('🔒 Authentication required - redirecting to login');
          }
          
          // Clear any existing auth data
          if (typeof window !== 'undefined') {
            SecureTokenStorage.clearAuth();
            
            // Clear auth cookie
            document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            
            // Store current path for redirect after login
            const currentPath = window.location.pathname;
            
            // Redirect to login page with return URL
            setTimeout(() => {
              window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
            }, 1000); // Brief delay to show any loading states
          }
          
          throw new Error('Session expired. Please log in again.');
        }
        
        // Clone response to read body without consuming the stream
        const responseClone = response.clone();
        let errorMessage = `HTTP ${response.status}`;
        
        try {
          const errorData = await responseClone.json();
          errorMessage = errorData.message || errorData.Message || errorMessage;
        } catch {
          // If parsing as JSON fails, try as text on the original response
          try {
            const errorText = await response.text();
            errorMessage = errorText || errorMessage;
          } catch {
            // If both fail, use the status message
            errorMessage = response.statusText || errorMessage;
          }
        }
        throw new Error(errorMessage);
      }

      // Check if response has content before trying to parse JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        // For non-JSON responses, return empty object or handle accordingly
        const text = await response.text();
        return (text ? JSON.parse(text) : {}) as T;
      }
    } catch (error) {
      // Safe error logging - only in development
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ API Error:', {
          endpoint: endpoint,
          method: options.method || 'GET',
          message: error instanceof Error ? error.message : 'Unknown error',
          // Never log the full error object which might contain sensitive data
        });
      }
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  async postForm<T>(endpoint: string, formData: FormData): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    // Get token from localStorage if available
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    const config: RequestInit = {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        // Don't set Content-Type for FormData, let browser set it with boundary
      },
      body: formData,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        // Try to parse the error response as JSON first
        let errorMessage = `HTTP ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.Message || errorMessage;
        } catch {
          // If parsing as JSON fails, try as text
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      // Safe error logging - only in development
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ API Form Error:', {
          endpoint: endpoint,
          message: error instanceof Error ? error.message : 'Unknown error',
        });
      }
      throw error;
    }
  }
}

export const apiClient = new ApiClient();