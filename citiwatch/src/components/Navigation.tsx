"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/auth/AuthContext";

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout, isAuthenticated, isAdmin } = useAuth();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full">
      <div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative"
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '0 0 20px 20px'
        }}
      >
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <h1 className="text-xl font-bold text-white flex items-center">
                <Image 
                  src="/primarylogo.png" 
                  alt="CitiWatch Logo" 
                  width={40} 
                  height={40} 
                  className="mr-2"
                />
                CitiWatch
              </h1>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Show landing page navigation for all users on home page */}
            <>

              <Link href="/" className="text-gray-300 hover:text-white transition-colors text-sm flex items-center">
                Home
              </Link>
              <Link href="#about" className="text-gray-300 hover:text-white transition-colors text-sm flex items-center">
                About
              </Link>
              <Link href="#how-to-use" className="text-gray-300 hover:text-white transition-colors text-sm flex items-center">
                How to Use
              </Link>
              {isAuthenticated && !isAdmin && (
                <>
                  <Link 
                    href="/dashboard" 
                    className="text-gray-300 hover:text-white transition-colors text-sm flex items-center"
                  >
                    Dashboard
                  </Link>
                  <Link 
                    href="/dashboard/submit" 
                    className="text-gray-300 hover:text-white transition-colors text-sm flex items-center"
                  >
                    Submit a Report
                  </Link>
                </>
              )}
            </>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {!isAdmin && (
                  <>
                    <span className="text-gray-300 text-sm">
                      Welcome, {user?.fullName || 'User'}
                    </span>
                    <button
                      onClick={logout}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors flex items-center"
                    >
                      Logout
                    </button>
                  </>
                )}
                {isAdmin && (
                  // Admin logout handled in AdminLayout - show dashboard link on landing
                  <Link
                    href="/admin"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors flex items-center"
                  >
                    Dashboard
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-300 hover:text-white transition-colors text-sm font-medium flex items-center"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors flex items-center"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-300 hover:text-white focus:outline-none focus:text-white transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div 
            className="md:hidden absolute left-0 top-full"
            style={{
              background: 'rgba(0, 0, 0, 0.95)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              zIndex: 100,
              width: 'calc(100vw - 32px)',
              height: 'calc(100vh - 120px)',
              borderRadius: '0 16px 16px 0'
            }}
          >
            <div className="py-8 px-8">
              <div className="flex flex-col space-y-6">
                {/* Common navigation for all users */}
                <Link 
                  href="/" 
                  className="text-gray-300 hover:text-white transition-colors text-lg flex items-center py-3"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <i className="fas fa-home mr-4 w-5"></i>
                  Home
                </Link>
                <Link 
                  href="#about" 
                  className="text-gray-300 hover:text-white transition-colors text-lg flex items-center py-3"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <i className="fas fa-info-circle mr-4 w-5"></i>
                  About
                </Link>
                <Link 
                  href="#how-to-use" 
                  className="text-gray-300 hover:text-white transition-colors text-lg flex items-center py-3"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <i className="fas fa-question-circle mr-4 w-5"></i>
                  How to Use
                </Link>
                
                {isAuthenticated ? (
                  <>
                    {!isAdmin ? (
                      // Regular User Mobile Navigation
                      <>
                        <Link 
                          href="/dashboard" 
                          className="text-gray-300 hover:text-white transition-colors text-lg flex items-center py-3"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <i className="fas fa-tachometer-alt mr-4 w-5"></i>
                          Dashboard
                        </Link>
                        <Link 
                          href="/dashboard/submit" 
                          className="text-gray-300 hover:text-white transition-colors text-lg flex items-center py-3"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <i className="fas fa-plus-circle mr-4 w-5"></i>
                          Submit a Report
                        </Link>
                        <div className="pt-6 mt-6 border-t border-gray-600/30 space-y-4">
                          <div className="text-gray-400 text-sm">
                            Welcome, {user?.fullName || 'User'}
                          </div>
                          <button
                            onClick={() => {
                              logout();
                              setIsMobileMenuOpen(false);
                            }}
                            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg text-lg font-medium transition-colors flex items-center w-full"
                          >
                            <i className="fas fa-sign-out-alt mr-4 w-5"></i>
                            Logout
                          </button>
                        </div>
                      </>
                    ) : (
                      // Admin Mobile Navigation
                      <>
                        <div className="pt-6 mt-6 border-t border-gray-600/30 space-y-4">
                          <Link
                            href="/admin"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-medium transition-colors flex items-center w-full"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <i className="fas fa-tachometer-alt mr-4 w-5"></i>
                            Dashboard
                          </Link>
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  // Guest Mobile Navigation (Landing Page)
                  <>
                    <div className="pt-6 mt-6 border-t border-gray-600/30 space-y-4">
                      <Link
                        href="/login"
                        className="flex items-center text-gray-300 hover:text-white transition-colors text-lg font-medium py-3"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <i className="fas fa-sign-in-alt mr-4 w-5"></i>
                        Login
                      </Link>
                      <Link
                        href="/register"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-medium transition-colors flex items-center"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <i className="fas fa-user-plus mr-4 w-5"></i>
                        Get Started
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
