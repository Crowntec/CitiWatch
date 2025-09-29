'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LoadingCard } from '@/components/Loading';
import AdminLayout from '@/components/AdminLayout';
import { ComplaintService, type Complaint } from '@/services/complaint';
import { StatusService, type Status } from '@/services/status';

// Interface to match the UI expectations
interface ComplaintWithUser extends Complaint {
  status: string;
  category: string;
  userName?: string;
  createdAt: string;
  imageUrl?: string;
}

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<ComplaintWithUser[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Modal state for status updates
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<ComplaintWithUser | null>(null);
  const [newStatusId, setNewStatusId] = useState('');
  const [updating, setUpdating] = useState(false);

  // Error handler for API calls (removed to prevent infinite reloading)
  // const { handleApiError } = useApiErrorHandler();

  const loadComplaints = useCallback(async () => {
    setLoading(true);
    setError('');
    
    try {
      const [complaintsResult, statusesResult] = await Promise.all([
        ComplaintService.getAllComplaints(),
        StatusService.getAllStatuses()
      ]);
      
      if (!complaintsResult.success) {
        throw new Error(complaintsResult.message);
      }
      
      if (!statusesResult.success) {
        throw new Error(statusesResult.message); 
      }
      
      // Transform the API data to match the UI expectations
      const transformedComplaints = complaintsResult.data?.map(complaint => ({
        ...complaint,
        status: complaint.statusName || 'Unknown',
        category: complaint.categoryName || 'Unknown',
        userName: complaint.userName || 'Unknown User',
        createdAt: complaint.createdOn,
        imageUrl: complaint.mediaUrl || undefined
      })) || [];
      
      // Sort complaints by creation date (newest first)
      const sortedComplaints = transformedComplaints.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      setComplaints(sortedComplaints);
      setStatuses(statusesResult.data || []);
    } catch (error: unknown) {
      console.error('Error loading complaints:', error);
      setError(error instanceof Error ? error.message : 'Failed to load complaints');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadComplaints();
  }, [loadComplaints]);

  const filteredComplaints = useMemo(() => {
    return complaints.filter(complaint => {
      const matchesSearch = complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (complaint.userName && complaint.userName.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = selectedStatus === 'all' || 
                           complaint.status.toLowerCase() === selectedStatus.toLowerCase();
      
      const matchesCategory = selectedCategory === 'all' ||
                             complaint.category === selectedCategory;
      
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [complaints, searchTerm, selectedStatus, selectedCategory]);

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

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'fas fa-clock';
      case 'in progress':
        return 'fas fa-spinner';
      case 'resolved':
        return 'fas fa-check-circle';
      case 'rejected':
        return 'fas fa-times-circle';
      default:
        return 'fas fa-question-circle';
    }
  };

  const uniqueCategories = useMemo(() => {
    return Array.from(new Set(complaints.map(c => c.category)));
  }, [complaints]);

  const stats = useMemo(() => {
    return {
      total: complaints.length,
      pending: complaints.filter(c => c.status.toLowerCase() === 'pending').length,
      inProgress: complaints.filter(c => c.status.toLowerCase() === 'in progress').length,
      resolved: complaints.filter(c => c.status.toLowerCase() === 'resolved').length,
    };
  }, [complaints]);

  // Modal functions
  const openStatusModal = useCallback((complaint: ComplaintWithUser) => {
    setSelectedComplaint(complaint);
    // Find the status ID for the current status
    const currentStatus = statuses.find(s => s.name.toLowerCase() === complaint.status.toLowerCase());
    setNewStatusId(currentStatus?.id || '');
    setShowStatusModal(true);
  }, [statuses]);

  const updateComplaintStatus = useCallback(async (id: string, statusId: string) => {
    try {
      setUpdating(true);
      
      console.log('Updating complaint status:', { complaintId: id, statusId });
      
      const result = await ComplaintService.updateComplaintStatus(id, { id: statusId });
      
      if (!result.success) {
        throw new Error(result.message);
      }
      
      // Find the status name for UI update
      const statusName = statuses.find(s => s.id === statusId)?.name || 'Unknown';
      
      console.log('Status update successful:', { statusId, statusName });
      
      setComplaints(prev => 
        prev.map(complaint => 
          complaint.id === id 
            ? { ...complaint, status: statusName, lastModifiedOn: new Date().toISOString() }
            : complaint
        )
      );
      
      console.log(`Updated complaint ${id} status to ${statusName}`);
    } catch (error: unknown) {
      console.error('Error updating status:', error);
      setError(error instanceof Error ? error.message : 'Failed to update complaint status');
    } finally {
      setUpdating(false);
    }
  }, [statuses]);

  const handleStatusUpdate = useCallback(async () => {
    if (!selectedComplaint || !newStatusId) return;
    
    await updateComplaintStatus(selectedComplaint.id, newStatusId);
    setShowStatusModal(false);
    setSelectedComplaint(null);
    setNewStatusId('');
  }, [selectedComplaint, newStatusId, updateComplaintStatus]);

  const getDirectionsToComplaint = (complaint: ComplaintWithUser) => {
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

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-8">
          <LoadingCard message="Loading complaints..." />
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
                onClick={loadComplaints}
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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">Complaint Management</h1>
              <p className="text-gray-400 mt-2">Manage and review all citizen complaints</p>
            </div>
            <div className="flex space-x-3">
              <Link
                href="/admin/complaints/export"
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
              >
                <i className="fas fa-download mr-2"></i>
                Export
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-500/20">
                <i className="fas fa-exclamation-circle text-2xl text-purple-400"></i>
              </div>
              <div className="ml-4">
                <p className="text-3xl font-bold text-white">{stats.total}</p>
                <p className="text-gray-400">Total Complaints</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-500/20">
                <i className="fas fa-clock text-2xl text-yellow-400"></i>
              </div>
              <div className="ml-4">
                <p className="text-3xl font-bold text-white">{stats.pending}</p>
                <p className="text-gray-400">Pending Review</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-500/20">
                <i className="fas fa-spinner text-2xl text-blue-400"></i>
              </div>
              <div className="ml-4">
                <p className="text-3xl font-bold text-white">{stats.inProgress}</p>
                <p className="text-gray-400">In Progress</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-500/20">
                <i className="fas fa-check-circle text-2xl text-green-400"></i>
              </div>
              <div className="ml-4">
                <p className="text-3xl font-bold text-white">{stats.resolved}</p>
                <p className="text-gray-400">Resolved</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Status Links */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Filters</h3>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/complaints/pending"
              className="flex items-center px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-white transition-colors"
            >
              <i className="fas fa-clock mr-2"></i>
              Pending ({stats.pending})
            </Link>
            <Link
              href="/admin/complaints/progress"
              className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
            >
              <i className="fas fa-spinner mr-2"></i>
              In Progress ({stats.inProgress})
            </Link>
            <Link
              href="/admin/complaints/resolved"
              className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white transition-colors"
            >
              <i className="fas fa-check-circle mr-2"></i>
              Resolved ({stats.resolved})
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-300 mb-2">
                Search Complaints
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-search text-gray-400"></i>
                </div>
                <input
                  type="text"
                  id="search"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md leading-5 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Search by title, description, or user..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-2">
                Filter by Status
              </label>
              <select
                id="status"
                className="block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                {statuses.map(status => (
                  <option key={status.id} value={status.name}>{status.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
                Filter by Category
              </label>
              <select
                id="category"
                className="block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {uniqueCategories.map((category: string) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Complaints Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredComplaints.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <i className="fas fa-exclamation-circle text-4xl text-gray-500 mb-4"></i>
              <p className="text-gray-400 text-lg">
                {searchTerm || selectedStatus !== 'all' || selectedCategory !== 'all' 
                  ? 'No complaints match your filters.' 
                  : 'No complaints found.'}
              </p>
            </div>
          ) : (
            filteredComplaints.map((complaint) => (
              <div key={complaint.id} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg hover:shadow-xl hover:border-gray-600 transition-all duration-300">
                {/* Card Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <i className="fas fa-exclamation-circle text-white text-sm"></i>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white leading-tight flex items-center">
                          {complaint.title}
                          {complaint.latitude && complaint.longitude && (
                            <i className="fas fa-map-marker-alt ml-2 text-blue-400" title="Has location data"></i>
                          )}
                        </h3>
                        <p className="text-sm text-gray-400">
                          ID: #{complaint.id}
                        </p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                      <i className={`${getStatusIcon(complaint.status)} mr-1 text-xs`}></i>
                      {complaint.status}
                    </span>
                  </div>

                  {/* Image */}
                  {complaint.imageUrl && (
                    <div className="mb-4 relative h-48">
                      <Image 
                        className="rounded-lg object-cover border border-gray-600" 
                        src={complaint.imageUrl} 
                        alt="Complaint"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  )}

                  {/* Description */}
                  <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                    {complaint.description.length > 120 
                      ? `${complaint.description.substring(0, 120)}...` 
                      : complaint.description}
                  </p>

                  {/* Meta Information */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <i className="fas fa-user text-gray-400"></i>
                        <span className="text-gray-300">{complaint.userName}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <i className="fas fa-calendar-alt text-gray-400"></i>
                        <span className="text-gray-400">
                          {new Date(complaint.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700/50 text-gray-300 border border-gray-600">
                        <i className="fas fa-tag mr-1 text-xs"></i>
                        {complaint.category}
                      </span>
                      <span className="text-xs text-gray-500">
                        {Math.floor((new Date().getTime() - new Date(complaint.createdAt).getTime()) / (1000 * 60 * 60 * 24))} days ago
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Footer - Action Buttons */}
                <div className="px-6 py-4 bg-gray-700/30 border-t border-gray-600 rounded-b-lg">
                  <div className="flex items-center justify-between space-x-3">
                    <Link
                      href={`/admin/complaints/${complaint.id}`}
                      className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      <i className="fas fa-eye mr-2"></i>
                      View Details
                    </Link>
                    <div className="flex space-x-2">
                      {complaint.status.toLowerCase() === 'pending' && (
                        <button 
                          className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                          onClick={() => {
                            const inProgressStatus = statuses.find(s => s.name.toLowerCase() === 'in progress');
                            if (inProgressStatus) {
                              updateComplaintStatus(complaint.id, inProgressStatus.id);
                            }
                          }}
                          title="Start Working"
                        >
                          <i className="fas fa-play"></i>
                        </button>
                      )}
                      {complaint.status.toLowerCase() === 'in progress' && (
                        <button 
                          className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                          onClick={() => {
                            const resolvedStatus = statuses.find(s => s.name.toLowerCase() === 'resolved');
                            if (resolvedStatus) {
                              updateComplaintStatus(complaint.id, resolvedStatus.id);
                            }
                          }}
                          title="Mark as Resolved"
                        >
                          <i className="fas fa-check"></i>
                        </button>
                      )}
                      <button 
                        className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors"
                        onClick={() => openStatusModal(complaint)}
                        title="Change Status"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      {complaint.latitude && complaint.longitude && (
                        <button 
                          className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
                          onClick={() => getDirectionsToComplaint(complaint)}
                          title="Get Directions to Location"
                        >
                          <i className="fas fa-directions"></i>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Status Update Modal */}
        {showStatusModal && selectedComplaint && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 border border-gray-700 rounded-lg max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Update Status</h3>
                  <button
                    onClick={() => setShowStatusModal(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                <p className="text-gray-300 mb-4">
                  Update status for: <strong>{selectedComplaint.title}</strong>
                </p>
                <div className="space-y-3 mb-6">
                  {statuses.map((status) => (
                    <label key={status.id} className="flex items-center">
                      <input
                        type="radio"
                        name="status"
                        value={status.id}
                        checked={newStatusId === status.id}
                        onChange={(e) => setNewStatusId(e.target.value)}
                        className="mr-3 text-blue-600"
                      />
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status.name)}`}>
                        <i className={`${getStatusIcon(status.name)} mr-1 text-xs`}></i>
                        {status.name}
                      </span>
                    </label>
                  ))}
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowStatusModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleStatusUpdate()}
                    disabled={!newStatusId || updating}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center"
                  >
                    {updating ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        Updating...
                      </>
                    ) : (
                      'Update Status'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
