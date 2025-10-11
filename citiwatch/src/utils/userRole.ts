/**
 * User Role Utilities
 * Helper functions for role-based access control
 */

import { SecureTokenStorage } from '@/utils/secureStorage';

export class UserRoleUtils {
  /**
   * Get the current user's role from stored user data
   */
  static getCurrentUserRole(): string | null {
    const user = SecureTokenStorage.getUser();
    return user?.role || null;
  }

  /**
   * Check if the current user is an admin
   */
  static isCurrentUserAdmin(): boolean {
    const role = this.getCurrentUserRole();
    return role?.toLowerCase() === 'admin';
  }

  /**
   * Check if the current user is a regular user (not admin)
   */
  static isCurrentUserRegular(): boolean {
    const role = this.getCurrentUserRole();
    return role ? (role.toLowerCase() === 'user' || role.toLowerCase() !== 'admin') : false;
  }

  /**
   * Get role-appropriate complaint endpoint
   */
  static getComplaintsEndpoint(): string {
    if (this.isCurrentUserAdmin()) {
      return '/Complaint/GetAll'; // Admin sees all complaints
    } else {
      return '/Complaint/GetAllUserComplaints'; // Users see their own complaints
    }
  }

  /**
   * Log current user role information (development only)
   */
  static logUserRoleInfo(): void {
    if (process.env.NODE_ENV !== 'development') return;

    const user = SecureTokenStorage.getUser();
    const role = this.getCurrentUserRole();
    
    console.log('👤 User Role Info:', {
      userId: user?.id,
      email: user?.email,
      role: role,
      isAdmin: this.isCurrentUserAdmin(),
      complaintsEndpoint: this.getComplaintsEndpoint()
    });
  }
}