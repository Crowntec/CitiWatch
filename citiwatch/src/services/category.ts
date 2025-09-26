import { apiClient } from '@/lib/api-client';

export interface Category {
  id: string;
  name: string;
  createdOn?: string;
  lastModifiedOn?: string;
}

export interface CategoryCreateRequest {
  name: string;
}

export interface CategoryUpdateRequest {
  name: string;
}

export class CategoryService {
  // Get all categories (available to authenticated users)
  static async getAllCategories(): Promise<{ success: boolean; data?: Category[]; message: string }> {
    try {
      const response = await apiClient.get<{ status: boolean; data: Category[]; message: string }>('/Category/GetAll');
      return {
        success: response.status,
        data: response.data,
        message: response.message
      };
    } catch (error: unknown) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch categories'
      };
    }
  }

  // Admin: Get category by ID
  static async getCategoryById(id: string): Promise<{ success: boolean; data?: Category; message: string }> {
    try {
      const response = await apiClient.get<{ status: boolean; data: Category; message: string }>(`/Category/Get/${id}`);
      return {
        success: response.status,
        data: response.data,
        message: response.message
      };
    } catch (error: unknown) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch category'
      };
    }
  }

  // Admin: Create new category
  static async createCategory(category: CategoryCreateRequest): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.post<{ status: boolean; message: string }>('/Category/Create', category);
      return {
        success: response.status,
        message: response.message
      };
    } catch (error: unknown) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create category'
      };
    }
  }

  // Admin: Update category
  static async updateCategory(id: string, category: CategoryUpdateRequest): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.put<{ status: boolean; message: string }>(`/Category/Update/${id}`, category);
      return {
        success: response.status,
        message: response.message
      };
    } catch (error: unknown) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update category'
      };
    }
  }

  // Admin: Delete category
  static async deleteCategory(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.put<{ status: boolean; message: string }>(`/Category/Delete/${id}`, {});
      return {
        success: response.status,
        message: response.message
      };
    } catch (error: unknown) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to delete category'
      };
    }
  }
}