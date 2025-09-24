'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LoadingCard } from '@/components/Loading';
import AdminLayout from '@/components/AdminLayout';
import { useAuth } from '@/auth/AuthContext';
import { ComplaintService, type Complaint } from '@/services/complaint';
import { UserService, type User } from '@/services/user';
import { CategoryService, type Category } from '@/services/category';

interface DashboardStats {
  totalUsers: number;
  totalComplaints: number;
  pendingComplaints: number;
  inProgressComplaints: number;
  resolvedComplaints: number;
  totalCategories: number;
  complaintsThisMonth: number;
  newUsersThisMonth: number;
}

export default function AdminDashboard() {
  const { user, isAuthenticated, isAdmin, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalComplaints: 0,
    pendingComplaints: 0,
    inProgressComplaints: 0,
    resolvedComplaints: 0,
    totalCategories: 0,
    complaintsThisMonth: 0,
    newUsersThisMonth: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Admin role verification
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }
      
      if (!isAdmin) {
        router.push('/dashboard');
        return;
      }
    }
  }, [isAuthenticated, isAdmin, authLoading, router]);

  const loadData = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Load real data from APIs
      const [complaintsResponse, usersResponse, categoriesResponse] = await Promise.all([
        ComplaintService.getAllComplaints(),
        UserService.getAllUsers(),
        CategoryService.getAllCategories()
      ]);

      if (!complaintsResponse.success) {
        throw new Error(complaintsResponse.message);
      }
      
      const complaintsData = complaintsResponse.data || [];
      setComplaints(complaintsData);
      
      // Calculate stats from real data
      const totalComplaints = complaintsData.length;
      const pendingComplaints = complaintsData.filter(c => c.statusName?.toLowerCase().includes('submitted') || c.statusName?.toLowerCase().includes('pending')).length;
      const inProgressComplaints = complaintsData.filter(c => c.statusName?.toLowerCase().includes('progress')).length;
      const resolvedComplaints = complaintsData.filter(c => c.statusName?.toLowerCase().includes('resolved')).length;
      
      // Calculate complaints this month
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const complaintsThisMonth = complaintsData.filter(c => {
        const complaintDate = new Date(c.createdOn);
        return complaintDate.getMonth() === currentMonth && complaintDate.getFullYear() === currentYear;
      }).length;

      // Calculate new users this month (if users data is available)
      let newUsersThisMonth = 0;
      let totalUsers = 0;
      if (usersResponse.success && usersResponse.data) {
        totalUsers = usersResponse.data.length;
        newUsersThisMonth = usersResponse.data.filter(u => {
          const userDate = new Date(u.createdOn);
          return userDate.getMonth() === currentMonth && userDate.getFullYear() === currentYear;
        }).length;
      }

      setStats({
        totalUsers,
        totalComplaints,
        pendingComplaints,
        inProgressComplaints, 
        resolvedComplaints,
        totalCategories: categoriesResponse.success ? (categoriesResponse.data?.length || 0) : 0,
        complaintsThisMonth,
        newUsersThisMonth
      });
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError(error instanceof Error ? error.message : 'Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'submitted':
        return 'bg-yellow-900/50 text-yellow-300 border border-yellow-700';
      case 'in progress':
        return 'bg-blue-900/50 text-blue-300 border border-blue-700';
      case 'resolved':
        return 'bg-green-900/50 text-green-300 border border-green-700';
      case 'pending':
        return 'bg-yellow-900/50 text-yellow-300 border border-yellow-700';
      case 'rejected':
        return 'bg-red-900/50 text-red-300 border border-red-700';
      default:
        return 'bg-gray-700/50 text-gray-300 border border-gray-600';
    }
  };

  const getComplaintsByCategory = () => {
    const categoryCount: { [key: string]: number } = {};
    complaints.forEach(complaint => {
      const category = complaint.categoryName || 'Unknown';
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });
    return Object.entries(categoryCount).map(([name, count]) => ({ name, count }));
  };

  const getRecentComplaints = () => {
    return complaints
      .sort((a, b) => new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime())
      .slice(0, 5);
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <AdminLayout>
        <div className="p-8">
          <LoadingCard message="Checking authentication..." />
        </div>
      </AdminLayout>
    );
  }

  // Don't render anything if not authenticated or not admin (will redirect)
  if (!isAuthenticated || !isAdmin) {
    return (
      <AdminLayout>
        <div className="p-8">
          <LoadingCard message="Redirecting..." />
        </div>
      </AdminLayout>
    );
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-8">
          <LoadingCard message="Loading dashboard data..." />
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
                onClick={loadData}
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
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
          <p className="text-gray-400 mt-2">Monitor your CitiWatch platform performance and statistics</p>
          
          {/* Welcome message for admin */}
          <div className="mt-4 p-4 bg-green-900/20 border border-green-600 rounded-lg">
            <p className="text-green-200 text-sm">
              <strong>Welcome, {user?.email}!</strong> You have administrative access to the CitiWatch platform.
            </p>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-500/20">
                <i className="fas fa-users text-2xl text-blue-400"></i>
              </div>
              <div className="ml-4">
                <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
                <p className="text-gray-400">Total Users</p>
                <p className="text-sm text-green-400 mt-1">+{stats.newUsersThisMonth} this month</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-500/20">
                <i className="fas fa-exclamation-circle text-2xl text-purple-400"></i>
              </div>
              <div className="ml-4">
                <p className="text-3xl font-bold text-white">{stats.totalComplaints}</p>
                <p className="text-gray-400">Total Complaints</p>
                <p className="text-sm text-green-400 mt-1">+{stats.complaintsThisMonth} this month</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-500/20">
                <i className="fas fa-clock text-2xl text-yellow-400"></i>
              </div>
              <div className="ml-4">
                <p className="text-3xl font-bold text-white">{stats.pendingComplaints}</p>
                <p className="text-gray-400">Pending</p>
                <p className="text-sm text-yellow-400 mt-1">Requires action</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-500/20">
                <i className="fas fa-check-circle text-2xl text-green-400"></i>
              </div>
              <div className="ml-4">
                <p className="text-3xl font-bold text-white">{stats.resolvedComplaints}</p>
                <p className="text-gray-400">Resolved</p>
                <p className="text-sm text-green-400 mt-1">
                  {stats.totalComplaints > 0 ? Math.round((stats.resolvedComplaints / stats.totalComplaints) * 100) : 0}% resolved
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Status Overview Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Complaints by Status */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Complaints by Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full mr-3"></div>
                  <span className="text-gray-300">Pending</span>
                </div>
                <div className="flex items-center">
                  <span className="text-white font-semibold mr-2">{stats.pendingComplaints}</span>
                  <div className="w-24 bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full" 
                      style={{ width: `${stats.totalComplaints > 0 ? (stats.pendingComplaints / stats.totalComplaints) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-gray-300">In Progress</span>
                </div>
                <div className="flex items-center">
                  <span className="text-white font-semibold mr-2">{stats.inProgressComplaints}</span>
                  <div className="w-24 bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${stats.totalComplaints > 0 ? (stats.inProgressComplaints / stats.totalComplaints) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-gray-300">Resolved</span>
                </div>
                <div className="flex items-center">
                  <span className="text-white font-semibold mr-2">{stats.resolvedComplaints}</span>
                  <div className="w-24 bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${stats.totalComplaints > 0 ? (stats.resolvedComplaints / stats.totalComplaints) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Complaints by Category */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Complaints by Category</h3>
            <div className="space-y-3">
              {getComplaintsByCategory().slice(0, 5).map((category, index) => (
                <div key={category.name} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className={`w-4 h-4 rounded-full mr-3`}
                      style={{ backgroundColor: `hsl(${index * 60}, 70%, 50%)` }}
                    ></div>
                    <span className="text-gray-300">{category.name}</span>
                  </div>
                  <span className="text-white font-semibold">{category.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/admin/complaints"
              className="flex items-center justify-center p-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
            >
              <i className="fas fa-list mr-2"></i>
              View All Complaints
            </Link>
            <Link
              href="/admin/users"
              className="flex items-center justify-center p-4 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors"
            >
              <i className="fas fa-users mr-2"></i>
              Manage Users
            </Link>
            <Link
              href="/admin/categories/manage"
              className="flex items-center justify-center p-4 bg-green-600 hover:bg-green-700 rounded-lg text-white transition-colors"
            >
              <i className="fas fa-plus mr-2"></i>
              Add Category
            </Link>
            <Link
              href="/admin/complaints/pending"
              className="flex items-center justify-center p-4 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-white transition-colors"
            >
              <i className="fas fa-clock mr-2"></i>
              Pending Reviews
            </Link>
          </div>
        </div>

        {/* Latest Complaints Table */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg">
          <div className="px-6 py-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Latest Complaints</h3>
              <Link
                href="/admin/complaints"
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                View All
              </Link>
            </div>
          </div>
          <div className="p-6">
            {getRecentComplaints().length === 0 ? (
              <p className="text-gray-400 text-center py-8">No complaints found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead>
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
                  <tbody className="divide-y divide-gray-700">
                    {getRecentComplaints().map((complaint) => (
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
                          Unknown User
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {complaint.categoryName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(complaint.statusName || '')}`}>
                            {complaint.statusName}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {new Date(complaint.createdOn).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link
                            href={`/admin/complaints/${complaint.id}`}
                            className="text-blue-400 hover:text-blue-300 mr-3 transition-colors"
                          >
                            View
                          </Link>
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
        </div>
      </div>
    </AdminLayout>
  );
}
