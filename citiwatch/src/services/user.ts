import { apiClient } from '@/lib/api-client';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
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
  // Admin: Get all users
  static async getAllUsers(): Promise<{ success: boolean; data?: User[]; message: string }> {
    try {
      const response = await apiClient.get<{ status: boolean; data: User[]; message: string }>('/User/GetAll');
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
