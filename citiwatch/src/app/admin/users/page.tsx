'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { LoadingCard } from '@/components/Loading';
import AdminLayout from '@/components/AdminLayout';
import { UserService, User } from '@/services/user';
import { ComplaintService, Complaint } from '@/services/complaint';

// Define interface to match our needs with role as number for compatibility
interface UserDisplay extends Omit<User, 'role'> {
  role: number;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<'all' | 'user' | 'admin'>('all');
  const [selectedUser, setSelectedUser] = useState<UserDisplay | null>(null);
  const [userComplaints, setUserComplaints] = useState<Complaint[]>([]);
  const [complaintsLoading, setComplaintsLoading] = useState(false);
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    
    try {
      const result = await UserService.getAllUsers();
      
      if (result.success && result.data) {
        // Transform the data to match our display interface
        const transformedUsers: UserDisplay[] = result.data.map(user => {
          // Debug logging to see what we're getting
          console.log('User data for', user.email, ':', {
            role: user.role,
            roleType: typeof user.role,
            createdOn: user.createdOn,
            lastModifiedOn: user.lastModifiedOn
          });
          
          // Handle both string and number role values from backend
          let roleNumber: number;
          if (typeof user.role === 'string') {
            // Handle string values: "Admin", "admin", "User", "user"
            const roleStr = user.role.toLowerCase().trim();
            roleNumber = (roleStr === 'admin' || roleStr === '1') ? 1 : 0;
          } else if (typeof user.role === 'number') {
            // Handle numeric enum values: 0 = User, 1 = Admin
            roleNumber = user.role;
          } else {
            // Fallback: try to convert to number or default to User
            const roleValue = Number(user.role);
            roleNumber = isNaN(roleValue) ? 0 : roleValue;
          }

          // Ensure we only have 0 or 1
          roleNumber = roleNumber === 1 ? 1 : 0;
          
          console.log(`Transformed role for ${user.email}: ${roleNumber} (${roleNumber === 1 ? 'Admin' : 'User'})`);
          
          return {
            ...user,
            role: roleNumber
          };
        });
        setUsers(transformedUsers);
      } else {
        setError(result.message || 'Failed to load users');
      }
    } catch (error) {
      console.error('Error loading users:', error);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = async (user: UserDisplay) => {
    setLoadingUserId(user.id);
    setSelectedUser(user);
    setComplaintsLoading(true);
    setUserComplaints([]);

    try {
      // Only load complaints for regular users, not admins
      if (user.role === 0) {
        const result = await ComplaintService.getAllComplaints();
        if (result.success && result.data) {
          // Filter complaints by user email
          const userSpecificComplaints = result.data.filter(
            complaint => complaint.userEmail === user.email
          );
          setUserComplaints(userSpecificComplaints);
        }
      }
    } catch (error) {
      console.error('Error loading user complaints:', error);
    } finally {
      setComplaintsLoading(false);
      setLoadingUserId(null);
    }
  };

  const closeUserDetails = () => {
    setSelectedUser(null);
    setUserComplaints([]);
    setLoadingUserId(null);
  };

  const getRoleText = (role: number) => {
    return role === 1 ? 'Admin' : 'User';
  };

  const getRoleBadgeClass = (role: number) => {
    return role === 1 
      ? 'bg-purple-900/50 text-purple-300 border-purple-700' 
      : 'bg-gray-700/50 text-gray-300 border-gray-600';
  };

  const formatDate = (dateString: string) => {
    try {
      if (!dateString || dateString === '0001-01-01T00:00:00' || dateString === '1/1/0001 12:00:00 AM') {
        return 'Not available';
      }
      
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime()) || date.getFullYear() < 1900) {
        return 'Not available';
      }
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = selectedRole === 'all' || 
                       (selectedRole === 'admin' && user.role === 1) ||
                       (selectedRole === 'user' && user.role === 0);
    
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-8">
          <LoadingCard message="Loading users..." />
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="p-8">
          <div className="text-center py-8">
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
              <i className="fas fa-exclamation-triangle text-red-400 text-2xl mb-2"></i>
              <p className="text-red-300 mb-4">{error}</p>
              <button
                onClick={loadUsers}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">User Management</h1>
              <p className="text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">Manage all users in your system</p>
            </div>
            <div className="flex space-x-3">
              <Link
                href="/admin/users/manage"
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-colors flex items-center text-sm sm:text-base"
              >
                <i className="fas fa-plus mr-1 sm:mr-2"></i>
                <span className="hidden xs:inline">Add </span>User
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-500/20">
                <i className="fas fa-users text-2xl text-blue-400"></i>
              </div>
              <div className="ml-4">
                <p className="text-3xl font-bold text-white">{users.length}</p>
                <p className="text-gray-400">Total Users</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-500/20">
                <i className="fas fa-user-shield text-2xl text-purple-400"></i>
              </div>
              <div className="ml-4">
                <p className="text-3xl font-bold text-white">{users.filter(u => u.role === 1).length}</p>
                <p className="text-gray-400">Administrators</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-500/20">
                <i className="fas fa-user text-2xl text-green-400"></i>
              </div>
              <div className="ml-4">
                <p className="text-3xl font-bold text-white">{users.filter(u => u.role === 0).length}</p>
                <p className="text-gray-400">Regular Users</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-300 mb-2">
                Search Users
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-search text-gray-400"></i>
                </div>
                <input
                  type="text"
                  id="search"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md leading-5 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Search by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-2">
                Filter by Role
              </label>
              <select
                id="role"
                className="block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as 'all' | 'user' | 'admin')}
              >
                <option value="all">All Roles</option>
                <option value="admin">Administrators</option>
                <option value="user">Regular Users</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-900/20 border border-red-500/30 rounded-lg p-4">
            <div className="flex items-center">
              <i className="fas fa-exclamation-triangle text-red-400 mr-2"></i>
              <p className="text-red-300">{error}</p>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg">
          <div className="px-6 py-4 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-white">
              Users ({filteredUsers.length})
            </h3>
          </div>
          <div className="overflow-x-auto">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <i className="fas fa-users text-4xl text-gray-500 mb-4"></i>
                <p className="text-gray-400 text-lg">
                  {searchTerm || selectedRole !== 'all' ? 'No users match your filters.' : 'No users found.'}
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  {searchTerm ? 'Try adjusting your search terms.' : 'Click on a user card to view their details and complaints.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 sm:p-6">
                {filteredUsers.map((user) => (
                  <div 
                    key={user.id} 
                    className="bg-gray-700/50 border border-gray-600 rounded-lg p-6 hover:bg-gray-700/70 hover:border-gray-500 transition-all duration-200 cursor-pointer transform hover:scale-[1.02]"
                    onClick={() => handleUserClick(user)}
                    title="Click to view user details"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 h-12 w-12">
                        <div className="h-12 w-12 rounded-full bg-gray-600 flex items-center justify-center">
                          <span className="text-base font-medium text-white">
                            {user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-base font-medium text-white truncate flex items-center">
                          {user.fullName}
                          {loadingUserId === user.id && (
                            <i className="fas fa-spinner fa-spin ml-2 text-blue-400"></i>
                          )}
                        </div>
                        <div className="text-sm text-gray-400 truncate">
                          {user.email}
                        </div>
                        <div className="mt-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeClass(user.role)}`}>
                            {getRoleText(user.role)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-700">
              <h3 className="text-lg sm:text-xl font-semibold text-white">User Details</h3>
              <button
                onClick={closeUserDetails}
                className="text-gray-400 hover:text-gray-300 p-1"
              >
                <i className="fas fa-times text-lg sm:text-xl"></i>
              </button>
            </div>
            
            <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(95vh-120px)] sm:max-h-[calc(90vh-120px)]">
              {/* User Information */}
              <div className="mb-6 sm:mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
                  <div className="h-16 w-16 sm:h-16 sm:w-16 rounded-full bg-gray-600 flex items-center justify-center mx-auto sm:mx-0">
                    <span className="text-lg sm:text-xl font-medium text-white">
                      {selectedUser.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </span>
                  </div>
                  <div className="text-center sm:text-left">
                    <h4 className="text-xl sm:text-2xl font-bold text-white">{selectedUser.fullName}</h4>
                    <p className="text-gray-400 text-sm sm:text-base break-all">{selectedUser.email}</p>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border mt-2 ${getRoleBadgeClass(selectedUser.role)}`}>
                      {getRoleText(selectedUser.role)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="bg-gray-700/50 rounded-lg p-3 sm:p-4">
                    <h5 className="text-xs sm:text-sm font-medium text-gray-300 mb-2">User ID</h5>
                    <p className="text-white font-mono text-xs sm:text-sm break-all">{selectedUser.id}</p>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-3 sm:p-4">
                    <h5 className="text-xs sm:text-sm font-medium text-gray-300 mb-2">Account Created</h5>
                    <p className="text-white text-sm sm:text-base">{formatDate(selectedUser.createdOn)}</p>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-3 sm:p-4">
                    <h5 className="text-xs sm:text-sm font-medium text-gray-300 mb-2">Last Modified</h5>
                    <p className="text-white text-sm sm:text-base">{formatDate(selectedUser.lastModifiedOn)}</p>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-3 sm:p-4">
                    <h5 className="text-xs sm:text-sm font-medium text-gray-300 mb-2">Account Type</h5>
                    <p className="text-white text-sm sm:text-base">{selectedUser.role === 1 ? 'Administrator' : 'Regular User'}</p>
                  </div>
                </div>
              </div>

              {/* User Complaints (only for regular users) */}
              {selectedUser.role === 0 && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h5 className="text-lg font-semibold text-white">User Complaints</h5>
                    <div className="bg-blue-600 px-3 py-1 rounded-full">
                      <span className="text-white font-medium">
                        {complaintsLoading ? '...' : userComplaints.length} Total
                      </span>
                    </div>
                  </div>

                  {complaintsLoading ? (
                    <div className="text-center py-8">
                      <i className="fas fa-spinner fa-spin text-2xl text-gray-400 mb-4"></i>
                      <p className="text-gray-400">Loading complaints...</p>
                    </div>
                  ) : userComplaints.length === 0 ? (
                    <div className="text-center py-8">
                      <i className="fas fa-clipboard-list text-4xl text-gray-500 mb-4"></i>
                      <p className="text-gray-400 text-lg">No complaints submitted yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userComplaints.map((complaint) => (
                        <div key={complaint.id} className="bg-gray-700/50 border border-gray-600 rounded-lg p-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3">
                            <h6 className="text-base font-medium text-white mb-2 sm:mb-0">
                              {complaint.title}
                            </h6>
                            <div className="flex flex-wrap gap-2">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/50 text-blue-300 border border-blue-700">
                                {complaint.categoryName}
                              </span>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-900/50 text-yellow-300 border border-yellow-700">
                                {complaint.statusName}
                              </span>
                            </div>
                          </div>
                          <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                            {complaint.description}
                          </p>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-gray-500">
                            <span>ID: {complaint.id.substring(0, 8)}...</span>
                            <span>Submitted: {new Date(complaint.createdOn).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Admin Message */}
              {selectedUser.role === 1 && (
                <div className="text-center py-8">
                  <i className="fas fa-user-shield text-4xl text-purple-400 mb-4"></i>
                  <p className="text-gray-400 text-lg">This user is an administrator</p>
                  <p className="text-gray-500 text-sm mt-2">Administrators don't submit complaints</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
