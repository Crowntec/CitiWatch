"use client";

import Image from "next/image";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import StructuredData from "@/components/StructuredData";

// Note: Since this is a client component, we'll set metadata via the root layout
// For SEO optimization, consider converting to server component if possible

export default function Home() {
  return (
    <>
      <StructuredData type="website" />
      <div className="relative">
        {/* Hero Section with Video Background */}
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

          {/* Hero Content */}
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
              src="/primarylogo.png" 
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

    {/* Content Sections with Dark Background */}
    <div className="bg-slate-900">
      {/* About the Project Section */}
      <section className="relative z-20 py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              About CitiWatch
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              CitiWatch is a next-generation civic engagement platform that empowers citizens to actively participate in improving their communities through seamless issue reporting and tracking.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-white">Our Mission</h3>
                <p className="text-gray-400">
                  We believe that every citizen should have a voice in shaping their community. CitiWatch bridges the gap between residents and local authorities, creating a transparent and efficient system for civic issue management.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-white">Key Features</h3>
                <ul className="space-y-3 text-gray-400">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-blue-400 mt-1 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Instant photo upload and geolocation tracking</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-blue-400 mt-1 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Real-time progress tracking and status updates</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-blue-400 mt-1 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Categorized issue management system</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-blue-400 mt-1 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Community-driven transparency and accountability</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Visual Element */}
            <div className="relative">
              <div 
                className="rounded-2xl p-8 h-64 flex items-center justify-center"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-semibold text-white mb-2">Location-Based Reporting</h4>
                  <p className="text-gray-400 text-sm">
                    Precise GPS tracking ensures issues are reported exactly where they occur
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Use the App Section */}
      <section className="relative z-20 py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              How to Use CitiWatch
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Reporting civic issues has never been easier. Follow these simple steps to make your voice heard and help improve your community.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div 
                className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center"
                style={{
                  background: 'rgba(59, 130, 246, 0.2)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                }}
              >
                <span className="text-2xl font-bold text-blue-400">1</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Sign Up & Log In</h3>
              <p className="text-gray-400 mb-6">
                Create your free account with just your email and a secure password. Quick registration gets you started in under 2 minutes.
              </p>
              <div 
                className="rounded-lg p-4"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <svg className="w-8 h-8 text-blue-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div 
                className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center"
                style={{
                  background: 'rgba(16, 185, 129, 0.2)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                }}
              >
                <span className="text-2xl font-bold text-emerald-400">2</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Report an Issue</h3>
              <p className="text-gray-400 mb-6">
                Tap "Submit a Report", take a photo of the issue, add a description, and select the appropriate category. Your location is automatically captured.
              </p>
              <div 
                className="rounded-lg p-4"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <svg className="w-8 h-8 text-emerald-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div 
                className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center"
                style={{
                  background: 'rgba(245, 158, 11, 0.2)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                }}
              >
                <span className="text-2xl font-bold text-amber-400">3</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Track Progress</h3>
              <p className="text-gray-400 mb-6">
                Monitor your report's status in real-time. Get notified when authorities acknowledge, investigate, or resolve your submitted issue.
              </p>
              <div 
                className="rounded-lg p-4"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <svg className="w-8 h-8 text-amber-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <div 
              className="inline-block p-8 rounded-2xl"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <h3 className="text-2xl font-bold text-white mb-4">Ready to Make a Difference?</h3>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                Join thousands of citizens already using CitiWatch to improve their communities. Your report could be the catalyst for positive change.
              </p>
              <Link
                href="/register"
                className="inline-flex items-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-300"
              >
                Get Started Today
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}