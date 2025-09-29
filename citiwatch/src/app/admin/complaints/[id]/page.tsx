'use client';

import { useState, useEffect, useCallback, use, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { LoadingCard } from '@/components/Loading';
import AdminLayout from '@/components/AdminLayout';
import { ComplaintService, type Complaint as APIComplaint } from '@/services/complaint';
import { StatusService, type Status } from '@/services/status';

// Dynamically import MapDisplay to avoid SSR issues
const MapDisplay = dynamic(() => import('@/components/MapDisplay'), {
  ssr: false,
  loading: () => (
    <div className="h-64 w-full rounded-lg bg-gray-600/50 flex items-center justify-center">
      <p className="text-gray-400">Loading map...</p>
    </div>
  )
});

// Extended interface for UI with additional fields
interface ComplaintDetails extends APIComplaint {
  status: string;
  category: string;  
  userName?: string;
  userEmail?: string;
  createdAt: string;
  updatedAt?: string;
  imageUrl?: string;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
}

export default function ComplaintDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const complaintId = useMemo(() => resolvedParams.id, [resolvedParams.id]);
  const [complaint, setComplaint] = useState<ComplaintDetails | null>(null);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);
  const [newStatusId, setNewStatusId] = useState('');
  const [showStatusModal, setShowStatusModal] = useState(false);

  const loadComplaint = useCallback(async () => {
    setLoading(true);
    setError('');
    
    try {
      const [complaintResult, statusesResult] = await Promise.all([
        ComplaintService.getComplaintById(complaintId),
        StatusService.getAllStatuses()
      ]);
      
      if (!complaintResult.success) {
        throw new Error(`Failed to load complaint: ${complaintResult.message}`);
      }
      
      if (!statusesResult.success) {
        console.warn('Failed to load statuses:', statusesResult.message);
      }
      
      if (!complaintResult.data) {
        throw new Error('Complaint not found');
      }
      
      // Transform the API data to match UI expectations
      const transformedComplaint: ComplaintDetails = {
        ...complaintResult.data,
        status: complaintResult.data.statusName || 'Unknown',
        category: complaintResult.data.categoryName || 'Unknown',
        userName: complaintResult.data.userName || 'Unknown User',
        userEmail: complaintResult.data.userEmail || 'unknown@email.com',
        createdAt: complaintResult.data.createdOn,
        updatedAt: complaintResult.data.lastModifiedOn,
        imageUrl: complaintResult.data.mediaUrl || undefined,
        location: complaintResult.data.latitude && complaintResult.data.longitude ? {
          latitude: parseFloat(complaintResult.data.latitude),
          longitude: parseFloat(complaintResult.data.longitude),
          address: undefined // API doesn't provide address
        } : undefined
      };

      setComplaint(transformedComplaint);
      setStatuses(statusesResult.data || []);
      
      // Set initial status for modal
      const currentStatus = statusesResult.data?.find(s => s.name.toLowerCase() === transformedComplaint.status.toLowerCase());
      setNewStatusId(currentStatus?.id || '');
    } catch (error: unknown) {
      console.error('Error loading complaint:', error);
      setError(error instanceof Error ? error.message : 'Failed to load complaint details');
    } finally {
      setLoading(false);
    }
  }, [complaintId]);

  useEffect(() => {
    loadComplaint();
  }, [loadComplaint]);

  const handleStatusUpdate = async () => {
    if (!complaint || !newStatusId) {
      setShowStatusModal(false);
      return;
    }
    
    // Check if status is actually changing
    const currentStatus = statuses.find(s => s.name.toLowerCase() === complaint.status.toLowerCase());
    if (currentStatus?.id === newStatusId) {
      setShowStatusModal(false);
      return;
    }
    
    setUpdating(true);
    try {
      console.log('Updating complaint status:', { complaintId: complaint.id, statusId: newStatusId });
      
      const result = await ComplaintService.updateComplaintStatus(complaint.id, { id: newStatusId });
      
      if (!result.success) {
        throw new Error(result.message);
      }
      
      // Find the status name for UI update
      const statusName = statuses.find(s => s.id === newStatusId)?.name || 'Unknown';
      
      console.log('Status update successful:', { statusId: newStatusId, statusName });
      
      setComplaint({ ...complaint, status: statusName, updatedAt: new Date().toISOString() });
      setShowStatusModal(false);
      
      console.log(`Updated complaint ${complaint.id} status to ${statusName}`);
    } catch (error: unknown) {
      console.error('Error updating complaint status:', error);
      setError(error instanceof Error ? error.message : 'Failed to update complaint status');
    } finally {
      setUpdating(false);
    }
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

  const getDirectionsToLocation = (latitude: number, longitude: number) => {
    const destination = `${latitude},${longitude}`;
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude: currentLat, longitude: currentLng } = position.coords;
          const origin = `${currentLat},${currentLng}`;
          
          // Detect user's platform and provide appropriate mapping service
          const userAgent = navigator.userAgent;
          let mapsUrl: string;
          
          if (/iPhone|iPad|iPod/i.test(userAgent)) {
            // iOS - Apple Maps
            mapsUrl = `maps://maps.apple.com/?saddr=${currentLat},${currentLng}&daddr=${destination}`;
            // Fallback to Google Maps if Apple Maps not available
            setTimeout(() => {
              window.open(`https://www.google.com/maps/dir/${origin}/${destination}`, '_blank');
            }, 1000);
            window.location.href = mapsUrl;
          } else if (/Android/i.test(userAgent)) {
            // Android - Google Maps
            mapsUrl = `google.navigation:q=${destination}&mode=d`;
            // Fallback to web Google Maps
            setTimeout(() => {
              window.open(`https://www.google.com/maps/dir/${origin}/${destination}`, '_blank');
            }, 1000);
            window.location.href = mapsUrl;
          } else {
            // Desktop - Open Google Maps in new tab
            mapsUrl = `https://www.google.com/maps/dir/${origin}/${destination}`;
            window.open(mapsUrl, '_blank');
          }
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

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-8">
          <LoadingCard message="Loading complaint details..." />
        </div>
      </AdminLayout>
    );
  }

  if (error || !complaint) {
    return (
      <AdminLayout>
        <div className="p-8">
          <div className="text-center py-8">
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
              <i className="fas fa-exclamation-triangle text-red-400 text-2xl mb-2"></i>
              <p className="text-red-300 mb-4">{error || 'Complaint not found'}</p>
              <Link
                href="/admin/complaints"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
              >
                Back to Complaints
              </Link>
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
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/admin/complaints"
                className="text-blue-400 hover:text-blue-300 text-sm flex items-center mb-2"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Back to Complaints
              </Link>
              <h1 className="text-3xl font-bold text-white">{complaint.title}</h1>
              <p className="text-gray-400 mt-2">Complaint #{complaint.id}</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowStatusModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
              >
                <i className="fas fa-edit mr-2"></i>
                Update Status
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Complaint Details */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Complaint Details</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Description</h3>
                  <p className="text-gray-300 leading-relaxed">{complaint.description}</p>
                </div>

                {complaint.imageUrl && (
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">Attached Image</h3>
                    <div className="rounded-lg overflow-hidden">
                      <Image 
                        src={complaint.imageUrl} 
                        alt="Complaint attachment"
                        className="w-full h-64 object-cover"
                        width={400}
                        height={256}
                      />
                    </div>
                  </div>
                )}

                {complaint.location && (
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">Location</h3>
                    <div className="bg-gray-700/50 rounded-lg p-4">
                      {complaint.location.address && (
                        <p className="text-gray-300 mb-2">
                          <i className="fas fa-map-marker-alt mr-2"></i>
                          {complaint.location.address}
                        </p>
                      )}
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-gray-400 text-sm">
                          Coordinates: {complaint.location.latitude}, {complaint.location.longitude}
                        </p>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => complaint.location && getDirectionsToLocation(complaint.location.latitude, complaint.location.longitude)}
                            className="inline-flex items-center px-3 py-1 text-sm font-medium text-purple-400 hover:text-purple-300 border border-purple-600 hover:border-purple-500 rounded-md transition-colors"
                          >
                            <i className="fas fa-directions mr-2"></i>
                            Get Directions
                          </button>
                          <a
                            href={`https://www.google.com/maps/search/${complaint.location?.latitude},${complaint.location?.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-400 hover:text-blue-300 border border-blue-600 hover:border-blue-500 rounded-md transition-colors"
                          >
                            <i className="fas fa-external-link-alt mr-2"></i>
                            Open in Maps
                          </a>
                        </div>
                      </div>
                      <div className="mt-3">
                        <MapDisplay 
                          latitude={complaint.location.latitude}
                          longitude={complaint.location.longitude}
                          address={complaint.location.address}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Status History */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Status History</h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${getStatusColor(complaint.status).replace('border', '').replace('text-', 'text-white ')}`}>
                    <i className={`${getStatusIcon(complaint.status)} text-sm`}></i>
                  </div>
                  <div>
                    <p className="text-white font-medium">Current Status: {complaint.status}</p>
                    <p className="text-gray-400 text-sm">
                      {complaint.updatedAt && new Date(complaint.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                {/* TODO: Add full status history */}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Current Status</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium ${getStatusColor(complaint.status)}`}>
                    <i className={`${getStatusIcon(complaint.status)} mr-2`}></i>
                    {complaint.status}
                  </span>
                </div>
                <button
                  onClick={() => setShowStatusModal(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Change Status
                </button>
              </div>
            </div>

            {/* User Information */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Submitted By</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {complaint.userName ? complaint.userName.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-medium">{complaint.userName || 'Unknown User'}</p>
                    <p className="text-gray-400 text-sm">{complaint.userEmail || 'Unknown Email'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Complaint Info */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Complaint Info</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-400 text-sm">Category</p>
                  <p className="text-white font-medium">{complaint.category}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Created</p>
                  <p className="text-white">{new Date(complaint.createdAt).toLocaleString()}</p>
                </div>
                {complaint.updatedAt && (
                  <div>
                    <p className="text-gray-400 text-sm">Last Updated</p>
                    <p className="text-white">{new Date(complaint.updatedAt).toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Update Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-white">Update Complaint Status</h3>
              <button
                onClick={() => setShowStatusModal(false)}
                className="text-gray-400 hover:text-gray-300"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="mb-6">
              <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-2">
                New Status
              </label>
              <select
                id="status"
                value={newStatusId}
                onChange={(e) => setNewStatusId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a status</option>
                {statuses.map(status => (
                  <option key={status.id} value={status.id}>{status.name}</option>
                ))}
              </select>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowStatusModal(false)}
                className="px-4 py-2 text-gray-400 hover:text-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusUpdate}
                disabled={updating || !newStatusId}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
              >
                {updating ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Updating...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save mr-2"></i>
                    Update Status
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
