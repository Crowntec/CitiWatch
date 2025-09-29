'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';
import { LoadingCard } from '@/components/Loading';
import { UserService, type User } from '@/services/user';

export default function UserDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadUser = async () => {
      const userId = params.id as string;
      
      try {
        const response = await UserService.getAllUsers();
        if (response.success && response.data) {
          const foundUser = response.data.find(u => u.id === userId);
          setUser(foundUser || null);
        } else {
          setError(response.message || 'Failed to load user');
        }
      } catch (error) {
        console.error('Error loading user:', error);
        setError('An error occurred while loading user details');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [params.id]);

  const getRoleText = (role: number) => {
    switch (role) {
      case 1:
        return 'Admin';
      default:
        return 'User';
    }
  };

  const getRoleBadgeClass = (role: number) => {
    switch (role) {
      case 1:
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <LoadingCard />
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-8 text-center">
          <div className="text-6xl text-red-400 mb-4">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Error Loading User</h2>
          <p className="text-red-300 mb-6">{error}</p>
          <Link
            href="/admin/users"
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors inline-flex items-center"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Back to Users
          </Link>
        </div>
      </AdminLayout>
    );
  }

  if (!user) {
    return (
      <AdminLayout>
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <div className="text-6xl text-gray-600 mb-4">
            <i className="fas fa-user-slash"></i>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">User Not Found</h2>
          <p className="text-gray-400 mb-6">
            The user you are looking for does not exist or has been deleted.
          </p>
          <Link
            href="/admin/users"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors inline-flex items-center"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Back to Users
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <Link
              href="/admin/users"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <i className="fas fa-arrow-left text-xl"></i>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">User Details</h1>
              <p className="text-gray-400">View and manage user information</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Link
              href={`/admin/users/${user.id}/edit`}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors inline-flex items-center"
            >
              <i className="fas fa-edit mr-2"></i>
              Edit User
            </Link>
            <button
              onClick={() => {
                if (confirm('Are you sure you want to delete this user?')) {
                  // TODO: Implement delete functionality
                  console.log('Delete user:', user.id);
                  router.push('/admin/users');
                }
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors inline-flex items-center"
            >
              <i className="fas fa-trash mr-2"></i>
              Delete
            </button>
          </div>
        </div>

        {/* User Information Card */}
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <i className="fas fa-user-circle mr-3 text-blue-400"></i>
              User Information
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                  <p className="text-white text-lg">{user.fullName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                  <p className="text-white">{user.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Role</label>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getRoleBadgeClass(typeof user.role === 'number' ? user.role : parseInt(user.role as string))}`}>
                    {getRoleText(typeof user.role === 'number' ? user.role : parseInt(user.role as string))}
                  </span>
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Account Created</label>
                  <p className="text-white">{new Date(user.createdOn).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Last Modified</label>
                  <p className="text-white">{new Date(user.lastModifiedOn).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">User ID</label>
                  <p className="text-white font-mono">{user.id}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Summary */}
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <i className="fas fa-chart-bar mr-3 text-green-400"></i>
              Activity Summary
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">0</div>
                <p className="text-gray-400">Total Complaints</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">0</div>
                <p className="text-gray-400">Resolved Issues</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">0</div>
                <p className="text-gray-400">Pending Issues</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
