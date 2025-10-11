"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/auth/AuthContext";

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout, isAuthenticated, isAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full">
      <div 
        className={`
          max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative transition-all duration-500 ease-out
          ${isScrolled ? 'py-2' : 'py-0'}
        `}
        style={{
          background: isScrolled 
            ? 'rgba(255, 255, 255, 0.1)' 
            : 'rgba(255, 255, 255, 0.05)',
          backdropFilter: isScrolled ? 'blur(30px)' : 'blur(20px)',
          WebkitBackdropFilter: isScrolled ? 'blur(30px)' : 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '0 0 20px 20px',
          boxShadow: isScrolled 
            ? '0 10px 40px rgba(0, 0, 0, 0.3)' 
            : '0 5px 20px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center group">
              <h1 className="text-xl font-bold text-white flex items-center transition-all duration-300 group-hover:scale-105">
                <div className="relative">
                  <Image 
                    src="/primarylogo.png" 
                    alt="CitiWatch Logo" 
                    width={40} 
                    height={40} 
                    className="mr-3 transition-transform duration-300 group-hover:rotate-12"
                  />
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.4) 0%, transparent 70%)',
                      filter: 'blur(10px)',
                    }}
                  />
                </div>
                CitiWatch
              </h1>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-300 hover:text-white transition-all duration-300 text-sm relative group">
              <span>Home</span>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></div>
            </Link>
            <Link href="#about" className="text-gray-300 hover:text-white transition-all duration-300 text-sm relative group">
              <span>About</span>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></div>
            </Link>
            <Link href="#how-to-use" className="text-gray-300 hover:text-white transition-all duration-300 text-sm relative group">
              <span>How to Use</span>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></div>
            </Link>
            {isAuthenticated && !isAdmin && (
              <>
                <Link 
                  href="/dashboard" 
                  className="text-gray-300 hover:text-white transition-all duration-300 text-sm relative group"
                >
                  <span>Dashboard</span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></div>
                </Link>
                <Link 
                  href="/dashboard/submit" 
                  className="text-gray-300 hover:text-white transition-all duration-300 text-sm relative group"
                >
                  <span>Submit a Report</span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></div>
                </Link>
              </>
            )}
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
                      className="bg-red-600/80 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 backdrop-blur-sm border border-red-500/30 hover:scale-105"
                    >
                      Logout
                    </button>
                  </>
                )}
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="bg-blue-600/80 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 backdrop-blur-sm border border-blue-500/30 hover:scale-105"
                  >
                    Admin Dashboard
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-white/10"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-600/80 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 backdrop-blur-sm border border-blue-500/30 hover:scale-105"
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
              className="relative p-3 rounded-xl text-gray-300 hover:text-white transition-all duration-300 group"
              style={{
                background: isMobileMenuOpen 
                  ? 'rgba(255, 255, 255, 0.15)' 
                  : 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              {/* Animated hamburger icon */}
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span 
                  className={`
                    block h-0.5 w-6 bg-current transform transition-all duration-300 ease-in-out
                    ${isMobileMenuOpen 
                      ? 'rotate-45 translate-y-1.5' 
                      : 'rotate-0 translate-y-0'
                    }
                  `}
                />
                <span 
                  className={`
                    block h-0.5 w-6 bg-current transform transition-all duration-300 ease-in-out mt-1
                    ${isMobileMenuOpen 
                      ? 'opacity-0 scale-0' 
                      : 'opacity-100 scale-100'
                    }
                  `}
                />
                <span 
                  className={`
                    block h-0.5 w-6 bg-current transform transition-all duration-300 ease-in-out mt-1
                    ${isMobileMenuOpen 
                      ? '-rotate-45 -translate-y-1.5' 
                      : 'rotate-0 translate-y-0'
                    }
                  `}
                />
              </div>

              {/* Glow effect */}
              <div 
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.3) 0%, transparent 70%)',
                }}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 z-40 top-20"
          onClick={() => setIsMobileMenuOpen(false)}
          style={{
            background: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(2px)',
          }}
        />
      )}

      {/* Mobile Navigation Menu */}
      <div 
        className={`
          md:hidden fixed top-20 left-0 z-50 h-full w-80 max-w-[85vw]
          transform transition-all duration-500 ease-out
          ${isMobileMenuOpen 
            ? 'translate-x-0 opacity-100' 
            : '-translate-x-full opacity-0 pointer-events-none'
          }
        `}
        style={{
          background: 'rgba(15, 23, 42, 0.98)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          borderRight: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '20px 0 40px rgba(0, 0, 0, 0.3)',
        }}
      >
        <div className="py-8 px-6 h-full overflow-y-auto">
          <div className="flex flex-col space-y-2">
            {/* Common navigation for all users */}
            <Link 
              href="/" 
              className={`
                text-gray-300 hover:text-white transition-all duration-300 text-lg flex items-center py-4 px-4 rounded-xl
                hover:bg-white/10 group transform
                ${isMobileMenuOpen 
                  ? 'translate-x-0 opacity-100' 
                  : '-translate-x-4 opacity-0'
                }
              `}
              style={{ transitionDelay: '0.1s' }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <i className="fas fa-home mr-4 w-5 group-hover:scale-110 transition-transform duration-300"></i>
              Home
            </Link>
            <Link 
              href="#about" 
              className={`
                text-gray-300 hover:text-white transition-all duration-300 text-lg flex items-center py-4 px-4 rounded-xl
                hover:bg-white/10 group transform
                ${isMobileMenuOpen 
                  ? 'translate-x-0 opacity-100' 
                  : '-translate-x-4 opacity-0'
                }
              `}
              style={{ transitionDelay: '0.2s' }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <i className="fas fa-info-circle mr-4 w-5 group-hover:scale-110 transition-transform duration-300"></i>
              About
            </Link>
            <Link 
              href="#how-to-use" 
              className={`
                text-gray-300 hover:text-white transition-all duration-300 text-lg flex items-center py-4 px-4 rounded-xl
                hover:bg-white/10 group transform
                ${isMobileMenuOpen 
                  ? 'translate-x-0 opacity-100' 
                  : '-translate-x-4 opacity-0'
                }
              `}
              style={{ transitionDelay: '0.3s' }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <i className="fas fa-question-circle mr-4 w-5 group-hover:scale-110 transition-transform duration-300"></i>
              How to Use
            </Link>
            
            {isAuthenticated ? (
              <>
                {!isAdmin ? (
                  // Regular User Mobile Navigation
                  <>
                    <Link 
                      href="/dashboard" 
                      className={`
                        text-gray-300 hover:text-white transition-all duration-300 text-lg flex items-center py-4 px-4 rounded-xl
                        hover:bg-white/10 group transform
                        ${isMobileMenuOpen 
                          ? 'translate-x-0 opacity-100' 
                          : '-translate-x-4 opacity-0'
                        }
                      `}
                      style={{ transitionDelay: '0.4s' }}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <i className="fas fa-tachometer-alt mr-4 w-5 group-hover:scale-110 transition-transform duration-300"></i>
                      Dashboard
                    </Link>
                    <Link 
                      href="/dashboard/submit" 
                      className={`
                        text-gray-300 hover:text-white transition-all duration-300 text-lg flex items-center py-4 px-4 rounded-xl
                        hover:bg-white/10 group transform
                        ${isMobileMenuOpen 
                          ? 'translate-x-0 opacity-100' 
                          : '-translate-x-4 opacity-0'
                        }
                      `}
                      style={{ transitionDelay: '0.5s' }}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <i className="fas fa-plus-circle mr-4 w-5 group-hover:scale-110 transition-transform duration-300"></i>
                      Submit a Report
                    </Link>
                    <div className="pt-6 mt-6 border-t border-gray-600/30 space-y-4">
                      <div className={`
                        text-gray-400 text-sm px-4 transform transition-all duration-300
                        ${isMobileMenuOpen 
                          ? 'translate-x-0 opacity-100' 
                          : '-translate-x-4 opacity-0'
                        }
                      `}
                      style={{ transitionDelay: '0.6s' }}
                      >
                        Welcome, {user?.fullName || 'User'}
                      </div>
                      <button
                        onClick={() => {
                          logout();
                          setIsMobileMenuOpen(false);
                        }}
                        className={`
                          bg-red-600/80 hover:bg-red-600 text-white px-6 py-3 rounded-xl text-lg font-medium 
                          transition-all duration-300 flex items-center w-full backdrop-blur-sm border border-red-500/30
                          transform hover:scale-105
                          ${isMobileMenuOpen 
                            ? 'translate-x-0 opacity-100' 
                            : '-translate-x-4 opacity-0'
                          }
                        `}
                        style={{ transitionDelay: '0.7s' }}
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
                        className={`
                          bg-blue-600/80 hover:bg-blue-600 text-white px-6 py-3 rounded-xl text-lg font-medium 
                          transition-all duration-300 flex items-center w-full backdrop-blur-sm border border-blue-500/30
                          transform hover:scale-105
                          ${isMobileMenuOpen 
                            ? 'translate-x-0 opacity-100' 
                            : '-translate-x-4 opacity-0'
                          }
                        `}
                        style={{ transitionDelay: '0.4s' }}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <i className="fas fa-tachometer-alt mr-4 w-5"></i>
                        Admin Dashboard
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
                    className={`
                      text-gray-300 hover:text-white transition-all duration-300 text-lg flex items-center py-4 px-4 rounded-xl
                      hover:bg-white/10 group transform
                      ${isMobileMenuOpen 
                        ? 'translate-x-0 opacity-100' 
                        : '-translate-x-4 opacity-0'
                      }
                    `}
                    style={{ transitionDelay: '0.4s' }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <i className="fas fa-sign-in-alt mr-4 w-5 group-hover:scale-110 transition-transform duration-300"></i>
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className={`
                      bg-blue-600/80 hover:bg-blue-600 text-white px-6 py-3 rounded-xl text-lg font-medium 
                      transition-all duration-300 flex items-center backdrop-blur-sm border border-blue-500/30
                      transform hover:scale-105
                      ${isMobileMenuOpen 
                        ? 'translate-x-0 opacity-100' 
                        : '-translate-x-4 opacity-0'
                      }
                    `}
                    style={{ transitionDelay: '0.5s' }}
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
    </nav>
  );
}