'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { LoadingButton } from '@/components/Loading';
import { useAuth } from '@/auth/AuthContext';
import { ValidationHelper } from '@/utils/validation';

function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      // Check if there's a redirect parameter
      const redirectTo = searchParams.get('redirect');
      if (redirectTo) {
        router.push(redirectTo);
      } else if (isAdmin) {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, isAdmin, router, searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Use comprehensive validation
    const validation = ValidationHelper.validateLogin({
      email: formData.email,
      password: formData.password
    });

    if (!validation.isValid) {
      setError(ValidationHelper.formatErrors(validation.errors));
      return;
    }

    try {
      const redirectTo = searchParams.get('redirect');
      const result = await login(formData.email, formData.password, redirectTo || undefined);
      
      if (result.success) {
        // Backup navigation in case AuthContext redirect doesn't work
        const targetUrl = redirectTo || (isAdmin ? '/admin' : '/dashboard');
        
        // Small delay to ensure state is updated, then force navigation
        setTimeout(() => {
          window.location.href = targetUrl;
        }, 100);
      } else {
        setError(result.message);
      }
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
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 pt-24" style={{ minHeight: 'calc(100vh - 80px)' }}>
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600/20 rounded-full border-2 border-blue-500/30 mb-4">
              <i className="fas fa-sign-in-alt text-2xl text-blue-400"></i>
            </div>
          </div>
          <h2 className="text-center text-3xl font-extrabold text-white">
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
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-600 bg-gray-700/50 placeholder-gray-400 text-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 mt-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <i 
                    className={`fas transition-all duration-300 ease-in-out text-gray-400 hover:text-blue-400 ${
                      showPassword 
                        ? 'fa-eye-slash transform scale-110' 
                        : 'fa-eye transform scale-100'
                    }`}
                    style={{
                      transform: showPassword ? 'scale(1.1) rotateY(180deg)' : 'scale(1) rotateY(0deg)',
                      transition: 'all 0.3s ease-in-out'
                    }}
                  ></i>
                </button>
              </div>
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
            {/* Demo Credentials Section */}
        <div className="bg-blue-900/20 backdrop-blur-sm py-4 px-6 rounded-lg border border-blue-700/50 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-blue-300">
              <i className="fas fa-info-circle mr-2"></i>
              Demo Credentials
            </h3>
          </div>
          
          {/* Attention-Grabbing Banner */}
          <div className="mb-4 p-3 bg-gradient-to-r from-yellow-600/30 to-orange-600/30 border-2 border-yellow-400/50 rounded-lg animate-pulse">
            <div className="flex items-center justify-center space-x-2 text-yellow-200 text-sm">
              <i className="fas fa-rocket animate-bounce text-yellow-400"></i>
              <span className="font-bold text-center">🔥 COMPLETE PROJECT DOCUMENTATION & SOURCE CODE ON GITHUB!</span>
              <i className="fas fa-rocket animate-bounce text-yellow-400"></i>
            </div>
            <div className="text-center text-xs text-yellow-300 mt-1 font-medium">
              💎 Explore features, architecture, API docs & more!
            </div>
            <div className="flex justify-center mt-3">
              <a 
                href="https://github.com/Crowntec/CitiWatch" 
                target="_blank" 
                rel="noopener noreferrer"
                className="github-attention group relative inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 hover:from-blue-500 hover:via-purple-500 hover:to-blue-500 text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-2xl border border-blue-400"
                title="🚀 Explore Complete Project Documentation, Features & Source Code!"
              >
                <i className="fab fa-github text-xl animate-pulse group-hover:animate-bounce"></i>
                <span className="hidden sm:inline font-bold text-sm">CHECK FULL DOCUMENTATION</span>
                <span className="sm:hidden font-bold text-sm">GitHub</span>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"></div>
              </a>
            </div>
          </div>
          
          <p className="text-blue-200 text-sm mb-4">
            Use these credentials to explore the platform&apos;s features:
          </p>
          <div className="space-y-3">
            <div className="bg-gray-800/50 p-3 rounded-md border border-gray-600">
              <h4 className="text-sm font-medium text-green-400 mb-2">
                <i className="fas fa-user-shield mr-2"></i>
                Admin Access
              </h4>
              <div className="text-xs text-gray-300 space-y-1">
                <div>
                  <span className="text-gray-400">Email:</span>{' '}
                  <span className="font-mono text-blue-300">admin123@citiwatch.com</span>
                </div>
                <div>
                  <span className="text-gray-400">Password:</span>{' '}
                  <span className="font-mono text-blue-300">Admin123!Pass</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-800/50 p-3 rounded-md border border-gray-600">
              <h4 className="text-sm font-medium text-yellow-400 mb-2">
                <i className="fas fa-user mr-2"></i>
                Regular User Access
              </h4>
              <div className="text-xs text-gray-300 space-y-1">
                <div>
                  <span className="text-gray-400">Email:</span>{' '}
                  <span className="font-mono text-blue-300">user@citiwatch.com</span>
                </div>
                <div>
                  <span className="text-gray-400">Password:</span>{' '}
                  <span className="font-mono text-blue-300">User123</span>
                </div>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-400 text-center mt-3">
            Use these credentials to explore the platform&apos;s features
          </p>
        </div>

          </form>
        </div>
      </div>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
