'use client';

import { useState, useEffect } from 'react';
import { LoadingCard } from '@/components/Loading';
import AdminLayout from '@/components/AdminLayout';
import { StatusService, type Status as ApiStatus } from '@/services/status';

// Extended Status interface for UI display
interface Status extends ApiStatus {
  description: string;
  color: string;
  icon: string;
  order: number;
  isActive: boolean;
  createdAt: string;
}

// Helper functions for mapping status properties
const getStatusColor = (name: string): string => {
  switch (name.toLowerCase()) {
    case 'pending':
    case 'submitted':
      return 'yellow';
    case 'in progress':
    case 'processing':
      return 'blue';
    case 'resolved':
    case 'completed':
      return 'green';
    case 'rejected':
    case 'cancelled':
      return 'red';
    case 'under review':
    case 'reviewing':
      return 'purple';
    default:
      return 'gray';
  }
};

const getStatusIcon = (name: string): string => {
  switch (name.toLowerCase()) {
    case 'pending':
    case 'submitted':
      return 'fas fa-clock';
    case 'in progress':
    case 'processing':
      return 'fas fa-spinner';
    case 'resolved':
    case 'completed':
      return 'fas fa-check-circle';
    case 'rejected':
    case 'cancelled':
      return 'fas fa-times-circle';
    case 'under review':
    case 'reviewing':
      return 'fas fa-search';
    default:
      return 'fas fa-circle';
  }
};

