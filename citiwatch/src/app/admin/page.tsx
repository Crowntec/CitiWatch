'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LoadingCard } from '@/components/Loading';
import AdminLayout from '@/components/AdminLayout';
import { useAuth } from '@/auth/AuthContext';
import { ComplaintService, type Complaint } from '@/services/complaint';
import { UserService } from '@/services/user';
import { CategoryService } from '@/services/category';

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

  const getDirectionsToComplaint = (complaint: Complaint) => {
    if (!complaint.latitude || !complaint.longitude) {
      alert('Location information is not available for this complaint.');
      return;
    }

    const destination = `${complaint.latitude},${complaint.longitude}`;
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude: currentLat, longitude: currentLng } = position.coords;
          const origin = `${currentLat},${currentLng}`;
          
          // Open Google Maps with directions
          const mapsUrl = `https://www.google.com/maps/dir/${origin}/${destination}`;
          window.open(mapsUrl, '_blank');
        },
        (error) => {
          console.error('Error getting current location:', error);
          // Fallback: Open Google Maps with just the destination
          const mapsUrl = `https://www.google.com/maps/search/${destination}`;
          window.open(mapsUrl, '_blank');
          
          // Show user-friendly error message
          alert('Could not get your current location. Opening destination location instead.');
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    } else {
      // Geolocation not supported
      const mapsUrl = `https://www.google.com/maps/search/${destination}`;
      window.open(mapsUrl, '_blank');
      alert('Geolocation is not supported by your browser. Opening destination location.');
    }
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
              <strong>Welcome, {user?.fullName}!</strong>
            </p>
          </div>
          
          {/* Information about user data limitation */}
          <div className="mt-4 p-4 bg-amber-900/20 border border-amber-600 rounded-lg">
            <div className="flex items-start space-x-2">
              <i className="fas fa-info-circle text-amber-400 mt-0.5"></i>
              <div>
                <p className="text-amber-200 text-sm font-medium">Information Notice</p>
                <p className="text-amber-100 text-xs mt-1">
                  User information is not currently available for complaints due to backend API limitations. 
                  Complaints show &ldquo;User Info N/A&rdquo; until the backend is updated to include user details.
                </p>
              </div>
            </div>
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
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg p-4 sm:p-6 mb-8">
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Link
              href="/admin/complaints"
              className="group flex flex-col sm:flex-row items-center justify-center p-4 sm:p-6 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-all duration-200 hover:scale-105 hover:shadow-lg"
            >
              <i className="fas fa-list text-2xl sm:text-lg sm:mr-2 mb-2 sm:mb-0 group-hover:animate-pulse"></i>
              <span className="text-sm sm:text-base font-medium text-center sm:text-left">View All Complaints</span>
            </Link>
            <Link
              href="/admin/users"
              className="group flex flex-col sm:flex-row items-center justify-center p-4 sm:p-6 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-all duration-200 hover:scale-105 hover:shadow-lg"
            >
              <i className="fas fa-users text-2xl sm:text-lg sm:mr-2 mb-2 sm:mb-0 group-hover:animate-pulse"></i>
              <span className="text-sm sm:text-base font-medium text-center sm:text-left">Manage Users</span>
            </Link>
            <Link
              href="/admin/categories/manage"
              className="group flex flex-col sm:flex-row items-center justify-center p-4 sm:p-6 bg-green-600 hover:bg-green-700 rounded-lg text-white transition-all duration-200 hover:scale-105 hover:shadow-lg"
            >
              <i className="fas fa-plus text-2xl sm:text-lg sm:mr-2 mb-2 sm:mb-0 group-hover:animate-pulse"></i>
              <span className="text-sm sm:text-base font-medium text-center sm:text-left">Add Category</span>
            </Link>
            <Link
              href="/admin/complaints/pending"
              className="group flex flex-col sm:flex-row items-center justify-center p-4 sm:p-6 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-white transition-all duration-200 hover:scale-105 hover:shadow-lg"
            >
              <i className="fas fa-clock text-2xl sm:text-lg sm:mr-2 mb-2 sm:mb-0 group-hover:animate-pulse"></i>
              <span className="text-sm sm:text-base font-medium text-center sm:text-left">Pending Reviews</span>
            </Link>
          </div>
        </div>

        {/* Latest Complaints - Responsive Cards */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg sm:text-xl font-semibold text-white">Latest Complaints</h3>
              <Link
                href="/admin/complaints"
                className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
              >
                View All
              </Link>
            </div>
          </div>
          <div className="p-4 sm:p-6">
            {getRecentComplaints().length === 0 ? (
              <div className="text-center py-12">
                <i className="fas fa-inbox text-4xl text-gray-500 mb-4"></i>
                <p className="text-gray-400">No complaints found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {getRecentComplaints().map((complaint) => (
                  <div key={complaint.id} className="bg-gray-700/30 hover:bg-gray-700/50 border border-gray-600/50 rounded-lg p-4 transition-all duration-200 hover:shadow-lg">
                    {/* Mobile/Tablet Layout */}
                    <div className="space-y-3">
                      {/* Header Row */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <h4 className="text-white font-medium text-sm sm:text-base truncate">
                              {complaint.title}
                            </h4>
                            {complaint.latitude && complaint.longitude && (
                              <i className="fas fa-map-marker-alt text-blue-400 text-xs" title="Has location data"></i>
                            )}
                          </div>
                          <p className="text-gray-400 text-xs sm:text-sm mt-1 line-clamp-2">
                            {complaint.description}
                          </p>
                        </div>
                        <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(complaint.statusName || '')}`}>
                          {complaint.statusName}
                        </span>
                      </div>

                      {/* Info Row */}
                      <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-400">
                        <div className="flex items-center space-x-1">
                          <i className="fas fa-user text-purple-400"></i>
                          <span className="truncate max-w-24 sm:max-w-32" title="User information not available from backend API">
                            {complaint.userName || complaint.userEmail || 'User Info N/A'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <i className="fas fa-tag text-green-400"></i>
                          <span className="truncate max-w-20 sm:max-w-28">{complaint.categoryName}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <i className="fas fa-calendar text-blue-400"></i>
                          <span>{new Date(complaint.createdOn).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric'
                          })}</span>
                        </div>
                      </div>

                      {/* Actions Row */}
                      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-600/30">
                        <Link
                          href={`/admin/complaints/${complaint.id}`}
                          className="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition-colors"
                        >
                          <i className="fas fa-eye mr-1.5"></i>
                          View
                        </Link>
                        {complaint.latitude && complaint.longitude && (
                          <button
                            onClick={() => getDirectionsToComplaint(complaint)}
                            className="inline-flex items-center px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium rounded-md transition-colors"
                            title="Get directions to complaint location"
                          >
                            <i className="fas fa-directions mr-1.5"></i>
                            Route
                          </button>
                        )}
                        <button className="inline-flex items-center px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-md transition-colors">
                          <i className="fas fa-edit mr-1.5"></i>
                          Update
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
