import { apiClient } from '@/lib/api-client';

export interface Status {
  id: string;
  name: string;
  createdOn?: string;
  lastModifiedOn?: string;
}

export class StatusService {
  // Admin: Get all statuses
  static async getAllStatuses(): Promise<{ success: boolean; data?: Status[]; message: string }> {
    try {
      const response = await apiClient.get<{ status: boolean; data: Status[]; message: string }>('/Status/GetAll');
      return {
        success: response.status,
        data: response.data,
        message: response.message
      };
    } catch (error: unknown) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch statuses'
      };
    }
  }
}
