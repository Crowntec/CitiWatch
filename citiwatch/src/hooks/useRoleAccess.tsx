/**
 * Role-Based Access Control Hook
 * Provides granular permission checking as per API guidelines
 */

import { useAuth } from '@/auth/AuthContext';

export interface RolePermissions {
  // User permissions
  isUser: boolean;
  isAdmin: boolean;
  
  // Complaint permissions
  canSubmitComplaint: boolean;
  canViewOwnComplaints: boolean;
  canViewAllComplaints: boolean;
  canUpdateComplaintStatus: boolean;
  canDeleteComplaint: boolean;
  
  // User management permissions
  canViewAllUsers: boolean;
  canCreateUser: boolean;
  canCreateAdmin: boolean;
  canUpdateUser: boolean;
  canDeleteUser: boolean;
  canViewUserDetails: boolean;
  
  // Category management permissions
  canViewCategories: boolean;
  canCreateCategory: boolean;
  canUpdateCategory: boolean;
  canDeleteCategory: boolean;
  
  // Status management permissions
  canViewStatuses: boolean;
  canCreateStatus: boolean;
  canUpdateStatus: boolean;
  canDeleteStatus: boolean;
  
  // Profile permissions
  canUpdateOwnProfile: boolean;
  canViewOwnProfile: boolean;
  
  // Dashboard permissions
  canViewAdminDashboard: boolean;
  canViewUserDashboard: boolean;
  
  // Reports and analytics
  canViewReports: boolean;
  canExportData: boolean;
}

export const useRoleAccess = (): RolePermissions => {
  const { user } = useAuth();
  
  // Determine user role
  const isAdmin = user?.role === 'admin';
  const isUser = user?.role === 'user' || !isAdmin;
  
  return {
    // Basic role checks
    isUser,
    isAdmin,
    
    // Complaint permissions
    canSubmitComplaint: true, // Both users and admins can submit complaints
    canViewOwnComplaints: true, // Both can view their own
    canViewAllComplaints: isAdmin, // Only admins can view all complaints
    canUpdateComplaintStatus: isAdmin, // Only admins can update status
    canDeleteComplaint: isAdmin, // Only admins can delete complaints
    
    // User management permissions (Admin only)
    canViewAllUsers: isAdmin,
    canCreateUser: isAdmin,
    canCreateAdmin: isAdmin,
    canUpdateUser: isAdmin,
    canDeleteUser: isAdmin,
    canViewUserDetails: isAdmin,
    
    // Category management permissions (Admin only)
    canViewCategories: true, // Both can view categories for complaint submission
    canCreateCategory: isAdmin,
    canUpdateCategory: isAdmin,
    canDeleteCategory: isAdmin,
    
    // Status management permissions (Admin only)
    canViewStatuses: true, // Both can view statuses
    canCreateStatus: isAdmin,
    canUpdateStatus: isAdmin,
    canDeleteStatus: isAdmin,
    
    // Profile permissions
    canUpdateOwnProfile: true, // Both can update their own profile
    canViewOwnProfile: true, // Both can view their own profile
    
    // Dashboard permissions
    canViewAdminDashboard: isAdmin,
    canViewUserDashboard: isUser && !isAdmin, // Regular users only
    
    // Reports and analytics
    canViewReports: isAdmin,
    canExportData: isAdmin,
  };
};

/**
 * Higher-order component for role-based route protection
 */
export interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'user' | 'any';
  requiredPermission?: keyof RolePermissions;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole = 'any',
  requiredPermission,
  fallback,
  redirectTo = '/'
}: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const permissions = useRoleAccess();
  
  // Show loading while auth is being determined
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-blue-400 mb-4"></i>
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Check if user is authenticated
  if (!user) {
    if (fallback) return <>{fallback}</>;
    
    if (typeof window !== 'undefined') {
      window.location.href = `${redirectTo}?redirect=${encodeURIComponent(window.location.pathname)}`;
    }
    return null;
  }
  
  // Check role-based access
  if (requiredRole !== 'any') {
    const hasRequiredRole = requiredRole === 'admin' ? permissions.isAdmin : permissions.isUser;
    if (!hasRequiredRole) {
      if (fallback) return <>{fallback}</>;
      
      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-8 max-w-md w-full text-center">
            <i className="fas fa-exclamation-triangle text-red-400 text-3xl mb-4"></i>
            <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
            <p className="text-gray-300 mb-4">
              You don&apos;t have permission to access this page.
            </p>
            <button
              onClick={() => window.history.back()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      );
    }
  }
  
  // Check specific permission
  if (requiredPermission && !permissions[requiredPermission]) {
    if (fallback) return <>{fallback}</>;
    
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-8 max-w-md w-full text-center">
          <i className="fas fa-lock text-red-400 text-3xl mb-4"></i>
          <h2 className="text-xl font-bold text-white mb-2">Insufficient Permissions</h2>
          <p className="text-gray-300 mb-4">
            You don&apos;t have the required permissions to perform this action.
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

/**
 * Hook to check specific permissions
 */
export const usePermission = (permission: keyof RolePermissions): boolean => {
  const permissions = useRoleAccess();
  return permissions[permission];
};

/**
 * Component to conditionally render based on permissions
 */
export interface ConditionalRenderProps {
  children: React.ReactNode;
  permission?: keyof RolePermissions;
  role?: 'admin' | 'user';
  fallback?: React.ReactNode;
}

export const ConditionalRender: React.FC<ConditionalRenderProps> = ({
  children,
  permission,
  role,
  fallback = null
}) => {
  const permissions = useRoleAccess();
  
  // Check role-based access
  if (role) {
    const hasRole = role === 'admin' ? permissions.isAdmin : permissions.isUser;
    if (!hasRole) return <>{fallback}</>;
  }
  
  // Check specific permission
  if (permission && !permissions[permission]) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};
