'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { LoadingCard, LoadingSection } from '@/components/Loading';
import { makeAuthenticatedRequest, getCurrentUser } from '@/utils/api';

interface Complaint {
  id: string;
  title: string;
  description: string;
  status: string;
  category: string;
  createdAt: string;
  imageUrl?: string;
}

export default function Dashboard() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState<{ fullName: string; email: string; role?: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Get current user data
    const currentUser = getCurrentUser();
    setUser(currentUser);

    // Load user complaints
    loadUserComplaints();
  }, [router]);

  const loadUserComplaints = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Use authenticated request with proper error handling
      const data = await makeAuthenticatedRequest('/api/Complaint/GetAllUserComplaints');
      
      if (data && data.data) {
        setComplaints(data.data);
      } else {
        // Set empty array if no data
        setComplaints([]);
      }
    } catch (error) {
      console.error('Error loading complaints:', error);
      setError(error instanceof Error ? error.message : 'Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Navigation */}
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">
            Welcome back, {user?.fullName || 'User'}
          </h1>
          <p className="text-gray-400 mt-2">Track your submitted complaints and their status</p>
          {user?.role === 'admin' && (
            <div className="mt-4">
              <Link
                href="/admin"
                className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors text-sm"
              >
                <i className="fas fa-user-shield mr-2"></i>
                Admin Panel
              </Link>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg p-6 border border-gray-700">
            <div className="flex items-center">
              <div className="p-2 rounded-lg">
                <i className="fas fa-clipboard-list text-4xl text--400"></i>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-semibold text-white">{complaints.length}</p>
                <p className="text-gray-400">Total Complaints</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg p-6 border border-gray-700">
            <div className="flex items-center">
              <div className="p-2 rounded-lg">
                <i className="fas fa-clock text-4xl text-yellow-400"></i>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-semibold text-white">
                  {complaints.filter(c => c.status.toLowerCase() === 'pending').length}
                </p>
                <p className="text-gray-400">Pending</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg p-6 border border-gray-700">
            <div className="flex items-center">
              <div className="p-2 rounded-lg">
                <i className="fas fa-sync-alt text-4xl text-blue-400"></i>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-semibold text-white">
                  {complaints.filter(c => c.status.toLowerCase() === 'in progress').length}
                </p>
                <p className="text-gray-400">In Progress</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg p-6 border border-gray-700">
            <div className="flex items-center">
              <div className="p-2 rounded-lg">
                <i className="fas fa-check-circle text-4xl text-green-400"></i>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-semibold text-white">
                  {complaints.filter(c => c.status.toLowerCase() === 'resolved').length}
                </p>
                <p className="text-gray-400">Resolved</p>
              </div>
            </div>
          </div>
        </div>

        {/* Complaints List */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-700">
          <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-medium text-white">My Complaints</h2>
            <Link
              href="/dashboard/submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              New Complaint
            </Link>
          </div>

          {loading ? (
            <LoadingCard message="Loading your complaints..." />
          ) : error ? (
            <div className="p-6">
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 text-center">
                <i className="fas fa-exclamation-triangle text-red-400 text-2xl mb-2"></i>
                <p className="text-red-300 mb-4">{error}</p>
                <button
                  onClick={loadUserComplaints}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : complaints.length === 0 ? (
            <div className="p-6 text-center">
              <i className="fas fa-clipboard-list text-4xl mb-4 block text-gray-500"></i>
              <p className="text-gray-400 mb-4">No complaints submitted yet</p>
              <Link
                href="/dashboard/submit"
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              >
                Submit Your First Complaint
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-700">
              {complaints.map((complaint) => (
                <div key={complaint.id} className="p-6 hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-white mb-1">
                        {complaint.title}
                      </h3>
                      <p className="text-gray-300 mb-2 line-clamp-2">
                        {complaint.description}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span>Category: {complaint.category}</span>
                        <span>•</span>
                        <span>Submitted: {new Date(complaint.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                        {complaint.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