export default function StatusManagementPage() {
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadStatuses = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await StatusService.getAllStatuses();
      
      if (response.success && response.data) {
        // Map API status data to the extended interface expected by the UI
        const mappedStatuses = response.data.map((status, index) => ({
          ...status,
          description: `Status: ${status.name}`,
          color: getStatusColor(status.name),
          icon: getStatusIcon(status.name),
          order: index + 1,
          isActive: true,
          createdAt: status.createdOn || new Date().toISOString()
        }));
        
        setStatuses(mappedStatuses);
      } else {
        setError(response.message || 'Failed to load statuses');
      }
    } catch (error) {
      console.error('Error loading statuses:', error);
      setError('Failed to load status information');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatuses();
  }, []);

  const getColorClasses = (color: string, isActive: boolean = true) => {
    const opacity = isActive ? '50' : '20';
    const textOpacity = isActive ? '300' : '500';
    
    switch (color) {
      case 'yellow':
        return `bg-yellow-900/${opacity} text-yellow-${textOpacity} border border-yellow-700`;
      case 'blue':
        return `bg-blue-900/${opacity} text-blue-${textOpacity} border border-blue-700`;
      case 'green':
        return `bg-green-900/${opacity} text-green-${textOpacity} border border-green-700`;
      case 'red':
        return `bg-red-900/${opacity} text-red-${textOpacity} border border-red-700`;
      case 'purple':
        return `bg-purple-900/${opacity} text-purple-${textOpacity} border border-purple-700`;
      default:
        return `bg-gray-700/${opacity} text-gray-${textOpacity} border border-gray-600`;
    }
  };

  const getBackgroundColor = (color: string) => {
    switch (color) {
      case 'yellow':
        return 'bg-yellow-500/20';
      case 'blue':
        return 'bg-blue-500/20';
      case 'green':
        return 'bg-green-500/20';
      case 'red':
        return 'bg-red-500/20';
      case 'purple':
        return 'bg-purple-500/20';
      default:
        return 'bg-gray-500/20';
    }
  };

  const getIconColor = (color: string) => {
    switch (color) {
      case 'yellow':
        return 'text-yellow-400';
      case 'blue':
        return 'text-blue-400';
      case 'green':
        return 'text-green-400';
      case 'red':
        return 'text-red-400';
      case 'purple':
        return 'text-purple-400';
      default:
        return 'text-gray-400';
    }
  };

  const activeStatuses = statuses.filter(status => status.isActive).sort((a, b) => a.order - b.order);
  const inactiveStatuses = statuses.filter(status => !status.isActive);

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-8">
          <LoadingCard message="Loading status information..." />
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
                onClick={loadStatuses}
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
              <h1 className="text-3xl font-bold text-white">Status Management</h1>
              <p className="text-gray-400 mt-2">Configure and manage complaint status workflow</p>
            </div>
            <div className="flex space-x-3">
              <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center">
                <i className="fas fa-download mr-2"></i>
                Export Settings
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center">
                <i className="fas fa-plus mr-2"></i>
                Add Status
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-500/20">
                <i className="fas fa-check-circle text-2xl text-green-400"></i>
              </div>
              <div className="ml-4">
                <p className="text-3xl font-bold text-white">{activeStatuses.length}</p>
                <p className="text-gray-400">Active Statuses</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-gray-500/20">
                <i className="fas fa-pause-circle text-2xl text-gray-400"></i>
              </div>
              <div className="ml-4">
                <p className="text-3xl font-bold text-white">{inactiveStatuses.length}</p>
                <p className="text-gray-400">Inactive Statuses</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-500/20">
                <i className="fas fa-list-ol text-2xl text-blue-400"></i>
              </div>
              <div className="ml-4">
                <p className="text-3xl font-bold text-white">{statuses.length}</p>
                <p className="text-gray-400">Total Statuses</p>
              </div>
            </div>
          </div>
        </div>

        {/* Active Status Workflow */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg mb-8">
          <div className="px-6 py-4 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-white">Active Status Workflow</h3>
            <p className="text-gray-400 text-sm mt-1">Current complaint status progression flow</p>
          </div>
          <div className="p-6">
            <div className="flex flex-wrap items-center gap-4">
              {activeStatuses.map((status, index) => (
                <div key={status.id} className="flex items-center">
                  <div className="flex items-center space-x-3 bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                    <div className={`p-3 rounded-full ${getBackgroundColor(status.color)}`}>
                      <i className={`${status.icon} text-xl ${getIconColor(status.color)}`}></i>
                    </div>
                    <div>
                      <h4 className="font-medium text-white">{status.name}</h4>
                      <p className="text-xs text-gray-400">Order: {status.order}</p>
                    </div>
                  </div>
                  {index < activeStatuses.length - 1 && (
                    <div className="mx-4 text-gray-400">
                      <i className="fas fa-arrow-right"></i>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Status Details */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg">
          <div className="px-6 py-4 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-white">All Status Configurations</h3>
            <p className="text-gray-400 text-sm mt-1">Manage individual status settings and properties</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {statuses.sort((a, b) => a.order - b.order).map((status) => (
                  <tr key={status.id} className={`hover:bg-gray-700/30 transition-colors ${!status.isActive ? 'opacity-60' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${getBackgroundColor(status.color)}`}>
                          <i className={`${status.icon} text-sm ${getIconColor(status.color)}`}></i>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">{status.name}</div>
                          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${getColorClasses(status.color, status.isActive)}`}>
                            {status.color}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-300 max-w-xs">
                        {status.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-white">
                        #{status.order}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        status.isActive 
                          ? 'bg-green-900/50 text-green-300 border border-green-700' 
                          : 'bg-red-900/50 text-red-300 border border-red-700'
                      }`}>
                        <i className={`${status.isActive ? 'fas fa-check' : 'fas fa-times'} mr-1 text-xs`}></i>
                        {status.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-400 hover:text-blue-300 transition-colors">
                          <i className="fas fa-edit mr-1"></i>
                          Edit
                        </button>
                        <button 
                          className={`${
                            status.isActive 
                              ? 'text-red-400 hover:text-red-300' 
                              : 'text-green-400 hover:text-green-300'
                          } transition-colors`}
                        >
                          <i className={`${status.isActive ? 'fas fa-pause' : 'fas fa-play'} mr-1`}></i>
                          {status.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-blue-900/20 border border-blue-700/30 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-300 mb-3">
            <i className="fas fa-info-circle mr-2"></i>
            Status Management Guide
          </h3>
          <div className="space-y-2 text-blue-200 text-sm">
            <p>• <strong>Order:</strong> Determines the sequence of status progression in the workflow</p>
            <p>• <strong>Active Status:</strong> Only active statuses are available for complaint updates</p>
            <p>• <strong>Color Coding:</strong> Helps users and administrators quickly identify complaint status</p>
            <p>• <strong>Icons:</strong> Visual indicators that enhance the user interface experience</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
