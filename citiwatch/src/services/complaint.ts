import { apiClient } from '@/lib/api-client';
import { ApiResponse } from '@/types/api';

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
      // The backend GetAllUserComplaints endpoint uses GET method and extracts user ID from JWT token
      // ValidatorHelper.GetUserId() automatically gets the user ID from the 'jti' claim in the JWT
      console.log('Fetching user complaints via GET /Complaint/GetAllUserComplaints');
      
      const response = await apiClient.get<{ status: boolean; data: Complaint[]; message: string }>('/Complaint/GetAllUserComplaints');
      return {
        success: response.status,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      // Handle the case where user has no complaints (backend returns "Not found!" with 400 status)
      if (error instanceof Error && error.message === 'Not found!') {
        console.log('User has no complaints yet - returning empty array');
        return {
          success: true,
          data: [],
          message: 'No complaints found'
        };
      }
      
      console.error('Failed to fetch user complaints:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch complaints'
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
      // Always use FormData as backend expects [FromForm] attribute
      const formData = new FormData();
      
      // Create minimal ComplaintCreateDto structure to stay under 16KB limit
      formData.append('Title', complaint.title);
      formData.append('Description', complaint.description);
      formData.append('CategoryId', complaint.categoryId);
      
      // Only append coordinates if they exist and are not empty
      if (complaint.latitude && complaint.latitude.trim() !== '') {
        formData.append('Latitude', complaint.latitude.trim());
      }
      if (complaint.longitude && complaint.longitude.trim() !== '') {
        formData.append('Longitude', complaint.longitude.trim());
      }
      
      // Always append formFile - backend expects it even if empty
      if (file) {
        formData.append('formFile', file);
      } else {
        // Create an empty file blob when no file is selected
        const emptyFile = new File([''], '', { type: 'application/octet-stream' });
        formData.append('formFile', emptyFile);
      }

      const response = await apiClient.postForm<{ status: boolean; message: string }>('/Complaint/Submit', formData);
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
