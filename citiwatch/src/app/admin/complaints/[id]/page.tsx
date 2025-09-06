'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { makeAuthenticatedRequest } from '@/utils/api';
import { LoadingCard } from '@/components/Loading';
import AdminLayout from '@/components/AdminLayout';

interface Complaint {
  id: string;
  title: string;
  description: string;
  status: string;
  category: string;
  userName: string;
  userEmail: string;
  createdAt: string;
  updatedAt?: string;
  imageUrl?: string;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
}

export default function ComplaintDetailPage({ params }: { params: { id: string } }) {
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const router = useRouter();

  const loadComplaint = async () => {
    setLoading(true);
    setError('');
    
    try {
      // TODO: Implement actual API call for single complaint
      // const data = await makeAuthenticatedRequest<Complaint>(`/api/Complaint/GetById/${params.id}`);
      
      // Mock data for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockComplaint: Complaint = {
        id: params.id,
        title: 'Broken Street Light on Main Street',
        description: 'The street light on Main Street near the intersection with Oak Avenue has been broken for several days. It\'s causing safety concerns for pedestrians and drivers, especially during evening hours. The light appears to be flickering intermittently before going completely dark.',
        status: 'pending',
        category: 'Infrastructure',
        userName: 'John Doe',
        userEmail: 'john.doe@email.com',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
        imageUrl: '/placeholder-complaint.jpg',
        location: {
          latitude: 40.7128,
          longitude: -74.0060,
          address: 'Main Street & Oak Avenue, City Center'
        }
      };
      
      setComplaint(mockComplaint);
      setNewStatus(mockComplaint.status);
    } catch (error) {
      console.error('Error loading complaint:', error);
      setError('Failed to load complaint details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaint();
  }, [params.id]);

  const handleStatusUpdate = async () => {
    if (!complaint || newStatus === complaint.status) {
      setShowStatusModal(false);
      return;
    }
    
    setUpdating(true);
    try {
      // TODO: Implement actual API call
      // await makeAuthenticatedRequest(`/api/Complaint/UpdateStatus/${complaint.id}`, {
      //   method: 'PUT',
      //   body: JSON.stringify({ status: newStatus })
      // });
      
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setComplaint({ ...complaint, status: newStatus, updatedAt: new Date().toISOString() });
      setShowStatusModal(false);
    } catch (error) {
      console.error('Error updating complaint status:', error);
      alert('Failed to update complaint status');
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
                      <img 
                        src={complaint.imageUrl} 
                        alt="Complaint attachment"
                        className="w-full h-64 object-cover"
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
                      <p className="text-gray-400 text-sm">
                        Coordinates: {complaint.location.latitude}, {complaint.location.longitude}
                      </p>
                      {/* TODO: Add map integration */}
                      <div className="mt-3 bg-gray-600/50 rounded-lg h-32 flex items-center justify-center">
                        <p className="text-gray-400">
                          <i className="fas fa-map mr-2"></i>
                          Map integration coming soon
                        </p>
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
                      {complaint.userName.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-medium">{complaint.userName}</p>
                    <p className="text-gray-400 text-sm">{complaint.userEmail}</p>
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
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="pending">Pending</option>
                <option value="in progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="rejected">Rejected</option>
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
                disabled={updating || newStatus === complaint.status}
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
