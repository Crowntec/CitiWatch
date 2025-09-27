'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LoadingButton } from '@/components/Loading';
import Navigation from '@/components/Navigation';
import LocationMap from '@/components/LocationMap';
import { CategoryService, type Category } from '@/services/category';
import { ComplaintService } from '@/services/complaint';

export default function SubmitComplaint() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    latitude: '',
    longitude: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [locationLoading, setLocationLoading] = useState(false);
  const [showLocationMap, setShowLocationMap] = useState(false);
  const [tempLocation, setTempLocation] = useState<{
    latitude: number;
    longitude: number;
    address?: string;
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    loadCategories();
  }, [router]);

  const loadCategories = async () => {
    try {
      const response = await CategoryService.getAllCategories();
      
      if (response.success) {
        setCategories(response.data || []);
      } else {
        setError('Failed to load categories: ' + response.message);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      setError('Failed to load categories');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      
      // Check file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        setError('Please select a valid image file (JPG, JPEG, PNG, GIF)');
        return;
      }
      
      setSelectedFile(file);
      setError('');
    }
  };

  const getCurrentLocation = () => {
    setLocationLoading(true);
    setError('');
    
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      setLocationLoading(false);
      return;
    }

    // Get position with proper error handling
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('Location obtained successfully:', position.coords);
        // Store temporary location and show map for confirmation
        setTempLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setShowLocationMap(true);
        setLocationLoading(false);
      },
      (error) => {
        // Log the full error object for debugging
        console.error('Geolocation error details:', {
          code: error.code,
          message: error.message,
          fullError: error
        });
        
        let errorMessage = 'Unable to get location. ';
        
        // Check if running on secure context
        if (!window.isSecureContext) {
          errorMessage += 'Location access requires a secure context (HTTPS or localhost).';
        } else if (error && error.code) {
          switch (error.code) {
            case GeolocationPositionError.PERMISSION_DENIED:
              errorMessage += 'Location access was denied. Please click the location icon in your browser\'s address bar and allow location access, then try again.';
              break;
            case GeolocationPositionError.POSITION_UNAVAILABLE:
              errorMessage += 'Location information is unavailable. Please check your device\'s location settings or enter coordinates manually.';
              break;
            case GeolocationPositionError.TIMEOUT:
              errorMessage += 'Location request timed out. Please try again.';
              break;
            default:
              errorMessage += 'An unknown error occurred. Please try again or enter coordinates manually.';
              break;
          }
        } else {
          errorMessage += 'Location access may be blocked by your browser settings or device privacy settings. Please check your browser permissions.';
        }
        
        setError(errorMessage);
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  const handleLocationConfirm = () => {
    if (tempLocation) {
      setFormData({
        ...formData,
        latitude: tempLocation.latitude.toString(),
        longitude: tempLocation.longitude.toString(),
      });
      setShowLocationMap(false);
      setTempLocation(null);
    }
  };

  const handleLocationCancel = () => {
    setShowLocationMap(false);
    setTempLocation(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Simple validation
    const validationErrors = [];
    if (!formData.title.trim()) validationErrors.push('Title is required');
    if (!formData.description.trim()) validationErrors.push('Description is required');
    if (!formData.categoryId) validationErrors.push('Category is required');

    if (validationErrors.length > 0) {
      setError(validationErrors.join(', '));
      setLoading(false);
      return;
    }

    try {
      const complaintData = {
        title: formData.title,
        description: formData.description,
        categoryId: formData.categoryId,
        latitude: formData.latitude || undefined,
        longitude: formData.longitude || undefined,
      };

      const response = await ComplaintService.submitComplaint(complaintData, selectedFile || undefined);

      if (response.success) {
        setSuccess('Complaint submitted successfully!');
        // Reset form
        setFormData({
          title: '',
          description: '',
          categoryId: '',
          latitude: '',
          longitude: '',
        });
        setSelectedFile(null);
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        setError(response.message || 'Failed to submit complaint');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to submit complaint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Navigation */}
      <Navigation />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Submit a Complaint</h1>
          <p className="text-gray-400 mt-2">Report a civic issue in your community</p>
        </div>

        {/* Form */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg p-6 border border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-md">
                {error}
              </div>
            )}
            
            {success && (
              <div className="bg-green-900/50 border border-green-700 text-green-300 px-4 py-3 rounded-md">
                {success}
              </div>
            )}

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-300">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-gray-700/50 text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                placeholder="Brief description of the issue"
                minLength={5}
                maxLength={200}
              />
            </div>

            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium text-gray-300">
                Category *
              </label>
              <select
                id="categoryId"
                name="categoryId"
                required
                value={formData.categoryId}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-gray-700/50 text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                required
                value={formData.description}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-gray-700/50 text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                placeholder="Detailed description of the issue..."
                minLength={10}
                maxLength={2000}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Photo Evidence
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md hover:border-gray-500 bg-gray-800/30">
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-400">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-gray-700/50 font-medium text-blue-400 hover:text-blue-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-800 px-2 py-1"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        accept="image/jpeg,image/jpg,image/png,image/gif"
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                  {selectedFile && (
                    <p className="text-sm text-green-400">
                      Selected: {selectedFile.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Location (Optional)
              </label>
              
              {showLocationMap && tempLocation ? (
                <LocationMap
                  latitude={tempLocation.latitude}
                  longitude={tempLocation.longitude}
                  onConfirm={handleLocationConfirm}
                  onCancel={handleLocationCancel}
                  address={tempLocation.address}
                />
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="latitude" className="block text-xs font-medium text-gray-400 mb-1">
                        Latitude
                      </label>
                      <input
                        type="text"
                        id="latitude"
                        name="latitude"
                        value={formData.latitude}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border border-gray-600 bg-gray-700/50 text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                        placeholder="e.g., 40.7128"
                      />
                    </div>
                    <div>
                      <label htmlFor="longitude" className="block text-xs font-medium text-gray-400 mb-1">
                        Longitude
                      </label>
                      <input
                        type="text"
                        id="longitude"
                        name="longitude"
                        value={formData.longitude}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border border-gray-600 bg-gray-700/50 text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                        placeholder="e.g., -74.0060"
                      />
                    </div>
                  </div>

                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={getCurrentLocation}
                      disabled={locationLoading}
                      className="inline-flex items-center px-4 py-2 border border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-300 bg-gray-700/50 hover:bg-gray-600/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-800 disabled:opacity-50 transition-colors"
                    >
                      {locationLoading ? (
                        <>
                          <div className="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-gray-500 border-t-blue-400 rounded-full"></div>
                          Getting location...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Use Current Location
                        </>
                      )}
                    </button>
                    {formData.latitude && formData.longitude && (
                      <span className="ml-3 text-sm text-green-400">
                        ✓ Location set
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-end space-x-4">
              <Link
                href="/dashboard"
                className="px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-700/50 hover:bg-gray-600/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-800 transition-colors"
              >
                Cancel
              </Link>
              <LoadingButton
                type="submit"
                isLoading={loading}
                loadingText="Submitting..."
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Submit Complaint
              </LoadingButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
