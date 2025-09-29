'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import Navigation from '@/components/Navigation';
import { LoadingCard } from '@/components/Loading';
import { useAuth } from '@/auth/AuthContext';
import { ProtectedRoute } from '@/auth/ProtectedRoute';
import { ComplaintService, type Complaint } from '@/services/complaint';

// Dynamically import MapDisplay to avoid SSR issues
const MapDisplay = dynamic(() => import('@/components/MapDisplay'), {
  ssr: false,
  loading: () => (
    <div className="h-48 w-full rounded-lg bg-gray-600/50 flex items-center justify-center">
      <p className="text-gray-400">Loading map...</p>
    </div>
  )
});

export default function Dashboard() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'status' | 'category'>('date');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    // Load user complaints
    if (isAuthenticated) {
      loadUserComplaints();
    }
  }, [isAuthenticated]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isModalOpen) {
        closeModal();
      }
      if (event.key === 'r' && event.ctrlKey) {
        event.preventDefault();
        loadUserComplaints();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  const loadUserComplaints = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await ComplaintService.getUserComplaints();
      
      if (response.success) {
        setComplaints(response.data || []);
      } else {
        setError(response.message);
      }
    } catch (error) {
      console.error('Error loading complaints:', error);
      setError(error instanceof Error ? error.message : 'Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

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

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'submitted':
      case 'pending':
        return 'fas fa-clock';
      case 'in progress':
        return 'fas fa-sync-alt';
      case 'resolved':
        return 'fas fa-check-circle';
      case 'rejected':
        return 'fas fa-times-circle';
      default:
        return 'fas fa-question-circle';
    }
  };

  const openModal = (complaint: Complaint) => {
    console.log('Opening modal for complaint:', complaint.id);
    setSelectedComplaint(complaint);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedComplaint(null);
    setIsModalOpen(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    
    // Check for invalid dates or dates that are too old (like year 1)
    if (isNaN(date.getTime()) || date.getFullYear() < 1900) {
      return 'Invalid date';
    }
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter and sort complaints
  const filteredAndSortedComplaints = complaints
    .filter(complaint => filterStatus === 'all' || complaint.statusName?.toLowerCase() === filterStatus.toLowerCase())
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime();
        case 'status':
          return (a.statusName || '').localeCompare(b.statusName || '');
        case 'category':
          return (a.categoryName || '').localeCompare(b.categoryName || '');
        default:
          return 0;
      }
    });

  const uniqueStatuses = Array.from(new Set(complaints.map(c => c.statusName))).filter(Boolean);

  return (
    <ProtectedRoute>
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
                  {complaints.filter(c => c.statusName?.toLowerCase().includes('submitted')).length}
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
                  {complaints.filter(c => c.statusName?.toLowerCase().includes('progress')).length}
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
                  {complaints.filter(c => c.statusName?.toLowerCase().includes('resolved')).length}
                </p>
                <p className="text-gray-400">Resolved</p>
              </div>
            </div>
          </div>
        </div>

        {/* Complaints List */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-700">
          <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-medium text-white">My Complaints</h2>
              <span className="text-sm text-gray-400">({complaints.length} total)</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={loadUserComplaints}
                disabled={loading}
                className="text-gray-400 hover:text-white transition-colors px-2 py-1 rounded"
                title="Refresh complaints (Ctrl+R)"
              >
                <i className={`fas fa-refresh ${loading ? 'animate-spin' : ''}`}></i>
              </button>
              <Link
                href="/dashboard/submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <i className="fas fa-plus mr-2"></i>
                New Complaint
              </Link>
            </div>
          </div>

          {/* Filter and Sort Controls */}
          {complaints.length > 0 && (
            <div className="px-6 py-3 border-b border-gray-700 bg-gray-700/30">
              <div className="flex flex-wrap items-center gap-4">
                {/* Status Filter */}
                <div className="flex items-center space-x-2">
                  <label htmlFor="statusFilter" className="text-sm text-gray-300">Filter by:</label>
                  <select
                    id="statusFilter"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="text-sm bg-gray-600 text-white border border-gray-500 rounded px-2 py-1"
                  >
                    <option value="all">All Status</option>
                    {uniqueStatuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                {/* Sort */}
                <div className="flex items-center space-x-2">
                  <label htmlFor="sortBy" className="text-sm text-gray-300">Sort by:</label>
                  <select
                    id="sortBy"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'date' | 'status' | 'category')}
                    className="text-sm bg-gray-600 text-white border border-gray-500 rounded px-2 py-1"
                  >
                    <option value="date">Date (Newest First)</option>
                    <option value="status">Status</option>
                    <option value="category">Category</option>
                  </select>
                </div>

                {/* Results count */}
                <div className="text-sm text-gray-400 ml-auto">
                  Showing {filteredAndSortedComplaints.length} of {complaints.length} complaints
                </div>
              </div>
            </div>
          )}

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
          ) : filteredAndSortedComplaints.length === 0 && complaints.length === 0 ? (
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
          ) : filteredAndSortedComplaints.length === 0 ? (
            <div className="p-6 text-center">
              <i className="fas fa-filter text-4xl mb-4 block text-gray-500"></i>
              <p className="text-gray-400 mb-4">No complaints match your current filters</p>
              <button
                onClick={() => {setFilterStatus('all'); setSortBy('date');}}
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-700">
              {filteredAndSortedComplaints.map((complaint) => (
                <div key={complaint.id} className="p-6 hover:bg-gray-700/30 transition-colors cursor-pointer" onClick={() => openModal(complaint)}>
                  <div className="flex items-start space-x-4">
                    {/* Complaint Image or Icon */}
                    <div className="flex-shrink-0">
                      {complaint.mediaUrl ? (
                        <Image
                          src={complaint.mediaUrl}
                          alt="Complaint evidence"
                          width={64}
                          height={64}
                          className="w-16 h-16 rounded-lg object-cover border border-gray-600"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center border border-gray-600">
                          <i className="fas fa-image text-gray-400 text-xl"></i>
                        </div>
                      )}
                    </div>

                    {/* Complaint Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-white mb-1 truncate">
                            {complaint.title}
                          </h3>
                          <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                            {complaint.description}
                          </p>
                          
                          {/* Metadata */}
                          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
                            <span className="flex items-center">
                              <i className="fas fa-tag mr-1"></i>
                              {complaint.categoryName}
                            </span>
                            <span className="flex items-center">
                              <i className="fas fa-calendar mr-1"></i>
                              {formatDate(complaint.createdOn)}
                            </span>
                            {complaint.latitude && complaint.longitude && (
                              <span className="flex items-center">
                                <i className="fas fa-map-marker-alt mr-1"></i>
                                Location provided
                              </span>
                            )}
                            {complaint.lastModifiedOn && 
                             complaint.lastModifiedOn !== complaint.createdOn && 
                             new Date(complaint.lastModifiedOn).getFullYear() > 1900 && (
                              <span className="flex items-center">
                                <i className="fas fa-edit mr-1"></i>
                                Updated {formatDate(complaint.lastModifiedOn)}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className="flex flex-col items-end ml-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.statusName || '')}`}>
                            <i className={`${getStatusIcon(complaint.statusName || '')} mr-1`}></i>
                            {complaint.statusName}
                          </span>
                          <span className="text-xs text-gray-500 mt-1">Click to view details</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Complaint Detail Modal */}
        {isModalOpen && selectedComplaint && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            {/* Background overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-75" onClick={closeModal}></div>

            {/* Modal content */}
            <div className="relative bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border-2 border-gray-600 z-10">
              {/* Header */}
              <div className="bg-gray-700/50 px-6 py-4 border-b border-gray-600">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-white">Complaint Details</h3>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <i className="fas fa-times text-xl"></i>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 py-4 max-h-96 overflow-y-auto">
                  {/* Status and ID */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedComplaint.statusName || '')}`}>
                      <i className={`${getStatusIcon(selectedComplaint.statusName || '')} mr-2`}></i>
                      {selectedComplaint.statusName}
                    </span>
                    <span className="text-xs text-gray-400">ID: {selectedComplaint.id.substring(0, 8)}...</span>
                  </div>

                  {/* Title */}
                  <h4 className="text-xl font-semibold text-white mb-3">{selectedComplaint.title}</h4>

                  {/* Image */}
                  {selectedComplaint.mediaUrl && (
                    <div className="mb-4">
                      <Image
                        src={selectedComplaint.mediaUrl}
                        alt="Complaint evidence"
                        width={0}
                        height={192}
                        sizes="100vw"
                        className="w-full h-48 object-cover rounded-lg border border-gray-600"
                      />
                    </div>
                  )}

                  {/* Description */}
                  <div className="mb-4">
                    <h5 className="text-sm font-medium text-gray-300 mb-2">Description</h5>
                    <p className="text-gray-200 whitespace-pre-wrap">{selectedComplaint.description}</p>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h5 className="font-medium text-gray-300 mb-1">Category</h5>
                      <p className="text-gray-200">{selectedComplaint.categoryName}</p>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-300 mb-1">Submitted</h5>
                      <p className="text-gray-200">{formatDate(selectedComplaint.createdOn)}</p>
                    </div>
                    {selectedComplaint.lastModifiedOn && 
                     selectedComplaint.lastModifiedOn !== selectedComplaint.createdOn && 
                     new Date(selectedComplaint.lastModifiedOn).getFullYear() > 1900 && (
                      <div className="md:col-span-2">
                        <h5 className="font-medium text-gray-300 mb-1">Last Updated</h5>
                        <p className="text-gray-200">{formatDate(selectedComplaint.lastModifiedOn)}</p>
                      </div>
                    )}
                    {selectedComplaint.latitude && selectedComplaint.longitude && (
                      <div className="md:col-span-2">
                        <h5 className="font-medium text-gray-300 mb-3">Location</h5>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-gray-200">
                              <i className="fas fa-map-marker-alt mr-2 text-blue-400"></i>
                              <span>Coordinates: {selectedComplaint.latitude}, {selectedComplaint.longitude}</span>
                            </div>
                            <a
                              href={`https://www.google.com/maps?q=${selectedComplaint.latitude},${selectedComplaint.longitude}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-400 hover:text-blue-300 border border-blue-600 hover:border-blue-500 rounded-md transition-colors"
                            >
                              <i className="fas fa-external-link-alt mr-1"></i>
                              Open in Maps
                            </a>
                          </div>
                          <div className="w-full">
                            <MapDisplay 
                              latitude={parseFloat(selectedComplaint.latitude)}
                              longitude={parseFloat(selectedComplaint.longitude)}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-700/50 px-6 py-3 border-t border-gray-600 flex justify-end">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-md text-sm font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
