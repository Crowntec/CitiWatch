'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { UserService } from '@/services/user';
import { ValidationHelper } from '@/utils/validation';

export default function ManageUsersPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'role' ? parseInt(value) : value
    }));
    // Clear errors when user starts typing
    if (error) setError('');
    if (success) setSuccess('');
  };

  const validateForm = () => {
    const validation = ValidationHelper.validateUserRegistration({
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword
    });

    if (!validation.isValid) {
      setError(ValidationHelper.formatErrors(validation.errors));
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
      const userData = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: formData.role
      };
      
      // Create user via API
      const result = formData.role === 1 
        ? await UserService.createAdminUser(userData)
        : await UserService.createUser(userData);
      
      if (result.success) {
        setSuccess(result.message || 'User created successfully!');
        setFormData({
          fullName: '',
          email: '',
          password: '',
          confirmPassword: '',
          role: 0
        });
        
        // Redirect after a brief delay
        setTimeout(() => {
          router.push('/admin/users');
        }, 2000);
      } else {
        setError(result.message || 'Failed to create user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      setError('An error occurred while creating the user');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 0
    });
    setError('');
    setSuccess('');
  };

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/admin/users"
                className="text-blue-400 hover:text-blue-300 text-sm flex items-center mb-2"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Back to Users
              </Link>
              <h1 className="text-3xl font-bold text-white">Add New User</h1>
              <p className="text-gray-400 mt-2">Create a new user account for the CitiWatch platform</p>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Form Card */}
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

              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter full name"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter email address"
                  required
                />
              </div>

              {/* Role */}
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-2">
                  User Role *
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value={0}>Regular User</option>
                  <option value={1}>Administrator</option>
                </select>
                <p className="mt-1 text-sm text-gray-400">
                  {formData.role === 1 
                    ? 'Administrators have full access to admin panel and can manage all aspects of the platform'
                    : 'Regular users can submit and track their own complaints'
                  }
                </p>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter password (minimum 6 characters)"
                  required
                  minLength={6}
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Confirm password"
                  required
                />
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
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors flex items-center"
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Creating User...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-user-plus mr-2"></i>
                      Create User
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Help Section */}
          <div className="mt-8 bg-blue-900/20 border border-blue-700/30 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-300 mb-3">
              <i className="fas fa-info-circle mr-2"></i>
              User Account Guidelines
            </h3>
            <div className="space-y-2 text-blue-200 text-sm">
              <p>• <strong>Email Address:</strong> Must be unique and will be used for login</p>
              <p>• <strong>Password:</strong> Minimum 6 characters, recommend using strong passwords</p>
              <p>• <strong>Administrator Role:</strong> Grants access to admin panel and all management features</p>
              <p>• <strong>Regular User:</strong> Can submit complaints and track their status</p>
              <p>• <strong>Account Activation:</strong> New users can log in immediately after creation</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
