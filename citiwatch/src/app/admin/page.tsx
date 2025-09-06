'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LoadingCard } from '@/components/Loading';
import { makeAuthenticatedRequest, getCurrentUser, isUserAdmin } from '@/utils/api';
import Navigation from '@/components/Navigation';

interface Complaint {
  id: string;
  title: string;
  description: string;
  status: string;
  category: string;
  userName: string;
  createdAt: string;
  imageUrl?: string;
}

interface User {
  id: string;
  fullName: string;
  email: string;
  role: number;
  createdAt: string;
}

interface Category {
  id: string;
  name: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'complaints' | 'users' | 'categories'>('complaints');
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated and is admin (Role-based access control)
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Check if user has admin role
    const user = getCurrentUser();
    if (!user || !isUserAdmin()) {
      router.push('/dashboard'); // Redirect non-admin users
      return;
    }
  }, [router]);

  const loadComplaints = async () => {
    const data = await makeAuthenticatedRequest<Complaint[]>('/api/Complaint/GetAll');
    if (data && data.data) {
      setComplaints(data.data);
    }
  };

  const loadUsers = async () => {
    const data = await makeAuthenticatedRequest<User[]>('/api/User/GetAll');
    if (data && data.data) {
      setUsers(data.data);
    }
  };

  const loadCategories = async () => {
    const data = await makeAuthenticatedRequest<Category[]>('/api/Category/GetAll');
    if (data && data.data) {
      setCategories(data.data);
    }
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    
    try {
      if (activeTab === 'complaints') {
        await loadComplaints();
      } else if (activeTab === 'users') {
        await loadUsers();
      } else if (activeTab === 'categories') {
        await loadCategories();
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setError(error instanceof Error ? error.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    // Check if user is authenticated and is admin (Role-based access control)
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Check if user has admin role
    const user = getCurrentUser();
    if (!user || !isUserAdmin()) {
      router.push('/dashboard'); // Redirect non-admin users
      return;
    }

    loadData();
  }, [activeTab, router, loadData]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-900/50 text-yellow-300 border border-yellow-700';
      case 'in progress':
        return 'bg-blue-900/50 text-blue-300 border border-blue-700';
      case 'resolved':
        return 'bg-green-900/50 text-green-300 border border-green-700';
      case 'rejected':
        return 'bg-red-900/50 text-red-300 border border-red-700';
      default:
        return 'bg-gray-700/50 text-gray-300 border border-gray-600';
    }
  };

  const getRoleText = (role: number) => {
    return role === 1 ? 'Admin' : 'User';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Navigation */}
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-gray-400 mt-2">Manage complaints, users, and categories</p>
          <div className="mt-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors text-sm"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg">
                <i className="fas fa-clipboard-list text-4xl text-white-400"></i>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-semibold text-white">{complaints.length}</p>
                <p className="text-gray-400">Total Complaints</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg">
                <i className="fa-solid fa-users text-4xl text-white-400"></i>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-semibold text-white">{users.length}</p>
                <p className="text-gray-400">Total Users</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg">
                <i className="fa-solid fa-layer-group text-4xl text-white-400"></i>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-semibold text-white">{categories.length}</p>
                <p className="text-gray-400">Categories</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg">
                <i className="fas fa-clock text-4xl text-white-400"></i>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-semibold text-white">
                  {complaints.filter(c => c.status.toLowerCase() === 'pending').length}
                </p>
                <p className="text-gray-400">Pending</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg">
          <div className="border-b border-gray-700">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('complaints')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'complaints'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                }`}
              >
                Complaints
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'users'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                }`}
              >
                Users
              </button>
              <button
                onClick={() => setActiveTab('categories')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'categories'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                }`}
              >
                Categories
              </button>
            </nav>
          </div>

          <div className="p-6">
            {loading ? (
              <LoadingCard message="Loading admin data..." />
            ) : error ? (
              <div className="text-center py-8">
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                  <i className="fas fa-exclamation-triangle text-red-400 text-2xl mb-2"></i>
                  <p className="text-red-300 mb-4">{error}</p>
                  <button
                    onClick={loadData}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Complaints Tab */}
                {activeTab === 'complaints' && (
                  <div>
                    <h3 className="text-lg font-medium text-white mb-4">All Complaints</h3>
                    {complaints.length === 0 ? (
                      <p className="text-gray-400">No complaints found.</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-700">
                          <thead className="bg-gray-700/50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                Title
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                User
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                Category
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                Status
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                Date
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-gray-800/30 divide-y divide-gray-700">
                            {complaints.map((complaint) => (
                              <tr key={complaint.id} className="hover:bg-gray-700/30 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-white">
                                    {complaint.title}
                                  </div>
                                  <div className="text-sm text-gray-400 max-w-xs truncate">
                                    {complaint.description}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                  {complaint.userName}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                  {complaint.category}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                                    {complaint.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                  {new Date(complaint.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <button className="text-blue-400 hover:text-blue-300 mr-3 transition-colors">
                                    View
                                  </button>
                                  <button className="text-green-400 hover:text-green-300 transition-colors">
                                    Update Status
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* Users Tab */}
                {activeTab === 'users' && (
                  <div>
                    <h3 className="text-lg font-medium text-white mb-4">All Users</h3>
                    {users.length === 0 ? (
                      <p className="text-gray-400">No users found.</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-700">
                          <thead className="bg-gray-700/50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                Name
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                Email
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                Role
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                Joined
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-gray-800/30 divide-y divide-gray-700">
                            {users.map((user) => (
                              <tr key={user.id} className="hover:bg-gray-700/30 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                                  {user.fullName}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                  {user.email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                    user.role === 1 ? 'bg-purple-900/50 text-purple-300 border-purple-700' : 'bg-gray-700/50 text-gray-300 border-gray-600'
                                  }`}>
                                    {getRoleText(user.role)}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                  {new Date(user.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <button className="text-blue-400 hover:text-blue-300 mr-3 transition-colors">
                                    Edit
                                  </button>
                                  <button className="text-red-400 hover:text-red-300 transition-colors">
                                    Delete
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* Categories Tab */}
                {activeTab === 'categories' && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-white">Categories</h3>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                        Add Category
                      </button>
                    </div>
                    {categories.length === 0 ? (
                      <p className="text-gray-400">No categories found.</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {categories.map((category) => (
                          <div key={category.id} className="bg-gray-700/50 border border-gray-600 rounded-lg p-4">
                            <div className="flex justify-between items-center">
                              <h4 className="text-lg font-medium text-white">{category.name}</h4>
                              <div className="flex space-x-2">
                                <button className="text-blue-400 hover:text-blue-300 text-sm transition-colors">
                                  Edit
                                </button>
                                <button className="text-red-400 hover:text-red-300 text-sm transition-colors">
                                  Delete
                                </button>
                              </div>
                            </div>
                            <p className="text-sm text-gray-400 mt-1">
                              Created: {new Date(category.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
