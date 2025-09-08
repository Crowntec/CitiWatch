'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/auth/AuthContext';
import { ProtectedRoute } from '@/auth/ProtectedRoute';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  const navigation = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: 'ri-dashboard-line',
      current: pathname === '/admin'
    },
    {
      name: 'Complaints',
      href: '/admin/complaints',
      icon: 'ri-feedback-line',
      current: pathname.startsWith('/admin/complaints'),
    },
    {
      name: 'Categories',
      href: '/admin/categories',
      icon: 'ri-price-tag-3-line',
      current: pathname.startsWith('/admin/categories')
    },
    {
      name: 'Users',
      href: '/admin/users',
      icon: 'ri-user-settings-line',
      current: pathname.startsWith('/admin/users'),
    },
    {
      name: 'Status',
      href: '/admin/status',
      icon: 'ri-settings-line',
      current: pathname.startsWith('/admin/status')
    }
  ];

  const handleLogout = () => {
    logout();
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute requireAdmin>
      <div className={`min-h-screen bg-gray-900 ${darkMode ? 'dark' : ''}`}>
        <style jsx global>{`
          .sidebar-expanded { width: 250px; transition: width 0.3s ease; }
          .sidebar-collapsed { width: 80px !important; transition: width 0.3s ease; }
          .sidebar-collapsed .sidebar-text { display: none !important; }
          .sidebar-collapsed .flex.items-center.justify-between { justify-content: center !important; }
          .sidebar-collapsed .flex.items-center.px-4.py-3,
          .sidebar-collapsed .flex.items-center { justify-content: center !important; }
          .sidebar-collapsed ul > li > a { justify-content: center !important; padding-left: 1rem !important; padding-right: 1rem !important; }
          .sidebar-collapsed .border-t { padding-left: 0.5rem !important; padding-right: 0.5rem !important; }
          .sidebar-collapsed .custom-switch { margin-left: 0 !important; }
          .main-expanded { margin-left: 250px !important; transition: margin-left 0.3s ease; }
          .main-collapsed { margin-left: 80px !important; transition: margin-left 0.3s ease; }
          @media (max-width: 768px) {
            .sidebar-expanded, .sidebar-collapsed { width: 0 !important; position: fixed; z-index: 40; left: 0; transform: translateX(-100%); }
            .sidebar-mobile-open { transform: translateX(0) !important; width: 250px !important; }
            .sidebar-mobile-closed { transform: translateX(-100%) !important; }
            .main-expanded, .main-collapsed { margin-left: 0 !important; }
          }
          .custom-switch { position: relative; display: inline-block; width: 50px; height: 24px; margin-left: auto; }
          .custom-switch-input { opacity: 0; width: 0; height: 0; }
          .custom-switch-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #374151; transition: .4s; border-radius: 34px; }
          .custom-switch-input:checked + .custom-switch-slider { background-color: #3b82f6; }
          .custom-switch-slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; }
          .custom-switch-input:checked + .custom-switch-slider:before { transform: translateX(26px); }
        `}</style>

        {/* Mobile backdrop */}
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={closeMobileMenu}
          />
        )}

        {/* Sidebar */}
        <aside 
          className={`
            fixed top-0 left-0 h-full bg-gray-900/95 backdrop-blur-sm border-r border-gray-700 shadow-2xl z-40 overflow-y-auto transition-all duration-300
            ${sidebarCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}
            ${mobileMenuOpen ? 'sidebar-mobile-open' : 'sidebar-mobile-closed md:left-0'}
          `}
          aria-label="Sidebar" 
          tabIndex={-1}
        >
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <Link href="/admin" className="flex items-center space-x-3">
                  <div className="rounded-lg flex items-center justify-center">
                    <Image 
                      src="/primarylogo.png" 
                      alt="CitiWatch Logo" 
                      width={32} 
                      height={32}
                      className="rounded-lg"
                    />
                  </div>
                  <span className="text-xl font-bold text-white sidebar-text">CitiWatch</span>
                </Link>
                <button
                  onClick={toggleSidebar}
                  className="hidden md:block text-gray-400 hover:text-white p-1"
                >
                  <i className={`ri-${sidebarCollapsed ? 'menu-unfold' : 'menu-fold'}-line`}></i>
                </button>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4">
              <ul className="space-y-2">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`
                        flex items-center px-4 py-3 rounded-lg transition-colors group
                        ${item.current 
                          ? 'bg-blue-600 text-white shadow-lg' 
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                        }
                      `}
                    >
                      <span className="w-8 h-8 flex items-center justify-center">
                        <i className={`${item.icon} text-lg`}></i>
                      </span>
                      <span className="ml-3 sidebar-text font-medium">{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* User info and settings */}
            <div className="p-4 border-t border-gray-700">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <i className="ri-user-line text-white"></i>
                </div>
                <div className="flex-1 min-w-0 sidebar-text">
                  <p className="text-sm font-medium text-white truncate">{user?.fullName}</p>
                  <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-center justify-between sidebar-text">
                <span className="text-sm text-gray-300">Dark Mode</span>
                <label className="custom-switch">
                  <input 
                    type="checkbox" 
                    className="custom-switch-input" 
                    checked={darkMode}
                    onChange={() => setDarkMode(!darkMode)}
                  />
                  <span className="custom-switch-slider"></span>
                </label>
              </div>
              <div className="mt-4 border-t border-gray-700 pt-4">
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 rounded-lg transition-colors text-gray-300 hover:bg-red-600/20 hover:text-red-400 w-full"
                >
                  <span className="w-8 h-8 flex items-center justify-center">
                    <i className="ri-logout-box-r-line"></i>
                  </span>
                  <span className="ml-2 sidebar-text">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className={`min-h-screen transition-all duration-300 ${
          sidebarCollapsed ? 'main-collapsed' : 'main-expanded'
        }`}>
          {/* Top Bar - Desktop & Mobile */}
          <header className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-20">
            <div className="flex items-center justify-between h-16 px-4 md:px-6">
              {/* Left Section */}
              <div className="flex items-center space-x-4">
                {/* Mobile Menu Button */}
                <button
                  onClick={toggleMobileMenu}
                  className="md:hidden text-gray-400 hover:text-white p-2 rounded-lg transition-colors"
                  aria-label="Toggle mobile menu"
                >
                  <i className="ri-menu-line text-xl"></i>
                </button>
                
                {/* Desktop Sidebar Toggle */}
                <button
                  onClick={toggleSidebar}
                  className="hidden md:flex text-gray-400 hover:text-white p-2 rounded-lg transition-colors"
                  aria-label="Toggle sidebar"
                >
                  <i className={`ri-${sidebarCollapsed ? 'menu-unfold' : 'menu-fold'}-line text-lg`}></i>
                </button>

                {/* Mobile Logo */}
                <Link href="/admin" className="md:hidden flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                    <Image 
                      src="/primarylogo.png" 
                      alt="CitiWatch Logo" 
                      width={32} 
                      height={32}
                      className="rounded-lg"
                    />
                  </div>
                  <span className="text-lg font-bold text-white">Admin</span>
                </Link>

                {/* Desktop Breadcrumb/Page Title */}
                <div className="hidden md:flex items-center space-x-2">
                  <h1 className="text-xl font-semibold text-white">
                    {pathname === '/admin' && 'Dashboard'}
                    {pathname.startsWith('/admin/complaints') && 'Complaints Management'}
                    {pathname.startsWith('/admin/categories') && 'Categories Management'}
                    {pathname.startsWith('/admin/users') && 'Users Management'}
                    {pathname.startsWith('/admin/status') && 'Status Management'}
                  </h1>
                  <div className="text-gray-400 text-sm">
                    <i className="ri-arrow-right-s-line"></i>
                    <span className="ml-1">
                      {pathname.includes('/pending') && 'Pending'}
                      {pathname.includes('/manage') && 'Manage'}
                      {pathname.match(/\/\[id\]/) && 'Details'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Center Section - Search (Desktop only) */}
              <div className="hidden lg:flex flex-1 max-w-md mx-8">
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="ri-search-line text-gray-400"></i>
                  </div>
                  <input
                    type="search"
                    placeholder="Search complaints, users, categories..."
                    className="w-full bg-gray-800/50 border border-gray-600 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Right Section */}
              <div className="flex items-center space-x-2">
                {/* Quick Actions - Desktop */}
                <div className="hidden md:flex items-center space-x-1">
                </div>

                {/* Notifications */}
                <button className="relative p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                  <i className="ri-notification-3-line text-lg"></i>
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* Dark Mode Toggle */}
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                  title="Toggle Dark Mode"
                >
                  <i className={`ri-${darkMode ? 'sun' : 'moon'}-line text-lg`}></i>
                </button>

                {/* User Menu */}
                <div className="flex items-center space-x-3">
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-medium text-white">{user?.fullName}</p>
                    <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
                  </div>
                  <div className="relative">
                    <button className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-800 transition-colors">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <i className="ri-user-line text-white text-sm"></i>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Home & Logout */}
                <div className="flex items-center space-x-1 ml-2 pl-2 border-l border-gray-600">
                  <Link
                    href="/"
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                    title="Go to Home"
                  >
                    <i className="ri-home-line text-lg"></i>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Logout"
                  >
                    <i className="ri-logout-box-r-line text-lg"></i>
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Search Bar */}
            <div className="lg:hidden px-4 pb-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="ri-search-line text-gray-400"></i>
                </div>
                <input
                  type="search"
                  placeholder="Search..."
                  className="w-full bg-gray-800/50 border border-gray-600 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900 min-h-0">
            <div className="p-4 md:p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
