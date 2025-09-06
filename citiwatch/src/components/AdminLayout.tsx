'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser, isUserAdmin } from '@/utils/api';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<{ fullName: string; email: string } | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if user is authenticated and is admin
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const currentUser = getCurrentUser();
    if (!currentUser || !isUserAdmin()) {
      router.push('/dashboard');
      return;
    }

    setUser(currentUser);
  }, [router]);

  const navigation = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: 'fas fa-chart-line',
      current: pathname === '/admin'
    },
    {
      name: 'Users',
      icon: 'fas fa-users',
      current: pathname.startsWith('/admin/users'),
      children: [
        { name: 'User List', href: '/admin/users', icon: 'fas fa-list' },
        { name: 'Manage Users', href: '/admin/users/manage', icon: 'fas fa-user-cog' }
      ]
    },
    {
      name: 'Complaints',
      icon: 'fas fa-exclamation-circle',
      current: pathname.startsWith('/admin/complaints'),
      children: [
        { name: 'All Complaints', href: '/admin/complaints', icon: 'fas fa-list' },
        { name: 'Pending Review', href: '/admin/complaints/pending', icon: 'fas fa-clock' },
        { name: 'In Progress', href: '/admin/complaints/progress', icon: 'fas fa-spinner' },
        { name: 'Resolved', href: '/admin/complaints/resolved', icon: 'fas fa-check-circle' }
      ]
    },
    {
      name: 'Categories',
      icon: 'fas fa-tags',
      current: pathname.startsWith('/admin/categories'),
      children: [
        { name: 'Category List', href: '/admin/categories', icon: 'fas fa-list' },
        { name: 'Manage Categories', href: '/admin/categories/manage', icon: 'fas fa-cog' }
      ]
    },
    {
      name: 'Status Management',
      href: '/admin/status',
      icon: 'fas fa-traffic-light',
      current: pathname.startsWith('/admin/status')
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? '' : 'pointer-events-none'}`}>
        <div 
          className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity ease-linear duration-300 ${
            sidebarOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setSidebarOpen(false)}
        />
        
        <div className={`relative flex-1 flex flex-col max-w-xs w-full bg-gray-800 transform transition ease-in-out duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <i className="fas fa-times h-6 w-6 text-white" />
            </button>
          </div>
          
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <img className="h-8 w-auto" src="/logo.png" alt="CitiWatch" />
              <span className="ml-2 text-xl font-bold text-white">Admin</span>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navigation.map((item) => (
                <div key={item.name}>
                  {item.children ? (
                    <div>
                      <div className="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                        <i className={`${item.icon} text-gray-400 mr-3 flex-shrink-0 h-6 w-6`} />
                        {item.name}
                      </div>
                      <div className="ml-8 space-y-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            className={`${
                              pathname === child.href
                                ? 'bg-gray-900 text-white'
                                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                            } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                            onClick={() => setSidebarOpen(false)}
                          >
                            <i className={`${child.icon} text-gray-400 mr-3 flex-shrink-0 h-4 w-4`} />
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className={`${
                        item.current
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <i className={`${item.icon} text-gray-400 mr-3 flex-shrink-0 h-6 w-6`} />
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-gray-800 border-r border-gray-700">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <img className="h-8 w-auto" src="/logo.png" alt="CitiWatch" />
              <span className="ml-2 text-xl font-bold text-white">Admin Panel</span>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => (
                <div key={item.name}>
                  {item.children ? (
                    <div>
                      <div className={`${
                        item.current ? 'bg-gray-900' : ''
                      } text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md cursor-pointer`}>
                        <i className={`${item.icon} text-gray-400 mr-3 flex-shrink-0 h-6 w-6`} />
                        {item.name}
                      </div>
                      <div className="ml-8 space-y-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            className={`${
                              pathname === child.href
                                ? 'bg-gray-900 text-white'
                                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                            } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                          >
                            <i className={`${child.icon} text-gray-400 mr-3 flex-shrink-0 h-4 w-4`} />
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className={`${
                        item.current
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                    >
                      <i className={`${item.icon} text-gray-400 mr-3 flex-shrink-0 h-6 w-6`} />
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>
      </div>

      <div className="md:pl-64 flex flex-col flex-1">
        {/* Top navigation */}
        <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-800 border-b border-gray-700">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            onClick={() => setSidebarOpen(true)}
          >
            <i className="fas fa-bars h-6 w-6" />
          </button>
        </div>

        {/* Top bar */}
        <div className="bg-gray-800/90 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              {/* Breadcrumbs */}
              <div className="flex items-center space-x-2 text-sm">
                <Link href="/admin" className="text-gray-400 hover:text-white">
                  Dashboard
                </Link>
                {pathname !== '/admin' && (
                  <>
                    <i className="fas fa-chevron-right text-gray-500 text-xs" />
                    <span className="text-white capitalize">
                      {pathname.split('/').filter(Boolean).slice(1).join(' / ')}
                    </span>
                  </>
                )}
              </div>

              {/* User menu */}
              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <button className="text-gray-400 hover:text-white relative">
                  <i className="fas fa-bell h-6 w-6" />
                  <span className="absolute -top-1 -right-1 block h-2 w-2 rounded-full bg-red-400"></span>
                </button>

                {/* Profile dropdown */}
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">{user?.fullName}</p>
                    <p className="text-xs text-gray-400">Administrator</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link
                      href="/dashboard"
                      className="text-gray-400 hover:text-white p-2"
                      title="Back to User Dashboard"
                    >
                      <i className="fas fa-home" />
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="text-gray-400 hover:text-red-400 p-2"
                      title="Logout"
                    >
                      <i className="fas fa-sign-out-alt" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
