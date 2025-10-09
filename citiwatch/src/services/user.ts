import { apiClient } from '@/lib/api-client';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: string | number; // Backend might return enum as number or string
  createdOn: string;
  lastModifiedOn: string;
}

export interface UserCreateRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface UserUpdateRequest {
  fullName: string;
  email: string;
}

export class UserService {
  // Get current user profile by fetching from GetAll and filtering by user ID
  static async getCurrentUserProfile(userId: string): Promise<{ success: boolean; data?: User; message: string }> {
    try {
      // Try to get user profile - this might fail for non-admin users
      const response = await apiClient.get<{ status: boolean; data: User[]; message: string }>('/User/GetAll');
      
      if (response.status && response.data) {
        // Find current user in the list
        const currentUser = response.data.find(user => user.id === userId);
        
        if (currentUser) {
          return {
            success: true,
            data: currentUser,
            message: 'User profile retrieved successfully'
          };
        } else {
          return {
            success: false,
            message: 'User not found in results'
          };
        }
      }
      
      return {
        success: false,
        message: response.message || 'Failed to fetch user profile'
      };
    } catch (error: unknown) {
      // This will happen for non-admin users (403 Forbidden)
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Access denied - unable to fetch user profile'
      };
    }
  }

  // Admin: Get all users
  static async getAllUsers(): Promise<{ success: boolean; data?: User[]; message: string }> {
    try {
      const response = await apiClient.get<{ status: boolean; data: User[]; message: string }>('/User/GetAll');
      
      // Debug logging
      if (process.env.NODE_ENV === 'development' && response.data) {
        console.log('Raw user data from API:', response.data);
        response.data.forEach(user => {
          console.log(`User: ${user.email}, Role: ${user.role} (type: ${typeof user.role})`);
        });
      }
      
      return {
        success: response.status,
        data: response.data,
        message: response.message
      };
    } catch (error: unknown) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch users'
      };
    }
  }

  // Create regular user
  static async createUser(user: UserCreateRequest): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.post<{ status: boolean; message: string }>('/User/Create', user);
      return {
        success: response.status,
        message: response.message
      };
    } catch (error: unknown) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create user'
      };
    }
  }

  // Admin: Create admin user
  static async createAdminUser(user: UserCreateRequest): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.post<{ status: boolean; message: string }>('/User/CreateAdmin', user);
      return {
        success: response.status,
        message: response.message
      };
    } catch (error: unknown) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create admin user'
      };
    }
  }

  // Update user
  static async updateUser(id: string, user: UserUpdateRequest): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.put<{ status: boolean; message: string }>(`/User/Update/${id}`, user);
      return {
        success: response.status,
        message: response.message
      };
    } catch (error: unknown) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update user'
      };
    }
  }

  // Admin: Delete user
  static async deleteUser(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.post<{ status: boolean; message: string }>(`/User/Delete/${id}`, {});
      return {
        success: response.status,
        message: response.message
      };
    } catch (error: unknown) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to delete user'
      };
    }
  }
}
