'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { CategoryService } from '@/services/category';

export default function ManageCategoriesPage() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: 'fas fa-tag',
    color: '#3B82F6'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const iconOptions = [
    { value: 'fas fa-tag', label: 'Tag', icon: 'fas fa-tag' },
    { value: 'fas fa-road', label: 'Road', icon: 'fas fa-road' },
    { value: 'fas fa-lightbulb', label: 'Light Bulb', icon: 'fas fa-lightbulb' },
    { value: 'fas fa-water', label: 'Water', icon: 'fas fa-water' },
    { value: 'fas fa-trash', label: 'Trash', icon: 'fas fa-trash' },
    { value: 'fas fa-building', label: 'Building', icon: 'fas fa-building' },
    { value: 'fas fa-tree', label: 'Tree', icon: 'fas fa-tree' },
    { value: 'fas fa-car', label: 'Car', icon: 'fas fa-car' },
    { value: 'fas fa-wifi', label: 'WiFi', icon: 'fas fa-wifi' },
    { value: 'fas fa-shield-alt', label: 'Security', icon: 'fas fa-shield-alt' },
    { value: 'fas fa-home', label: 'Home', icon: 'fas fa-home' },
    { value: 'fas fa-bus', label: 'Bus', icon: 'fas fa-bus' },
    { value: 'fas fa-heartbeat', label: 'Health', icon: 'fas fa-heartbeat' },
    { value: 'fas fa-graduation-cap', label: 'Education', icon: 'fas fa-graduation-cap' },
    { value: 'fas fa-balance-scale', label: 'Legal', icon: 'fas fa-balance-scale' }
  ];

  const colorOptions = [
    { value: '#3B82F6', label: 'Blue' },
    { value: '#10B981', label: 'Green' },
    { value: '#F59E0B', label: 'Yellow' },
    { value: '#EF4444', label: 'Red' },
    { value: '#8B5CF6', label: 'Purple' },
    { value: '#F97316', label: 'Orange' },
    { value: '#06B6D4', label: 'Cyan' },
    { value: '#84CC16', label: 'Lime' },
    { value: '#EC4899', label: 'Pink' },
    { value: '#6B7280', label: 'Gray' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear messages when user starts typing
    if (error) setError('');
    if (success) setSuccess('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Category name is required');
      return false;
    }
    if (formData.name.length < 2) {
      setError('Category name must be at least 2 characters long');
      return false;
    }
    if (formData.name.length > 50) {
      setError('Category name cannot exceed 50 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const categoryData = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        icon: formData.icon,
        color: formData.color
      };
      

      
      // Use the CategoryService to create via hosted API
      const result = await CategoryService.createCategory(categoryData);
      
      if (result.success) {
        setSuccess('Category created successfully!');
      } else {
        setError(result.message || 'Failed to create category');
        return;
      }
      setFormData({
        name: '',
        description: '',
        icon: 'fas fa-tag',
        color: '#3B82F6'
      });
      
      // Redirect after a brief delay
      setTimeout(() => {
        router.push('/admin/categories');
      }, 2000);
    } catch (error) {
      console.error('Error creating category:', error);
      setError('An error occurred while creating the category');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      icon: 'fas fa-tag',
      color: '#3B82F6'
    });
    setError('');
    setSuccess('');
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/admin/categories"
                className="text-blue-400 hover:text-blue-300 text-sm flex items-center mb-2"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Back to Categories
              </Link>
              <h1 className="text-3xl font-bold text-white">Add New Category</h1>
              <p className="text-gray-400 mt-2">Create a new category for organizing complaints</p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Success Message */}
                  {success && (
                    <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                      <div className="flex items-center">
                        <i className="fas fa-check-circle text-green-400 mr-3"></i>
                        <p className="text-green-300">{success}</p>
                      </div>
                    </div>
                  )}

                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                      <div className="flex items-center">
                        <i className="fas fa-exclamation-triangle text-red-400 mr-3"></i>
                        <p className="text-red-300">{error}</p>
                      </div>
                    </div>
                  )}

                  {/* Category Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                      Category Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Road Maintenance, Street Lighting, Waste Management"
                      required
                      maxLength={50}
                    />
                    <div className="mt-1 flex justify-between text-sm">
                      <p className="text-gray-400">
                        {formData.name && `Slug: ${generateSlug(formData.name)}`}
                      </p>
                      <p className="text-gray-400">
                        {formData.name.length}/50
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                      Description (Optional)
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Brief description of what types of complaints belong to this category..."
                      maxLength={200}
                    />
                    <p className="mt-1 text-sm text-gray-400 text-right">
                      {formData.description.length}/200
                    </p>
                  </div>

                  {/* Icon Selection */}
                  <div>
                    <label htmlFor="icon" className="block text-sm font-medium text-gray-300 mb-2">
                      Icon
                    </label>
                    <select
                      id="icon"
                      name="icon"
                      value={formData.icon}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {iconOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Color Selection */}
                  <div>
                    <label htmlFor="color" className="block text-sm font-medium text-gray-300 mb-2">
                      Color Theme
                    </label>
                    <div className="grid grid-cols-5 gap-3">
                      {colorOptions.map(option => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, color: option.value }))}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            formData.color === option.value
                              ? 'border-white scale-110'
                              : 'border-gray-600 hover:border-gray-500'
                          }`}
                          style={{ backgroundColor: option.value }}
                        >
                          <div className="w-6 h-6 rounded-full bg-white bg-opacity-20"></div>
                        </button>
                      ))}
                    </div>
                    <p className="mt-2 text-sm text-gray-400">
                      Selected: {colorOptions.find(c => c.value === formData.color)?.label}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-6 py-3 text-gray-400 hover:text-gray-300 transition-colors"
                      disabled={loading}
                    >
                      Reset Form
                    </button>
                    <button
                      type="submit"
                      disabled={loading || !formData.name.trim()}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors flex items-center"
                    >
                      {loading ? (
                        <>
                          <i className="fas fa-spinner fa-spin mr-2"></i>
                          Creating Category...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-plus mr-2"></i>
                          Create Category
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Preview */}
            <div className="space-y-6">
              {/* Preview Card */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Preview</h3>
                <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div 
                      className="p-3 rounded-full"
                      style={{ backgroundColor: `${formData.color}20` }}
                    >
                      <i 
                        className={`${formData.icon} text-xl`}
                        style={{ color: formData.color }}
                      ></i>
                    </div>
                    <div>
                      <h4 className="font-medium text-white">
                        {formData.name || 'Category Name'}
                      </h4>
                      <span 
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border"
                        style={{ 
                          backgroundColor: `${formData.color}20`,
                          color: formData.color,
                          borderColor: `${formData.color}40`
                        }}
                      >
                        {formData.name || 'Preview'}
                      </span>
                    </div>
                  </div>
                  {formData.description && (
                    <p className="text-sm text-gray-300">
                      {formData.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Tips */}
              <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-300 mb-3">
                  <i className="fas fa-lightbulb mr-2"></i>
                  Category Tips
                </h3>
                <div className="space-y-2 text-blue-200 text-sm">
                  <p>• <strong>Name:</strong> Keep it clear and descriptive</p>
                  <p>• <strong>Icon:</strong> Choose one that represents the category</p>
                  <p>• <strong>Color:</strong> Use distinct colors for easy identification</p>
                  <p>• <strong>Description:</strong> Help users understand what belongs here</p>
                </div>
              </div>

              {/* Common Categories */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Common Categories</h3>
                <div className="space-y-2 text-sm">
                  {[
                    'Road Maintenance',
                    'Street Lighting',
                    'Waste Management', 
                    'Water & Sewage',
                    'Public Safety',
                    'Parks & Recreation',
                    'Public Transport',
                    'Building Maintenance'
                  ].map(category => (
                    <div key={category} className="text-gray-300">
                      • {category}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
