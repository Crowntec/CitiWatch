import { apiClient } from '@/lib/api-client';

export interface Complaint {
  id: string;
  title: string;
  description: string;
  categoryName: string;
  statusName: string;
  userName?: string;
  userEmail?: string;
  latitude?: string;
  longitude?: string;
  mediaUrl?: string;
  createdOn: string;
  lastModifiedOn: string;
}

export interface ComplaintCreateRequest {
  title: string;
  description: string;
  categoryId: string;
  latitude?: string;
  longitude?: string;
}

export interface ComplaintStatusUpdateRequest {
  id: string;
}

export class ComplaintService {
  // Admin: Get all complaints
  static async getAllComplaints(): Promise<{ success: boolean; data?: Complaint[]; message: string }> {
    try {
      const response = await apiClient.get<{ status: boolean; data: Complaint[]; message: string }>('/Complaint/GetAll');
      return {
        success: response.status,
        data: response.data,
        message: response.message
      };
    } catch (error: unknown) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch complaints'
      };
    }
  }

  // User: Get user's complaints
  static async getUserComplaints(): Promise<{ success: boolean; data?: Complaint[]; message: string }> {
    try {
      const response = await apiClient.get<{ status: boolean; data: Complaint[]; message: string }>('/Complaint/GetAllUserComplaints');
      return {
        success: response.status,
        data: response.data,
        message: response.message
      };
    } catch (error: unknown) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch user complaints'
      };
    }
  }

  // Admin: Get complaint by ID
  static async getComplaintById(id: string): Promise<{ success: boolean; data?: Complaint; message: string }> {
    try {
      const response = await apiClient.get<{ status: boolean; data: Complaint; message: string }>(`/Complaint/GetById/${id}`);
      return {
        success: response.status,
        data: response.data,
        message: response.message
      };
    } catch (error: unknown) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch complaint'
      };
    }
  }

  // User: Submit complaint
  static async submitComplaint(complaint: ComplaintCreateRequest, file?: File): Promise<{ success: boolean; message: string }> {
    try {
      console.log('🔍 ComplaintService - Input data:', complaint);
      console.log('🔍 ComplaintService - File:', file);
      
      const formData = new FormData();
      formData.append('Title', complaint.title);
      formData.append('Description', complaint.description);
      formData.append('CategoryId', complaint.categoryId);
      
      if (complaint.latitude) {
        formData.append('Latitude', complaint.latitude);
      }
      if (complaint.longitude) {
        formData.append('Longitude', complaint.longitude);
      }
      if (file) {
        formData.append('formFile', file);
      }

      // Debug: Log FormData contents
      console.log('🔍 FormData contents:');
      for (const [key, value] of formData.entries()) {
        console.log(`  ${key}:`, value);
      }

      const response = await apiClient.postForm<{ status: boolean; message: string }>('/Complaint/Submit', formData);
      
      console.log('🔍 ComplaintService - Backend response:', response);
      return {
        success: response.status,
        message: response.message
      };
    } catch (error: unknown) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to submit complaint'
      };
    }
  }

  // Admin: Update complaint status
  static async updateComplaintStatus(id: string, statusUpdate: ComplaintStatusUpdateRequest): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.put<{ status: boolean; message: string }>(`/Complaint/UpdateStatus/${id}`, statusUpdate);
      return {
        success: response.status,
        message: response.message
      };
    } catch (error: unknown) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update complaint status'
      };
    }
  }
}
