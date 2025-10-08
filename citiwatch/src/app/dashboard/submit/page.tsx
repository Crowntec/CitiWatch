'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LoadingButton } from '@/components/Loading';
import Navigation from '@/components/Navigation';
import LocationMiniApp from '@/components/LocationMiniApp';
import { CategoryService, type Category } from '@/services/category';
import { ComplaintService } from '@/services/complaint';
import { ValidationHelper } from '@/utils/validation';
import { SecureTokenStorage } from '@/utils/secureStorage';

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

  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = () => {
      const token = SecureTokenStorage.getToken();
      if (!token) {
        console.log('No token found, redirecting to login');
        router.push('/login?redirect=/dashboard/submit');
        return false;
      }
      return true;
    };

    // Initial auth check
    if (!checkAuth()) return;

    // Load categories with a small delay to ensure token is ready
    setTimeout(() => {
      if (checkAuth()) {
        loadCategories();
      }
    }, 100);
  }, [router]);

  const loadCategories = async () => {
    try {
      const response = await CategoryService.getAllCategories();
      
      if (response.success) {
        setCategories(response.data || []);
        console.log('🔍 Loaded categories:', response.data);
        console.log('🔍 Category IDs and formats:');
        response.data?.forEach((cat, index) => {
          console.log(`  [${index}] ID: "${cat.id}" (type: ${typeof cat.id}, length: ${cat.id?.length})`);
          console.log(`  [${index}] Name: "${cat.name}"`);
          console.log(`  [${index}] Is valid GUID?: ${/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(cat.id)}`);
        });
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
      
      // Use validation helper for file validation
      const validation = ValidationHelper.validateFile(file);
      if (!validation.isValid) {
        setError(ValidationHelper.formatErrors(validation.errors));
        setSelectedFile(null);
        return;
      }
      
      setSelectedFile(file);
      setError('');
    }
  };



  const handleLocationMiniAppChange = (lat: string, lng: string) => {
    setFormData({
      ...formData,
      latitude: lat,
      longitude: lng,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Use comprehensive validation
    const validation = ValidationHelper.validateComplaint({
      title: formData.title,
      description: formData.description,
      categoryId: formData.categoryId,
      location: `${formData.latitude}, ${formData.longitude}`
    });

    // Check location separately (required for complaints)
    if (!formData.latitude || !formData.longitude) {
      validation.errors.push('Location is required');
      validation.isValid = false;
    }

    if (!validation.isValid) {
      setError(ValidationHelper.formatErrors(validation.errors));
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

      console.log('🔍 Submitting complaint data:', complaintData);
      console.log('🔍 Available categories:', categories);
      console.log('🔍 Selected category ID:', formData.categoryId);
      console.log('🔍 Selected category ID type:', typeof formData.categoryId);
      console.log('🔍 Selected category ID length:', formData.categoryId.length);
      console.log('🔍 Is valid GUID format?:', /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(formData.categoryId));

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

            <LocationMiniApp
              latitude={formData.latitude}
              longitude={formData.longitude}
              onLocationChange={handleLocationMiniAppChange}
              loading={loading}
            />

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
