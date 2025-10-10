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
  const [showCamera, setShowCamera] = useState(false);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const token = SecureTokenStorage.getToken();
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

  const startCamera = async () => {
    console.log('Starting camera...');
    
    // Check if camera is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error('Camera not supported by browser');
      setCameraError('Camera not supported by this browser. Please use a modern browser like Chrome, Firefox, or Safari.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      setVideoStream(stream);
      setShowCamera(true);
      setCameraError(null);
    } catch (error: unknown) {
      console.error('Camera error:', error);
      let errorMessage = 'Unable to access camera: ';
      
      if (error instanceof DOMException) {
        switch (error.name) {
          case 'NotAllowedError':
            errorMessage += 'Permission denied. Please allow camera access in your browser settings and try again.';
            break;
          case 'NotFoundError':
            errorMessage += 'No camera found on this device.';
            break;
          case 'NotSupportedError':
            errorMessage += 'Camera not supported by browser.';
            break;
          case 'NotReadableError':
            errorMessage += 'Camera is being used by another application.';
            break;
          default:
            errorMessage += error.message || 'Unknown error occurred';
        }
      } else if (error instanceof Error) {
        errorMessage += error.message;
      } else {
        errorMessage += 'Unknown error occurred';
      }
      
      setCameraError(errorMessage);
    }
  };  const stopCamera = () => {
    if (videoStream) {
      videoStream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
      setVideoStream(null);
    }
    setShowCamera(false);
    setCameraError(null);
  };

  const capturePhoto = () => {
    if (!videoStream) return;

    const video = document.getElementById('camera-video') as HTMLVideoElement;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!video || !context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' });
        
        // Validate the captured file
        const validation = ValidationHelper.validateFile(file);
        if (!validation.isValid) {
          setError(ValidationHelper.formatErrors(validation.errors));
          return;
        }
        
        setSelectedFile(file);
        stopCamera();
        setError('');
      }
    }, 'image/jpeg', 0.8);
  };

  // Cleanup camera stream on component unmount
  useEffect(() => {
    return () => {
      if (videoStream) {
        videoStream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
      }
    };
  }, [videoStream]);



  const handleLocationMiniAppChange = (lat: string, lng: string) => {
    setFormData({
      ...formData,
      latitude: lat,
      longitude: lng,
    });
  };

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validate form data
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
              
              {!showCamera && !selectedFile && (
                <div className="space-y-4">
                  {/* Upload Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Camera Button */}
                    <button
                      type="button"
                      onClick={startCamera}
                      className="flex flex-col items-center justify-center p-6 border-2 border-blue-600 border-dashed rounded-md hover:border-blue-500 bg-blue-900/20 hover:bg-blue-900/30 transition-colors"
                    >
                      <svg className="w-8 h-8 text-blue-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-sm font-medium text-blue-300">Take Photo</span>
                      <span className="text-xs text-blue-400">Use camera (requires permission)</span>
                    </button>

                    {/* File Upload */}
                    <div className="flex flex-col items-center justify-center p-6 border-2 border-gray-600 border-dashed rounded-md hover:border-gray-500 bg-gray-800/30 hover:bg-gray-800/40 transition-colors">
                      <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer text-sm font-medium text-gray-300 hover:text-white"
                      >
                        Upload File
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          accept="image/jpeg,image/jpg,image/png,image/gif"
                          onChange={handleFileChange}
                        />
                      </label>
                      <span className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</span>
                    </div>
                  </div>

                  {/* Camera Error Display */}
                  {cameraError && (
                    <div className="bg-red-900/30 border border-red-700 rounded-md p-3">
                      <div className="flex">
                        <svg className="w-5 h-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm text-red-300">{cameraError}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Camera Interface */}
              {showCamera && (
                <div className="space-y-4">
                  <div className="relative bg-black rounded-lg overflow-hidden">
                    <video
                      id="camera-video"
                      ref={(video) => {
                        if (video && videoStream) {
                          video.srcObject = videoStream;
                          video.play();
                        }
                      }}
                      className="w-full h-64 object-cover"
                      autoPlay
                      muted
                      playsInline
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-48 h-48 border-2 border-white/50 rounded-lg"></div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center space-x-4">
                    <button
                      type="button"
                      onClick={capturePhoto}
                      className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Capture
                    </button>
                    <button
                      type="button"
                      onClick={stopCamera}
                      className="flex items-center px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Selected File Preview */}
              {selectedFile && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-900/20 border border-green-700 rounded-lg">
                    <div className="flex items-center">
                      <svg className="w-6 h-6 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-green-300">Photo selected</p>
                        <p className="text-xs text-green-400">{selectedFile.name}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedFile(null)}
                      className="text-green-400 hover:text-green-300 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
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
