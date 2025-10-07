'use client';

import { useState, useEffect } from 'react';
import { LoadingCard } from '@/components/Loading';
import AdminLayout from '@/components/AdminLayout';
import { CategoryService, Category } from '@/services/category';
import { useRoleAccess } from '@/hooks/useRoleAccess';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  // Use role-based access control
  const { canCreateCategory, canUpdateCategory, canDeleteCategory } = useRoleAccess();

  const loadCategories = async () => {
    setLoading(true);
    setError('');
    
    try {
      const result = await CategoryService.getAllCategories();
      
      if (result.success && result.data) {
        setCategories(result.data);
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

  useEffect(() => {
    loadCategories();
  }, []);

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    
    setActionLoading('add');
    try {
      const result = await CategoryService.createCategory({ 
        name: newCategoryName.trim() 
      });
      
      if (result.success) {
        setNewCategoryName('');
        setShowAddModal(false);
        await loadCategories();
      } else {
        setError(result.message || 'Failed to add category');
        setTimeout(() => setError(''), 5000); // Clear error after 5 seconds
      }
    } catch (error) {
      console.error('Error adding category:', error);
      setError('Failed to add category');
      setTimeout(() => setError(''), 5000); // Clear error after 5 seconds
    } finally {
      setActionLoading(null);
    }
  };

  const handleEditCategory = async () => {
    if (!editingCategory || !newCategoryName.trim()) return;
    
    setActionLoading(`edit-${editingCategory.id}`);
    try {
      const result = await CategoryService.updateCategory(editingCategory.id, { 
        name: newCategoryName.trim() 
      });
      
      if (result.success) {
        setEditingCategory(null);
        setNewCategoryName('');
        await loadCategories();
      } else {
        setError(result.message || 'Failed to update category');
        setTimeout(() => setError(''), 5000); // Clear error after 5 seconds
      }
    } catch (error) {
      console.error('Error updating category:', error);
      setError('Failed to update category');
      setTimeout(() => setError(''), 5000); // Clear error after 5 seconds
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteCategory = async (categoryId: string, categoryName: string) => {
    if (!confirm(`Are you sure you want to delete the category "${categoryName}"? This action cannot be undone.`)) {
      return;
    }
    
    setActionLoading(`delete-${categoryId}`);
    try {
      const result = await CategoryService.deleteCategory(categoryId);
      
      if (result.success) {
        await loadCategories();
      } else {
        setError(result.message || 'Failed to delete category');
        setTimeout(() => setError(''), 5000); // Clear error after 5 seconds
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      setError('Failed to delete category');
      setTimeout(() => setError(''), 5000); // Clear error after 5 seconds
    } finally {
      setActionLoading(null);
    }
  };

  const startEdit = (category: Category) => {
    setEditingCategory(category);
    setNewCategoryName(category.name);
  };

  const cancelEdit = () => {
    setEditingCategory(null);
    setNewCategoryName('');
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-8">
          <LoadingCard message="Loading categories..." />
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
                onClick={loadCategories}
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
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="space-y-4 sm:space-y-0 sm:flex sm:justify-between sm:items-center">
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Category Management</h1>
              <p className="text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">Manage complaint categories for better organization</p>
            </div>
            <div className="flex justify-center sm:justify-end">
              {canCreateCategory && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 sm:py-2 rounded-lg transition-colors flex items-center justify-center text-sm font-medium"
                >
                  <i className="fas fa-plus mr-2"></i>
                  <span>Add Category</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-500/20">
                <i className="fas fa-tags text-2xl text-green-400"></i>
              </div>
              <div className="ml-4">
                <p className="text-3xl font-bold text-white">{categories.length}</p>
                <p className="text-gray-400">Total Categories</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-500/20">
                <i className="fas fa-calendar-plus text-2xl text-blue-400"></i>
              </div>
              <div className="ml-4">
                <p className="text-3xl font-bold text-white">
                  {categories.filter(c => {
                    if (!c.createdOn) return false;
                    const createdDate = new Date(c.createdOn);
                    const now = new Date();
                    return createdDate.getMonth() === now.getMonth() && createdDate.getFullYear() === now.getFullYear();
                  }).length}
                </p>
                <p className="text-gray-400">Added This Month</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-500/20">
                <i className="fas fa-search text-2xl text-purple-400"></i>
              </div>
              <div className="ml-4">
                <p className="text-3xl font-bold text-white">{filteredCategories.length}</p>
                <p className="text-gray-400">Filtered Results</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg p-6 mb-6">
          <div className="max-w-md">
            <label htmlFor="search" className="block text-sm font-medium text-gray-300 mb-2">
              Search Categories
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fas fa-search text-gray-400"></i>
              </div>
              <input
                type="text"
                id="search"
                className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md leading-5 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search category names..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg">
          <div className="px-6 py-4 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-white">
              Categories ({filteredCategories.length})
            </h3>
          </div>
          <div className="p-6">
            {filteredCategories.length === 0 ? (
              <div className="text-center py-12">
                <i className="fas fa-tags text-4xl text-gray-500 mb-4"></i>
                <p className="text-gray-400 text-lg">
                  {searchTerm ? 'No categories match your search.' : 'No categories found.'}
                </p>
                {!searchTerm && (
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Add Your First Category
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredCategories.map((category) => (
                  <div key={category.id} className="bg-gray-700/50 border border-gray-600 rounded-lg p-6 hover:bg-gray-700/70 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        {editingCategory?.id === category.id ? (
                          <input
                            type="text"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoFocus
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleEditCategory();
                              } else if (e.key === 'Escape') {
                                cancelEdit();
                              }
                            }}
                          />
                        ) : (
                          <h4 className="text-lg font-semibold text-white">{category.name}</h4>
                        )}
                      </div>
                      <div className="p-2 rounded-full bg-blue-500/20 ml-3">
                        <i className="fas fa-tag text-blue-400"></i>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-400 mb-4">
                      Created: {category.createdOn ? new Date(category.createdOn).toLocaleDateString() : 'Unknown'}
                    </p>
                    
                    <div className="flex justify-end space-x-2">
                      {editingCategory?.id === category.id ? (
                        <>
                          <button
                            onClick={handleEditCategory}
                            disabled={actionLoading === `edit-${category.id}` || !newCategoryName.trim()}
                            className="text-green-400 hover:text-green-300 disabled:text-gray-500 transition-colors p-2"
                          >
                            {actionLoading === `edit-${category.id}` ? (
                              <i className="fas fa-spinner fa-spin"></i>
                            ) : (
                              <i className="fas fa-check"></i>
                            )}
                          </button>
                          <button
                            onClick={cancelEdit}
                            disabled={actionLoading === `edit-${category.id}`}
                            className="text-gray-400 hover:text-gray-300 disabled:text-gray-500 transition-colors p-2"
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </>
                      ) : (
                        <>
                          {canUpdateCategory && (
                            <button
                              onClick={() => startEdit(category)}
                              className="text-blue-400 hover:text-blue-300 transition-colors p-2"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                          )}
                          {canDeleteCategory && (
                            <button
                              onClick={() => handleDeleteCategory(category.id, category.name)}
                              disabled={actionLoading === `delete-${category.id}`}
                              className="text-red-400 hover:text-red-300 disabled:text-gray-500 transition-colors p-2"
                            >
                              {actionLoading === `delete-${category.id}` ? (
                                <i className="fas fa-spinner fa-spin"></i>
                              ) : (
                                <i className="fas fa-trash"></i>
                              )}
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-white">Add New Category</h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewCategoryName('');
                }}
                className="text-gray-400 hover:text-gray-300"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="mb-6">
              <label htmlFor="categoryName" className="block text-sm font-medium text-gray-300 mb-2">
                Category Name
              </label>
              <input
                type="text"
                id="categoryName"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter category name..."
                autoFocus
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && newCategoryName.trim()) {
                    handleAddCategory();
                  }
                }}
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewCategoryName('');
                }}
                className="px-4 py-2 text-gray-400 hover:text-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCategory}
                disabled={!newCategoryName.trim() || actionLoading === 'add'}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
              >
                {actionLoading === 'add' ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Adding...
                  </>
                ) : (
                  <>
                    <i className="fas fa-plus mr-2"></i>
                    Add Category
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
