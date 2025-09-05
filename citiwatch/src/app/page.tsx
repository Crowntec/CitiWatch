"use client";

import Image from "next/image";
import Link from "next/link";
import Navigation from "@/components/Navigation";

export default function Home() {
  return (
    <div className="mobile-full-height relative overflow-hidden" style={{ minHeight: '100dvh' }}>
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/cityatnight.mp4" type="video/mp4" />
      </video>
      
      {/* Gradient Overlay */}
      <div 
        className="absolute inset-0 z-10"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(30, 41, 59, 0.2) 0%, rgba(15, 23, 42, 0.1) 100%)'
        }}
      ></div>

      {/* Glass Effect Overlay */}
      <div 
        className="absolute inset-0 z-10"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.02) 0.7%)',
          backdropFilter: 'blur(5px)',
          WebkitBackdropFilter: 'blur(10px)',
        }}
      ></div>
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <div 
        className="relative z-20 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pt-20 pb-8" 
        style={{ 
          minHeight: '100dvh',
          paddingTop: 'max(80px, env(safe-area-inset-top))'
        }}
      >
        {/* Central Icon */}
        <div className="mb-8 sm:mb-12">
          <div 
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center shadow-2xl mx-auto"
            style={{
              background: 'rgba(255, 255, 255, 0.075)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <Image 
              src="/logo.png" 
              alt="CitiWatch Logo" 
              width={64} 
              height={64} 
              className="filter brightness-200 w-16 h-16 sm:w-20 sm:h-20"
            />
          </div>
        </div>

        {/* Badge */}
        <div className="mb-6 sm:mb-8">
          <span 
            className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-medium text-blue-300 border"
            style={{
              background: 'rgba(30, 58, 138, 0.3)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
            }}
          >
            • NEW GEN AI CIVIC PARTNER
          </span>
        </div>

        {/* Main Heading */}
        <div className="text-center max-w-4xl mx-auto mb-4 sm:mb-6 px-2">
          <h1 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-tight"
            style={{
              backgroundImage: 'radial-gradient(99% 86% at 50% 50%, rgb(213, 219, 230) 28.387387387387385%, rgb(4, 7, 13) 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              color: 'transparent'
            }}
          >
            Take Action. Report Civic Issues Seamlessly
          </h1>
        </div>

        {/* Subtitle */}
        <div className="text-center mb-8 sm:mb-12 px-4">
          <p className="text-base sm:text-lg text-gray-400 max-w-md mx-auto leading-relaxed">
            Report civic issues like potholes, broken lights, and graffiti in seconds. Upload photos, track progress, and make your city bettertogether.
          </p>
        </div>

        {/* CTA Button */}
        <div className="mb-12 sm:mb-16 px-4">
          <Link
            href="/register"
            className="inline-flex items-center px-6 py-3 text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium rounded group"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.5)',
              borderRadius: '20px',
            }}
          >
            Submit A Report
            <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* Social Icons */}
        <div className="flex space-x-6">
          <a href="#" className="text-gray-500 hover:text-gray-400 transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
          </a>
          <a href="#" className="text-gray-500 hover:text-gray-400 transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.219-.359-1.219c0-1.142.662-1.995 1.488-1.995.219 0 .359.219.359.578 0 .359-.219.898-.359 1.396-.219.937.479 1.694 1.406 1.694 1.687 0 2.987-1.78 2.987-4.365 0-2.283-1.642-3.878-3.988-3.878-2.717 0-4.313 2.044-4.313 4.146 0 .823.318 1.706.718 2.188a.36.36 0 01.079.343c-.09.375-.289 1.194-.328 1.359-.053.219-.173.265-.402.159-1.499-.698-2.436-2.888-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z" clipRule="evenodd"/>
            </svg>
          </a>
          <a href="#" className="text-gray-500 hover:text-gray-400 transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
            </svg>
          </a>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="w-6 h-10 border-2 border-gray-600 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-600 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}