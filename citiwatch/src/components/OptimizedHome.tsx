"use client";
import { useState, useEffect, useCallback } from 'react';
import Navigation from '../components/Navigation';
import StructuredData from '../components/StructuredData';

// Optimized Home component for better performance
export default function OptimizedHome() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  // Optimized initialization
  useEffect(() => {
    // Immediate load for critical content
    setIsLoaded(true);
    
    // Delayed video loading to not block FCP
    const videoTimer = setTimeout(() => {
      setVideoLoaded(true);
      // Only show video after user has had chance to see content
      setTimeout(() => setShowVideo(true), 200);
    }, 1000);

    return () => clearTimeout(videoTimer);
  }, []);

  // Optimized scroll handler with throttling
  const handleScroll = useCallback(() => {
    let ticking = false;
    
    const update = () => {
      const scrollY = window.scrollY;
      const heroElements = document.querySelectorAll('.hero-parallax');
      
      // Simplified parallax effect
      heroElements.forEach((element, index) => {
        const speed = 0.3 + (index * 0.1);
        const yPos = scrollY * speed;
        (element as HTMLElement).style.transform = `translate3d(0, ${yPos}px, 0)`;
      });
      
      ticking = false;
    };

    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, []);

  // Simplified intersection observer
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    // Observe reveal elements
    const revealElements = document.querySelectorAll('.scroll-reveal');
    revealElements.forEach(el => observer.observe(el));

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return (
    <>
      <StructuredData type="website" />
      
      {/* Optimized Hero Section */}
      <div className="mobile-full-height relative overflow-hidden" style={{ minHeight: '100dvh' }}>
        {/* Optimized Background */}
        {showVideo && videoLoaded ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0"
            preload="none"
          >
            <source src="/cityatnight.mp4" type="video/mp4" />
          </video>
        ) : (
          <div 
            className="absolute inset-0 w-full h-full z-0"
            style={{
              background: 'linear-gradient(135deg, #0a0f1c 0%, #1e293b 50%, #0f172a 100%)'
            }}
          />
        )}
        
        {/* Simplified overlays */}
        <div className="absolute inset-0 z-10 hero-parallax bg-gradient-to-br from-slate-900/20 to-slate-800/10"></div>
        <div className="absolute inset-0 z-10 hero-parallax backdrop-blur-sm bg-white/5"></div>

        {/* Navigation */}
        <Navigation />

        {/* Optimized Hero Content */}
        <div 
          className="hero-content relative z-20 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pt-20 pb-8" 
          style={{ 
            minHeight: '100dvh',
            paddingTop: 'max(80px, env(safe-area-inset-top))'
          }}
        >
          {/* Main heading */}
          <div className={`mb-8 sm:mb-12 transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-center mb-4 leading-tight tracking-tight">
              <span className="bg-gradient-to-br from-white via-blue-50 to-blue-100 bg-clip-text text-transparent">
                Citi
              </span>
              <span className="bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
                Watch
              </span>
            </h1>
          </div>

          {/* Subtitle */}
          <div className={`mb-6 sm:mb-8 transition-all duration-500 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-light text-center text-white/90 leading-relaxed max-w-4xl mx-auto">
              Empowering Citizens to Shape Their Communities
            </h2>
          </div>

          {/* Description */}
          <div className={`text-center max-w-4xl mx-auto mb-4 sm:mb-6 px-2 transition-all duration-500 delay-400 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <p className="text-lg sm:text-xl lg:text-2xl text-white/80 leading-relaxed font-light">
              Report issues, track progress, and collaborate with your local government to build better cities together.
            </p>
          </div>

          {/* CTA Buttons - Simplified */}
          <div className={`mb-12 sm:mb-16 px-4 transition-all duration-500 delay-600 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center justify-center">
              <a
                href="/dashboard"
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Get Started
              </a>
              <a
                href="#about"
                className="group px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-xl transition-all duration-300 hover:bg-white/20 shadow-lg"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Simplified content sections would go here */}
      <div className="scroll-reveal py-20 bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">About CitiWatch</h2>
          <p className="text-lg text-white/80">
            CitiWatch is a platform that bridges the gap between citizens and their local government,
            making it easier to report issues and track their resolution.
          </p>
        </div>
      </div>
    </>
  );
}