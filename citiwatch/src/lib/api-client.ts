import { SecureTokenStorage } from '@/utils/secureStorage';

class ApiClient {
  private baseUrl: string;

  constructor() {
    // Always use proxy route for consistent JWT handling
    // The proxy route ensures proper authentication forwarding
    this.baseUrl = '/api/proxy';
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



    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        // Handle 401 Unauthorized - immediate redirect to landing page
        if (response.status === 401) {
          // Clear any existing auth data immediately
          if (typeof window !== 'undefined') {
            SecureTokenStorage.clearAuth();
            
            // Clear auth cookie
            document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            
            // Immediate redirect to landing page (no preserving redirect URL)
            window.location.href = '/';
          }
          
          throw new Error('Session expired. Please log in again.');
        }

        // Handle 403 Forbidden - likely authentication/authorization issue
        if (response.status === 403) {
          // Clear auth data and redirect to login on forbidden access
          if (typeof window !== 'undefined') {
            SecureTokenStorage.clearAuth();
            window.location.href = '/login';
          }
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
      throw error;
    }
  }
}

export const apiClient = new ApiClient();