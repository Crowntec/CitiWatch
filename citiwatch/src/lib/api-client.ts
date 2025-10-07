import { SecureTokenStorage } from '@/utils/secureStorage';

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
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
        
        // Read the response body once as text, then try to parse as JSON
        let errorMessage = `HTTP ${response.status}`;
        
        try {
          const responseText = await response.text();
          if (responseText) {
            try {
              const errorData = JSON.parse(responseText);
              errorMessage = errorData.message || errorData.Message || errorMessage;
            } catch {
              // If it's not JSON, use the text as the error message
              errorMessage = responseText;
            }
          }
        } catch {
          // If we can't read the response, use the status message
          errorMessage = response.statusText || errorMessage;
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
          fullUrl: url,
          method: options.method || 'GET',
          message: error instanceof Error ? error.message : 'Unknown error',
          errorType: error instanceof Error ? error.constructor.name : typeof error,
          hasToken: !!SecureTokenStorage.getToken(),
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
    
    // Get token from secure storage
    const token = typeof window !== 'undefined' ? SecureTokenStorage.getToken() : null;
    
    const config: RequestInit = {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        // Don't set Content-Type for FormData, let browser set it with boundary
      },
      body: formData,
    };

    // Debug log the request in development
    if (process.env.NODE_ENV === 'development') {
      console.log('🌐 API Form Request:', {
        method: 'POST',
        url: url,
        hasAuth: !!token,
        formDataKeys: Array.from(formData.keys()),
      });
    }

    try {
      const response = await fetch(url, config);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('📡 API Form Response:', {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok,
          headers: Object.fromEntries(response.headers.entries()),
        });
      }
      
      if (!response.ok) {
        // Read the response body once as text, then try to parse as JSON
        let errorMessage = `HTTP ${response.status}`;
        try {
          const responseText = await response.text();
          if (responseText) {
            try {
              const errorData = JSON.parse(responseText);
              errorMessage = errorData.message || errorData.Message || errorMessage;
            } catch {
              // If it's not JSON, use the text as the error message
              errorMessage = responseText;
            }
          }
        } catch {
          // If we can't read the response, use the default error message
        }
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      // Enhanced error logging - only in development
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ API Form Error:', {
          endpoint: endpoint,
          url: url,
          method: 'POST',
          hasToken: !!token,
          tokenPreview: token ? `${token.substring(0, 10)}...` : 'No token',
          error: error,
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
          errorStack: error instanceof Error ? error.stack : undefined,
        });
        
        // Log FormData contents for debugging
        console.log('📋 FormData contents:');
        for (const [key, value] of formData.entries()) {
          if (value instanceof File) {
            console.log(`  ${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
          } else {
            console.log(`  ${key}: ${value}`);
          }
        }
      }
      throw error;
    }
  }
}

export const apiClient = new ApiClient();