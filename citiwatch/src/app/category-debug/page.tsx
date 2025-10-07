'use client';

import { useState, useEffect } from 'react';
import { CategoryService, Category } from '@/services/category';

export default function CategoryDebugPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');

  const loadCategories = async () => {
    setLoading(true);
    setResult('Loading categories...');
    
    try {
      const response = await CategoryService.getAllCategories();
      
      if (response.success) {
        setCategories(response.data || []);
        setResult(`
✅ SUCCESS! Loaded ${response.data?.length || 0} categories:
${JSON.stringify(response.data, null, 2)}
        `);
      } else {
        setResult(`
❌ FAILED to load categories:
Message: ${response.message}
        `);
      }
    } catch (error) {
      setResult(`
❌ ERROR loading categories:
${error instanceof Error ? error.message : 'Unknown error'}
      `);
    } finally {
      setLoading(false);
    }
  };

  const createTestCategory = async () => {
    setLoading(true);
    setResult('Creating test category...');
    
    try {
      const response = await CategoryService.createCategory({
        name: 'Road Issues'
      });
      
      if (response.success) {
        setResult('✅ Test category created successfully!');
        loadCategories(); // Reload categories
      } else {
        setResult(`❌ Failed to create category: ${response.message}`);
      }
    } catch (error) {
      setResult(`❌ Error creating category: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-2xl font-bold mb-6">Category Debug Page</h1>
      
      <div className="mb-6 space-x-4">
        <button
          onClick={loadCategories}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Reload Categories'}
        </button>
        
        <button
          onClick={createTestCategory}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Test Category'}
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Categories ({categories.length})</h2>
          {categories.length > 0 ? (
            <ul className="space-y-2">
              {categories.map((category, index) => (
                <li key={index} className="bg-gray-700 p-2 rounded">
                  <div><strong>ID:</strong> {category.id}</div>
                  <div><strong>Name:</strong> {category.name}</div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No categories found</p>
          )}
        </div>
        
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Debug Results</h2>
          <pre className="text-sm whitespace-pre-wrap overflow-auto">
            {result || 'Click "Reload Categories" to test'}
          </pre>
        </div>
      </div>
    </div>
  );
}