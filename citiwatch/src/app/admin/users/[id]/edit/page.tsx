'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';
import { LoadingCard } from '@/components/Loading';

interface User {
  id: string;
  fullName: string;
  email: string;
  role: number;
  phone?: string;
  address?: string;
  createdAt: string;
}

// Mock users data
const mockUsers: User[] = [
  {
    id: '1',
    fullName: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, City, State 12345',
    role: 0, // User
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    fullName: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 987-6543',
    address: '456 Oak Ave, City, State 12345',
    role: 0, // User
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    fullName: 'Mike Davis',
    email: 'mike.davis@email.com',
    phone: '+1 (555) 246-8135',
    address: '789 Pine St, City, State 12345',
    role: 0, // User
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '4',
    fullName: 'Lisa Chen',
    email: 'lisa.chen@email.com',
    phone: '+1 (555) 369-2580',
    address: '321 Elm St, City, State 12345',
    role: 1, // Admin
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '5',
    fullName: 'Robert Wilson',
    email: 'robert.wilson@email.com',
    phone: '+1 (555) 147-2589',
    address: '654 Maple Ave, City, State 12345',
    role: 0, // User
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export default function EditUserPage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    role: 0
  });

  useEffect(() => {
    const userId = params.id as string;
    // Simulate API call
    setTimeout(() => {
      const foundUser = mockUsers.find(u => u.id === userId);
      if (foundUser) {
        setUser(foundUser);
        setFormData({
          fullName: foundUser.fullName,
          email: foundUser.email,
          phone: foundUser.phone || '',
          address: foundUser.address || '',
          role: foundUser.role
        });
      }
      setLoading(false);
    }, 500);
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    // Simulate API call
    setTimeout(() => {
      console.log('Saving user:', { ...formData, id: user?.id });
      setSaving(false);
      router.push(`/admin/users/${user?.id}`);
    }, 1000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'role' ? parseInt(value) : value
    }));
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <LoadingCard />
        </div>
      </AdminLayout>
    );
  }

  if (!user) {
    return (
      <AdminLayout>
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <div className="text-6xl text-gray-600 mb-4">
            <i className="fas fa-user-slash"></i>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">User Not Found</h2>
          <p className="text-gray-400 mb-6">
            The user you are trying to edit does not exist or has been deleted.
          </p>
          <Link
            href="/admin/users"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors inline-flex items-center"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Back to Users
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <Link
              href={`/admin/users/${user.id}`}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <i className="fas fa-arrow-left text-xl"></i>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">Edit User</h1>
              <p className="text-gray-400">Update user information and permissions</p>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <i className="fas fa-user-edit mr-3 text-blue-400"></i>
              User Information
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-400 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-400 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-400 mb-2">
                    User Role *
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                  >
                    <option value={0}>User</option>
                    <option value={1}>Admin</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-400 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="Enter address"
                  />
                </div>

                {/* Account Info */}
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-300 mb-2">Account Information</h3>
                  <div className="space-y-2 text-sm text-gray-400">
                    <p><span className="font-medium">User ID:</span> {user.id}</p>
                    <p><span className="font-medium">Created:</span> {new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 mt-8 pt-6 border-t border-gray-700">
              <Link
                href={`/admin/users/${user.id}`}
                className="px-6 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors text-center"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {saving ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save mr-2"></i>
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
