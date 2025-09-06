'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { LoadingCard } from '@/components/Loading';
import AdminLayout from '@/components/AdminLayout';

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

// Mock data
const mockComplaints: Complaint[] = [
  {
    id: '1',
    title: 'Broken Street Light on Main Street',
    description: 'The street light near the intersection of Main Street and Oak Avenue has been broken for over a week.',
    status: 'pending',
    category: 'Infrastructure',
    userName: 'John Smith',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    title: 'Pothole on Highway 101',
    description: 'Large pothole causing damage to vehicles.',
    status: 'in progress',
    category: 'Infrastructure',
    userName: 'Sarah Johnson',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    title: 'Noise Complaint - Construction Site',
    description: 'Construction work starting at 5 AM, violating city noise ordinances.',
    status: 'resolved',
    category: 'Public Safety',
    userName: 'Mike Davis',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    title: 'Illegal Dumping in Park',
    description: 'Someone has been dumping trash and old furniture in Central Park.',
    status: 'pending',
    category: 'Environment',
    userName: 'Lisa Chen',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    title: 'Bus Stop Vandalism',
    description: 'Bus stop shelter has been vandalized with graffiti and broken glass.',
    status: 'resolved',
    category: 'Transportation',
    userName: 'Robert Wilson',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

export default function AdminDashboard() {
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

  const loadData = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Use mock data instead of API calls
      setComplaints(mockComplaints);
      
      // Calculate stats from mock data
      const totalComplaints = mockComplaints.length;
      const pendingComplaints = mockComplaints.filter(c => c.status?.toLowerCase() === 'pending').length;
      const inProgressComplaints = mockComplaints.filter(c => c.status?.toLowerCase() === 'in progress').length;
      const resolvedComplaints = mockComplaints.filter(c => c.status?.toLowerCase() === 'resolved').length;
      
      setStats({
        totalUsers: 245, // Mock users count
        totalComplaints,
        pendingComplaints,
        inProgressComplaints,
        resolvedComplaints,
        totalCategories: 6, // Mock categories count
        complaintsThisMonth: 18, // Mock complaints this month
        newUsersThisMonth: 32 // Mock new users this month
      });
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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

  const getComplaintsByCategory = () => {
    const categoryCount: { [key: string]: number } = {};
    complaints.forEach(complaint => {
      categoryCount[complaint.category] = (categoryCount[complaint.category] || 0) + 1;
    });
    return Object.entries(categoryCount).map(([name, count]) => ({ name, count }));
  };

  const getRecentComplaints = () => {
    return complaints
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  };

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
