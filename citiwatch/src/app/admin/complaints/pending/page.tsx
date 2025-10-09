'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LoadingCard } from '@/components/Loading';
import AdminLayout from '@/components/AdminLayout';
import { ComplaintService, type Complaint } from '@/services/complaint';

// Interface for UI
interface ComplaintWithUser extends Complaint {
  status: string;
  category: string;
  userName?: string;
  createdAt: string;
  imageUrl?: string;
}

export default function PendingComplaintsPage() {
  const [complaints, setComplaints] = useState<ComplaintWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const loadComplaints = async () => {
    setLoading(true);
    setError('');
    
    try {
      const result = await ComplaintService.getAllComplaints();
      
      if (!result.success) {
        throw new Error(result.message);
      }
      
      // Transform API data and filter for pending complaints
      const transformedComplaints = result.data?.map(complaint => ({
        ...complaint,
        status: complaint.statusName || 'Unknown',
        category: complaint.categoryName || 'Unknown',
        userName: complaint.userName || 'User Info N/A',
        createdAt: complaint.createdOn,
        imageUrl: complaint.mediaUrl || undefined
      })).filter(complaint => complaint.status.toLowerCase() === 'pending') || [];
      
      // Sort complaints by creation date (newest first)
      const sortedComplaints = transformedComplaints.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      setComplaints(sortedComplaints);
    } catch (error: unknown) {
      console.error('Error loading pending complaints:', error);
      setError(error instanceof Error ? error.message : 'Failed to load pending complaints');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  const filteredComplaints = complaints.filter(complaint =>
    complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (complaint.userName && complaint.userName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    complaint.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleQuickStatusUpdate = async (complaintId: string, newStatus: string) => {
    try {
      // Use the ComplaintService to update status via hosted API
      const result = await ComplaintService.updateComplaintStatus(complaintId, { id: complaintId });
      
      if (result.success) {
        // Remove complaint from pending list on successful update
        setComplaints(complaints.filter(c => c.id !== complaintId));
        
        // Show success message
        const statusText = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);
        alert(`Complaint marked as ${statusText}`);
      } else {
        alert(result.message || 'Failed to update complaint status');
      }
    } catch (error) {
      console.error('Error updating complaint status:', error);
      alert('Failed to update complaint status');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-8">
          <LoadingCard message="Loading pending complaints..." />
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
              <div className="flex items-center space-x-3 mb-2">
                <Link
                  href="/admin/complaints"
                  className="text-blue-400 hover:text-blue-300 text-sm flex items-center"
                >
                  <i className="fas fa-arrow-left mr-2"></i>
                  Back to All Complaints
                </Link>
              </div>
              <h1 className="text-3xl font-bold text-white flex items-center">
                <i className="fas fa-clock text-yellow-400 mr-3"></i>
                Pending Complaints
              </h1>
              <p className="text-gray-400 mt-2">Review and take action on complaints awaiting attention</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  const confirmBulk = confirm('Mark all visible complaints as "In Progress"?');
                  if (confirmBulk && filteredComplaints.length > 0) {
                    filteredComplaints.forEach(complaint => {
                      handleQuickStatusUpdate(complaint.id, 'in progress');
                    });
                  }
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
                disabled={filteredComplaints.length === 0}
              >
                <i className="fas fa-play mr-2"></i>
                Bulk Start Progress
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-500/20">
                <i className="fas fa-clock text-2xl text-yellow-400"></i>
              </div>
              <div className="ml-4">
                <p className="text-3xl font-bold text-white">{complaints.length}</p>
                <p className="text-gray-400">Total Pending</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-500/20">
                <i className="fas fa-exclamation-triangle text-2xl text-red-400"></i>
              </div>
              <div className="ml-4">
                <p className="text-3xl font-bold text-white">
                  {complaints.filter(c => {
                    const days = Math.floor((Date.now() - new Date(c.createdAt).getTime()) / (1000 * 60 * 60 * 24));
                    return days > 7;
                  }).length}
                </p>
                <p className="text-gray-400">Overdue (7+ days)</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-500/20">
                <i className="fas fa-calendar-day text-2xl text-orange-400"></i>
              </div>
              <div className="ml-4">
                <p className="text-3xl font-bold text-white">
                  {complaints.filter(c => {
                    const today = new Date();
                    const createdDate = new Date(c.createdAt);
                    return today.toDateString() === createdDate.toDateString();
                  }).length}
                </p>
                <p className="text-gray-400">Submitted Today</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-500/20">
                <i className="fas fa-search text-2xl text-blue-400"></i>
              </div>
              <div className="ml-4">
                <p className="text-3xl font-bold text-white">{filteredComplaints.length}</p>
                <p className="text-gray-400">Filtered Results</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Priority Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button 
              onClick={() => {
                const overdue = complaints.filter(c => {
                  const days = Math.floor((Date.now() - new Date(c.createdAt).getTime()) / (1000 * 60 * 60 * 24));
                  return days > 7;
                });
                if (overdue.length > 0) {
                  setComplaints(overdue);
                  setSearchTerm('');
                }
              }}
              className="flex items-center justify-center p-4 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors"
            >
              <i className="fas fa-exclamation-triangle mr-2"></i>
              Show Overdue Only
            </button>
            <button 
              onClick={() => {
                const today = complaints.filter(c => {
                  const todayDate = new Date();
                  const createdDate = new Date(c.createdAt);
                  return todayDate.toDateString() === createdDate.toDateString();
                });
                if (today.length > 0) {
                  setComplaints(today);
                  setSearchTerm('');
                }
              }}
              className="flex items-center justify-center p-4 bg-orange-600 hover:bg-orange-700 rounded-lg text-white transition-colors"
            >
              <i className="fas fa-calendar-day mr-2"></i>
              Today&apos;s Submissions
            </button>
            <button 
              onClick={loadComplaints}
              className="flex items-center justify-center p-4 bg-gray-600 hover:bg-gray-700 rounded-lg text-white transition-colors"
            >
              <i className="fas fa-refresh mr-2"></i>
              Reset Filters
            </button>
            <Link
              href="/admin/complaints"
              className="flex items-center justify-center p-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
            >
              <i className="fas fa-list mr-2"></i>
              View All Complaints
            </Link>
          </div>
        </div>

        {/* Search */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg p-6 mb-6">
          <div className="max-w-md">
            <label htmlFor="search" className="block text-sm font-medium text-gray-300 mb-2">
              Search Pending Complaints
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fas fa-search text-gray-400"></i>
              </div>
              <input
                type="text"
                id="search"
                className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md leading-5 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search by title, description, user, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Complaints List */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg">
          <div className="px-6 py-4 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-white">
              Pending Complaints ({filteredComplaints.length})
            </h3>
          </div>
          <div className="divide-y divide-gray-700">
            {filteredComplaints.length === 0 ? (
              <div className="text-center py-12">
                <i className="fas fa-check-circle text-4xl text-green-500 mb-4"></i>
                <p className="text-gray-400 text-lg">
                  {searchTerm 
                    ? 'No pending complaints match your search.' 
                    : complaints.length === 0
                      ? 'No pending complaints! Great job!'
                      : 'All complaints have been filtered out.'
                  }
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="mt-4 text-blue-400 hover:text-blue-300"
                  >
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              filteredComplaints.map((complaint) => {
                const daysPending = Math.floor((Date.now() - new Date(complaint.createdAt).getTime()) / (1000 * 60 * 60 * 24));
                const isOverdue = daysPending > 7;
                
                return (
                  <div key={complaint.id} className="p-6 hover:bg-gray-700/30 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-lg font-medium text-white">{complaint.title}</h4>
                          {isOverdue && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-900/50 text-red-300 border border-red-700">
                              <i className="fas fa-exclamation-triangle mr-1"></i>
                              Overdue
                            </span>
                          )}
                        </div>
                        <p className="text-gray-300 mb-3 line-clamp-2">{complaint.description}</p>
                        <div className="flex items-center space-x-6 text-sm text-gray-400">
                          <span>
                            <i className="fas fa-user mr-1"></i>
                            {complaint.userName}
                          </span>
                          <span>
                            <i className="fas fa-tag mr-1"></i>
                            {complaint.category}
                          </span>
                          <span className={isOverdue ? 'text-red-400' : ''}>
                            <i className="fas fa-calendar mr-1"></i>
                            {daysPending === 0 ? 'Today' : `${daysPending} days ago`}
                          </span>
                        </div>
                      </div>
                      {complaint.imageUrl && (
                        <div className="ml-4 flex-shrink-0">
                          <Image 
                            src={complaint.imageUrl} 
                            alt="Complaint"
                            className="w-16 h-16 rounded-lg object-cover"
                            width={64}
                            height={64}
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleQuickStatusUpdate(complaint.id, 'in progress')}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                        >
                          <i className="fas fa-play mr-1"></i>
                          Start Progress
                        </button>
                        <button
                          onClick={() => handleQuickStatusUpdate(complaint.id, 'resolved')}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                        >
                          <i className="fas fa-check mr-1"></i>
                          Mark Resolved
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Are you sure you want to reject this complaint?')) {
                              handleQuickStatusUpdate(complaint.id, 'rejected');
                            }
                          }}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                        >
                          <i className="fas fa-times mr-1"></i>
                          Reject
                        </button>
                      </div>
                      <Link
                        href={`/admin/complaints/${complaint.id}`}
                        className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                      >
                        <i className="fas fa-eye mr-1"></i>
                        View Details
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
