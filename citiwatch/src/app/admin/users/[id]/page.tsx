'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';
import { LoadingCard } from '@/components/Loading';

interface User {
  id: string;
  fullName: string;
  email: string;
  role: number;
  createdAt: string;
  phone?: string;
  address?: string;
  lastLogin?: string;
}

// Mock users data
const mockUsers: User[] = [
  {
    id: '1',
    fullName: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, City, State 12345',
    role: 0, // User
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    lastLogin: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    fullName: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 987-6543',
    address: '456 Oak Ave, City, State 12345',
    role: 0, // User
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    lastLogin: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    fullName: 'Mike Davis',
    email: 'mike.davis@email.com',
    phone: '+1 (555) 246-8135',
    address: '789 Pine St, City, State 12345',
    role: 0, // User
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    lastLogin: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '4',
    fullName: 'Lisa Chen',
    email: 'lisa.chen@email.com',
    phone: '+1 (555) 369-2580',
    address: '321 Elm St, City, State 12345',
    role: 1, // Admin
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    lastLogin: new Date(Date.now() - 30 * 60 * 1000).toISOString()
  },
  {
    id: '5',
    fullName: 'Robert Wilson',
    email: 'robert.wilson@email.com',
    phone: '+1 (555) 147-2589',
    address: '654 Maple Ave, City, State 12345',
    role: 0, // User
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    lastLogin: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export default function UserDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = params.id as string;
    // Simulate API call
    setTimeout(() => {
      const foundUser = mockUsers.find(u => u.id === userId);
      setUser(foundUser || null);
      setLoading(false);
    }, 500);
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
                  <label className="block text-sm font-medium text-gray-400 mb-2">Phone</label>
                  <p className="text-white">{user.phone || 'Not provided'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Role</label>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getRoleBadgeClass(user.role)}`}>
                    {getRoleText(user.role)}
                  </span>
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Address</label>
                  <p className="text-white">{user.address || 'Not provided'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Account Created</label>
                  <p className="text-white">{new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Last Login</label>
                  <p className="text-white">
                    {user.lastLogin 
                      ? new Date(user.lastLogin).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : 'Never'
                    }
                  </p>
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
