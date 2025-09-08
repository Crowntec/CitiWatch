'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { LoadingButton } from '@/components/Loading';
import { useAuth } from '@/auth/AuthContext';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const { login, isLoading, isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      if (isAdmin) {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, isAdmin, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Simple validation
    const validationErrors = [];
    if (!formData.email.trim()) validationErrors.push('Email is required');
    if (!/\S+@\S+\.\S+/.test(formData.email)) validationErrors.push('Please enter a valid email');
    if (!formData.password) validationErrors.push('Password is required');

    if (validationErrors.length > 0) {
      setError(validationErrors.join(', '));
      return;
    }

    try {
      await login(formData.email, formData.password);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Login failed. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <Navigation />
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" style={{ minHeight: 'calc(100vh - 80px)' }}>
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="text-center">
            <Link href="/" className="text-3xl font-bold text-blue-400">
              <i className="fas fa-sign-in-alt mr-4 w-5"></i>
            </Link>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Or{' '}
            <Link
              href="/register"
              className="font-medium text-blue-400 hover:text-blue-300"
            >
              create a new account
            </Link>
          </p>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-sm py-8 px-6 shadow-xl rounded-lg border border-gray-700">
          {/* Development Login Info */}
          <div className="bg-blue-900/30 border border-blue-600 text-blue-200 px-4 py-3 rounded-md mb-6">
            <p className="text-sm">
              <strong>Development Mode:</strong> Use these credentials to access the dashboard:
            </p>
            <p className="text-sm mt-1">
              Email: <code className="bg-blue-800/50 px-1 rounded">demo@citiwatch.com</code>
            </p>
            <p className="text-sm">
              Password: <code className="bg-blue-800/50 px-1 rounded">password123</code>
            </p>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-md">
                {error}
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-600 bg-gray-700/50 placeholder-gray-400 text-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-600 bg-gray-700/50 placeholder-gray-400 text-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Enter your password"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 bg-gray-700 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-blue-400 hover:text-blue-300">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <LoadingButton
                type="submit"
                isLoading={isLoading}
                loadingText="Signing in..."
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Sign in
              </LoadingButton>
            </div>

            {/* Demo Credentials */}
            <div className="mt-6 bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h3 className="text-sm font-medium text-gray-300 mb-2">Demo Credentials:</h3>
              <div className="space-y-2 text-xs text-gray-400">
                <div>
                  <span className="text-blue-400">Admin:</span> admin@citiwatch.com / admin123
                </div>
                <div>
                  <span className="text-green-400">User:</span> user@citiwatch.com / user123
                </div>
                <div>
                  <span className="text-yellow-400">Demo:</span> demo@citiwatch.com / password123
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      </div>
    </div>
  );
}
