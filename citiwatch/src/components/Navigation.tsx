"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="relative z-50">
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
            <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors text-sm">
              Dashboard
            </Link>
            <Link href="/categories" className="text-gray-300 hover:text-white transition-colors text-sm">
              Categories
            </Link>
            <Link href="/dashboard/submit" className="text-gray-300 hover:text-white transition-colors text-sm">
              Submit Report
            </Link>
            <Link href="/admin" className="text-gray-300 hover:text-white transition-colors text-sm">
              Admin
            </Link>
            <Link href="#contact" className="text-gray-300 hover:text-white transition-colors text-sm">
              Contact
            </Link>
          </div>

          {/* Desktop Get Started Button */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/login"
              className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
            >
              Get Started
            </Link>
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
            className="md:hidden absolute left-0 right-0 top-full w-screen"
            style={{
              background: 'rgba(0, 0, 0, 0.95)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              zIndex: 100,
              height: '100vh'
            }}
          >
            <div className="py-8 px-8">
              <div className="flex flex-col space-y-6 max-w-sm mx-auto">
                <Link 
                  href="/dashboard" 
                  className="text-gray-300 hover:text-white transition-colors text-lg block py-3 text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  href="/categories" 
                  className="text-gray-300 hover:text-white transition-colors text-lg block py-3 text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Categories
                </Link>
                <Link 
                  href="/dashboard/submit" 
                  className="text-gray-300 hover:text-white transition-colors text-lg block py-3 text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Submit Report
                </Link>
                <Link 
                  href="/admin" 
                  className="text-gray-300 hover:text-white transition-colors text-lg block py-3 text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Admin
                </Link>
                <Link 
                  href="#contact" 
                  className="text-gray-300 hover:text-white transition-colors text-lg block py-3 text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </Link>
                <div className="pt-6 mt-6 border-t border-gray-600/30 space-y-4">
                  <Link
                    href="/login"
                    className="block text-center text-gray-300 hover:text-white transition-colors text-lg font-medium py-3"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-medium transition-colors flex items-center justify-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
