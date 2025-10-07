'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { CategoryService, type Category } from '@/services/category';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    loadCategories();
  }, [router]);

  const loadCategories = async () => {
    try {
      const result = await CategoryService.getAllCategories();
      
      if (result.success && result.data) {
        setCategories(result.data);
        setError('');
      } else {
        setError(result.message || 'Failed to load categories');
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      setError('Category name is required');
      return;
    }

    try {
      const result = await CategoryService.createCategory({ name: newCategoryName.trim() });
      
      if (result.success) {
        setSuccess('Category added successfully');
        setNewCategoryName('');
        setShowAddForm(false);
        setError('');
        loadCategories();
      } else {
        setError(result.message || 'Failed to add category');
      }
    } catch (error) {
      console.error('Error adding category:', error);
      setError('Network error. Please try again.');
    }
  };

  const handleEditCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editingCategory.name.trim()) {
      setError('Category name is required');
      return;
    }

    try {
      const result = await CategoryService.updateCategory(
        editingCategory.id, 
        { name: editingCategory.name.trim() }
      );
      
      if (result.success) {
        setSuccess('Category updated successfully');
        setEditingCategory(null);
        setError('');
        loadCategories();
      } else {
        setError(result.message || 'Failed to update category');
      }
    } catch (error) {
      console.error('Error updating category:', error);
      setError('Network error. Please try again.');
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category?')) {
      return;
    }

    try {
      const result = await CategoryService.deleteCategory(categoryId);
      
      if (result.success) {
        setSuccess('Category deleted successfully');
        setError('');
        loadCategories();
      } else {
        setError(result.message || 'Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      setError('Network error. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Navigation */}
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Manage Categories</h1>
          <p className="text-gray-400 mt-2">Add, edit, and delete complaint categories</p>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-4 bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-md">
            {error}
            <button onClick={() => setError('')} className="float-right text-red-400 hover:text-red-300">
              ×
            </button>
          </div>
        )}

        {success && (
          <div className="mb-4 bg-green-900/50 border border-green-700 text-green-300 px-4 py-3 rounded-md">
            {success}
            <button onClick={() => setSuccess('')} className="float-right text-green-400 hover:text-green-300">
              ×
            </button>
          </div>
        )}

        {/* Add Category Form */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg mb-6">
          <div className="px-6 py-4 border-b border-gray-700">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              {showAddForm ? 'Cancel' : 'Add New Category'}
            </button>
          </div>

          {showAddForm && (
            <div className="p-6">
              <form onSubmit={handleAddCategory} className="flex gap-4 items-center">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Enter category name"
                  className="flex-1 px-3 py-2 border border-gray-600 bg-gray-700/50 text-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                  required
                  minLength={2}
                  maxLength={100}
                />
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
                >
                  Add Category
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Categories List */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-lg font-medium text-white">All Categories</h2>
          </div>

          {loading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto"></div>
              <p className="mt-2 text-gray-400">Loading categories...</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="p-6 text-center">
              <span className="text-4xl mb-4 block">📂</span>
              <p className="text-gray-400 mb-4">No categories found</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Add First Category
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-700">
              {categories.map((category) => (
                <div key={category.id} className="p-6">
                  {editingCategory?.id === category.id ? (
                    <form onSubmit={handleEditCategory} className="flex gap-4 items-center">
                      <input
                        type="text"
                        value={editingCategory.name}
                        onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})}
                        className="flex-1 px-3 py-2 border border-gray-600 bg-gray-700/50 text-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                        minLength={2}
                        maxLength={100}
                      />
                      <button
                        type="submit"
                        className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingCategory(null)}
                        className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors"
                      >
                        Cancel
                      </button>
                    </form>
                  ) : (
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-medium text-white">{category.name}</h3>
                        <p className="text-sm text-gray-400">
                          Created: {category.createdOn ? new Date(category.createdOn).toLocaleDateString() : 'Unknown'}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingCategory(category)}
                          className="text-blue-400 hover:text-blue-300 px-3 py-1 border border-blue-600 rounded text-sm transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          className="text-red-400 hover:text-red-300 px-3 py-1 border border-red-600 rounded text-sm transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
