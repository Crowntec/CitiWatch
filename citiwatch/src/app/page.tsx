"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import StructuredData from "@/components/StructuredData";
import PerformanceMonitor from "@/components/PerformanceMonitor";

// Note: Since this is a client component, we'll set metadata via the root layout
// For SEO optimization, consider converting to server component if possible

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Initialize staggered animations
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Lazy load video after critical content
  useEffect(() => {
    const loadVideo = () => {
      const timer = setTimeout(() => {
        setVideoLoaded(true);
      }, 500); // Delay video loading by 500ms
      return timer;
    };

    const timer = loadVideo();
    return () => clearTimeout(timer);
  }, []);

  // Enhanced scroll animations with intersection observer
  useEffect(() => {
    // Create intersection observer for scroll-triggered animations
    const observerOptions = {
      threshold: [0.1, 0.3, 0.6, 0.9],
      rootMargin: '-50px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const element = entry.target as HTMLElement;
        const intersectionRatio = entry.intersectionRatio;
        
        if (element.id === 'youtube-video-container') {
          // Enhanced video container animation
          const minScale = 0.8;
          const maxScale = 1.05;
          const minOpacity = 0.4;
          const maxOpacity = 1;
          
          // Enhanced easing function
          const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);
          const easedProgress = easeOutQuart(intersectionRatio);
          
          const scale = minScale + (maxScale - minScale) * easedProgress;
          const opacity = minOpacity + (maxOpacity - minOpacity) * easedProgress;
          
          element.style.transform = `scale(${scale}) translateY(${(1 - easedProgress) * 30}px)`;
          element.style.opacity = `${opacity}`;
          
          // Add glow effect when fully visible
          if (intersectionRatio > 0.8) {
            element.style.filter = `brightness(${1 + (intersectionRatio - 0.8) * 0.5}) drop-shadow(0 0 20px rgba(59, 130, 246, 0.3))`;
          }
        }
        
        // Animate video stats
        if (element.classList.contains('video-stat')) {
          if (intersectionRatio > 0.3) {
            element.style.transform = 'translateY(0) scale(1)';
            element.style.opacity = '1';
          } else {
            element.style.transform = 'translateY(20px) scale(0.95)';
            element.style.opacity = '0.7';
          }
        }
      });
    }, observerOptions);



    // Create scroll reveal observer
    const scrollRevealOptions = {
      threshold: 0.1,
      rootMargin: '-50px 0px -50px 0px'
    };

    const scrollRevealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, scrollRevealOptions);

    // Observe elements
    const videoContainer = document.getElementById('youtube-video-container');
    const statElements = document.querySelectorAll('.video-stat');
    const scrollRevealElements = document.querySelectorAll('.scroll-reveal-up, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale, .scroll-reveal-rotate');
    
    if (videoContainer) observer.observe(videoContainer);
    statElements.forEach(el => observer.observe(el));
    scrollRevealElements.forEach(el => scrollRevealObserver.observe(el));

    // Optimized scroll-based animations for hero elements
    let scrollTicking = false;
    const handleScroll = () => {
      if (!scrollTicking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const heroElements = document.querySelectorAll('.hero-parallax');
          
          // Reduced complexity - only transform if elements exist
          if (heroElements.length > 0) {
            heroElements.forEach((element, index) => {
              const speed = 0.3 + (index * 0.05); // Reduced multiplier for smoother performance
              const yPos = scrollY * speed;
              (element as HTMLElement).style.transform = `translate3d(0, ${yPos}px, 0)`;
            });
          }
          
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', () => observer.disconnect(), { passive: true });

    return () => {
      observer.disconnect();
      scrollRevealObserver.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <PerformanceMonitor>
      <StructuredData type="website" />
      
      {/* Hero Section with Video Background */}
      <div className="mobile-full-height relative overflow-hidden" style={{ minHeight: '100dvh' }}>
        {/* Background Video - Lazy Loaded */}
        {videoLoaded ? (
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
        
        {/* Gradient Overlay */}
        <div 
          className="absolute inset-0 z-10 hero-parallax"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(30, 41, 59, 0.2) 0%, rgba(15, 23, 42, 0.1) 100%)'
          }}
        ></div>

        {/* Glass Effect Overlay */}
        <div 
          className="absolute inset-0 z-10 hero-parallax"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.02) 0.7%)',
            backdropFilter: 'blur(5px)',
            WebkitBackdropFilter: 'blur(10px)',
          }}
        ></div>

        {/* Floating Particles */}
        <div className="absolute inset-0 z-5 pointer-events-none">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-particle-float"
              style={{
                left: `${20 + (i * 10)}%`,
                top: `${30 + (i * 8)}%`,
                animationDelay: `${i * 0.8}s`,
                animationDuration: `${6 + (i % 3)}s`
              }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  background: `rgba(${i % 2 === 0 ? '59, 130, 246' : '34, 197, 94'}, 0.4)`,
                  boxShadow: `0 0 10px rgba(${i % 2 === 0 ? '59, 130, 246' : '34, 197, 94'}, 0.6)`,
                  filter: 'blur(1px)'
                }}
              ></div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <Navigation />

        {/* Hero Content */}
        <div 
          className="hero-content relative z-20 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pt-20 pb-8 transition-transform duration-300 ease-out" 
          style={{ 
            minHeight: '100dvh',
            paddingTop: 'max(80px, env(safe-area-inset-top))'
          }}
        >
          {/* Central Icon */}
          <div className={`mb-8 sm:mb-12 ${isLoaded ? 'animate-fade-in-scale stagger-1' : 'animate-on-load'}`}>
            <div 
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center shadow-2xl mx-auto hero-logo-hover animate-float animate-pulse-glow"
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
                className="filter brightness-200 w-16 h-16 sm:w-20 sm:h-20 transition-all duration-300"
              />
            </div>
          </div>

          {/* Badge with Blinking Light */}
          <div className={`mb-6 sm:mb-8 ${isLoaded ? 'animate-fade-in-up stagger-2' : 'animate-on-load'}`}>
            <span 
              className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 rounded-full text-xs font-medium text-blue-300 border hero-element-hover relative overflow-hidden animate-glow-pulse animate-morph-shape"
              style={{
                background: 'rgba(30, 58, 138, 0.4)',
                backdropFilter: 'blur(15px)',
                WebkitBackdropFilter: 'blur(15px)',
                border: '1px solid rgba(34, 197, 94, 0.4)',
                boxShadow: '0 0 20px rgba(34, 197, 94, 0.2)',
              }}
            >
              <span 
                className="animate-blinking-light text-green-400 mr-2 text-sm font-bold"
                style={{
                  filter: 'drop-shadow(0 0 3px rgba(34, 197, 94, 0.8))'
                }}
              >
                ●
              </span>
              <span className="animate-shimmer font-semibold tracking-wide">NEW CIVIC PARTNER</span>
              <div 
                className="absolute inset-0 rounded-full animate-pulse"
                style={{
                  background: 'linear-gradient(45deg, transparent 30%, rgba(34, 197, 94, 0.1) 50%, transparent 70%)',
                  animation: 'shimmer 3s infinite'
                }}
              ></div>
            </span>
          </div>

          {/* Main Heading */}
          <div className={`text-center max-w-4xl mx-auto mb-4 sm:mb-6 px-2 ${isLoaded ? 'animate-fade-in-up stagger-3' : 'animate-on-load'}`}>
            <h1 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold leading-tight hero-text-hover relative"
              style={{
                background: 'linear-gradient(-45deg, #ffffff, #e2e8f0, #cbd5e1, #94a3b8, #ffffff)',
                backgroundSize: '400% 400%',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                color: 'transparent',
                animation: 'textGradientShift 6s ease infinite',
                textShadow: '0 0 40px rgba(255, 255, 255, 0.1)',
                filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.2))'
              }}
            >
              Take Action. Report Civic Issues Seamlessly
            </h1>
            
            {/* Animated underline */}
            <div 
              className="mx-auto mt-4 h-1 rounded-full transition-all duration-1000 delay-500"
              style={{
                width: isLoaded ? '60%' : '0%',
                background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.6), rgba(34, 197, 94, 0.6), transparent)',
                animation: 'shimmer 3s infinite'
              }}
            ></div>
          </div>

          {/* Subtitle */}
          <div className={`text-center mb-8 sm:mb-12 px-4 ${isLoaded ? 'animate-slide-in-left stagger-4' : 'animate-on-load'}`}>
            <p className="text-base sm:text-lg text-gray-400 max-w-md mx-auto leading-relaxed hero-element-hover">
              Report civic issues like potholes, broken lights, and graffiti in seconds. Upload photos, track progress, and make your city better together.
            </p>
          </div>

          {/* CTA Button */}
          <div className={`mb-12 sm:mb-16 px-4 ${isLoaded ? 'animate-slide-in-right stagger-5' : 'animate-on-load'}`}>
            <Link
              href="/register"
              className="inline-flex items-center px-8 py-4 text-gray-300 hover:text-white transition-all duration-500 text-base font-semibold rounded group hero-button-hover micro-bounce animate-float relative"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.6)',
                borderRadius: '25px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              }}
            >
              <span className="relative z-10">Submit A Report</span>
              <svg 
                className="ml-3 w-5 h-5 group-hover:translate-x-2 group-hover:scale-110 transition-all duration-500 relative z-10" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
              
              {/* Animated background gradient */}
              <div 
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: 'linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(34, 197, 94, 0.1))',
                  animation: 'shimmer 2s infinite'
                }}
              ></div>
              
              {/* Ripple effect on hover */}
              <div 
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-30 transition-all duration-700 scale-0 group-hover:scale-150"
                style={{
                  background: 'radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%)',
                }}
              ></div>
            </Link>
          </div>
          
        </div>
      </div>

      {/* YouTube Video Section with Scroll Animation */}
      <div className="relative overflow-hidden">
        {/* Dark sophisticated background matching the reference */}
        <div 
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(135deg, #0a0f1c 0%, #0d1424 30%, #111827 100%),
              radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(120, 119, 198, 0.08) 0%, transparent 50%)
            `,
          }}
        ></div>

        {/* Geometric pattern overlay */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px),
              radial-gradient(circle at 25px 25px, rgba(255,255,255,0.1) 2px, transparent 2px)
            `,
            backgroundSize: '50px 50px, 50px 50px, 100px 100px'
          }}
        ></div>

        {/* Subtle dot pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        ></div>

        <div className="relative z-10 py-20">
          <div 
            id="youtube-video-container"
            className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ease-out transform"
            style={{
              transform: 'scale(0.8)',
              opacity: '0.7'
            }}
          >
            {/* Section Title */}
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                See CitiWatch in Action
              </h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Watch how citizens around the world are using CitiWatch to transform their communities and create positive change.
              </p>
            </div>

            {/* YouTube Video Container */}
            <div 
              className="relative rounded-2xl overflow-hidden shadow-2xl"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)'
              }}
            >
              {/* Video Aspect Ratio Container */}
              <div className="relative w-full" style={{ paddingBottom: '56.25%' /* 16:9 aspect ratio */ }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://www.youtube.com/embed/uyIQ3n1MWSE?autoplay=0&mute=1&controls=1&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1"
                  title="CitiWatch Demo Video - Smart City Solutions"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>

              {/* Play Button Overlay (Optional) */}
              <div 
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                onClick={() => {
                  const iframe = document.querySelector('#youtube-video-container iframe') as HTMLIFrameElement;
                  if (iframe) {
                    const src = iframe.src;
                    iframe.src = src.replace('autoplay=0', 'autoplay=1');
                  }
                }}
              >
                <div 
                  className="w-20 h-20 rounded-full flex items-center justify-center"
                  style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                  }}
                >
                  <svg className="w-8 h-8 text-gray-800 ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Video Stats/Info (Optional) */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div 
                className="video-stat text-center p-4 rounded-xl hero-element-hover transition-all duration-500"
                style={{
                  background: 'rgba(15, 23, 42, 0.5)',
                  backdropFilter: 'blur(15px)',
                  WebkitBackdropFilter: 'blur(15px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                  transform: 'translateY(20px) scale(0.95)',
                  opacity: '0.7'
                }}
              >
                <div className="text-2xl font-bold text-white">10K+</div>
                <div className="text-sm text-gray-300">Issues Reported</div>
              </div>
              <div 
                className="video-stat text-center p-4 rounded-xl hero-element-hover transition-all duration-500 delay-100"
                style={{
                  background: 'rgba(15, 23, 42, 0.5)',
                  backdropFilter: 'blur(15px)',
                  WebkitBackdropFilter: 'blur(15px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                  transform: 'translateY(20px) scale(0.95)',
                  opacity: '0.7'
                }}
              >
                <div className="text-2xl font-bold text-white">95%</div>
                <div className="text-sm text-gray-300">Resolution Rate</div>
              </div>
              <div 
                className="video-stat text-center p-4 rounded-xl hero-element-hover transition-all duration-500 delay-200"
                style={{
                  background: 'rgba(15, 23, 42, 0.5)',
                  backdropFilter: 'blur(15px)',
                  WebkitBackdropFilter: 'blur(15px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                  transform: 'translateY(20px) scale(0.95)',
                  opacity: '0.7'
                }}
              >
                <div className="text-2xl font-bold text-white">50+</div>
                <div className="text-sm text-gray-300">Cities Using</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections with Enhanced Background */}
      <div className="relative">
        {/* Dark sophisticated background matching the reference */}
        <div 
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(135deg, #0a0f1c 0%, #0d1424 25%, #111827 50%, #0f172a 75%, #0a0f1c 100%),
              radial-gradient(circle at 30% 70%, rgba(120, 119, 198, 0.08) 0%, transparent 60%),
              radial-gradient(circle at 70% 30%, rgba(59, 130, 246, 0.06) 0%, transparent 60%)
            `,
          }}
        ></div>

        {/* Advanced geometric grid pattern */}
        <div 
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px),
              linear-gradient(45deg, rgba(255,255,255,0.02) 1px, transparent 1px),
              linear-gradient(-45deg, rgba(255,255,255,0.02) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px, 60px 60px, 120px 120px, 120px 120px'
          }}
        ></div>

        {/* Dot matrix pattern */}
        <div 
          className="absolute inset-0 opacity-8"
          style={{
            backgroundImage: `
              radial-gradient(circle at 2px 2px, rgba(255,255,255,0.6) 1px, transparent 0),
              radial-gradient(circle at 15px 15px, rgba(120,119,198,0.4) 0.5px, transparent 0)
            `,
            backgroundSize: '30px 30px, 45px 45px'
          }}
        ></div>

        {/* Subtle connection lines */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(30deg, transparent 40%, rgba(255,255,255,0.1) 40.5%, rgba(255,255,255,0.1) 41%, transparent 41.5%),
              linear-gradient(150deg, transparent 40%, rgba(255,255,255,0.1) 40.5%, rgba(255,255,255,0.1) 41%, transparent 41.5%)
            `,
            backgroundSize: '200px 200px, 200px 200px'
          }}
        ></div>

        {/* Glass effect overlay */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.01) 0%, rgba(255, 255, 255, 0.005) 100%)',
            backdropFilter: 'blur(0.5px)',
            WebkitBackdropFilter: 'blur(0.5px)',
          }}
        ></div>

        {/* About the Project Section */}
        <section id="about" className="relative z-20 py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                About CitiWatch
              </h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                CitiWatch is a next-generation civic engagement platform that empowers citizens to actively participate in improving their communities through seamless issue reporting and tracking.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Content */}
              <div className="space-y-6">
                <div 
                  className="space-y-4 p-6 rounded-2xl"
                  style={{
                    background: 'rgba(15, 23, 42, 0.6)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <h3 className="text-2xl font-semibold text-white">Our Mission</h3>
                  <p className="text-gray-300">
                    We believe that every citizen should have a voice in shaping their community. CitiWatch bridges the gap between residents and local authorities, creating a transparent and efficient system for civic issue management.
                  </p>
                </div>

                <div 
                  className="space-y-4 p-6 rounded-2xl"
                  style={{
                    background: 'rgba(15, 23, 42, 0.6)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <h3 className="text-2xl font-semibold text-white">Key Features</h3>
                  <ul className="space-y-3 text-gray-300">
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
                    background: 'rgba(15, 23, 42, 0.6)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <div className="text-center">
                    <div 
                      className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center"
                      style={{
                        background: 'rgba(59, 130, 246, 0.3)',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        border: '1px solid rgba(59, 130, 246, 0.4)',
                        boxShadow: '0 4px 16px rgba(59, 130, 246, 0.2)'
                      }}
                    >
                      <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-semibold text-white mb-2">Location-Based Reporting</h4>
                    <p className="text-gray-300 text-sm">
                      Precise GPS tracking ensures issues are reported exactly where they occur
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How to Use the App Section */}
        <section id="how-to-use" className="relative z-20 py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                How to Use CitiWatch
              </h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Reporting civic issues has never been easier. Follow these simple steps to make your voice heard and help improve your community.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div 
                className="text-center p-6 rounded-2xl"
                style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                }}
              >
                <div 
                  className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center"
                  style={{
                    background: 'rgba(59, 130, 246, 0.3)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: '1px solid rgba(59, 130, 246, 0.4)',
                    boxShadow: '0 4px 16px rgba(59, 130, 246, 0.2)'
                  }}
                >
                  <span className="text-2xl font-bold text-blue-400">1</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Sign Up & Log In</h3>
                <p className="text-gray-300 mb-6">
                  Create your free account with just your email and a secure password. Quick registration gets you started in under 2 minutes.
                </p>
                <div 
                  className="rounded-lg p-4"
                  style={{
                    background: 'rgba(15, 23, 42, 0.4)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.08)'
                  }}
                >
                  <svg className="w-8 h-8 text-blue-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>

              {/* Step 2 */}
              <div 
                className="text-center p-6 rounded-2xl"
                style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                }}
              >
                <div 
                  className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center"
                  style={{
                    background: 'rgba(16, 185, 129, 0.3)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: '1px solid rgba(16, 185, 129, 0.4)',
                    boxShadow: '0 4px 16px rgba(16, 185, 129, 0.2)'
                  }}
                >
                  <span className="text-2xl font-bold text-emerald-400">2</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Report an Issue</h3>
                <p className="text-gray-300 mb-6">
                  Tap &ldquo;Submit a Report&rdquo;, take a photo of the issue, add a description, and select the appropriate category. Your location is automatically captured.
                </p>
                <div 
                  className="rounded-lg p-4"
                  style={{
                    background: 'rgba(15, 23, 42, 0.4)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.08)'
                  }}
                >
                  <svg className="w-8 h-8 text-emerald-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>

              {/* Step 3 */}
              <div 
                className="text-center p-6 rounded-2xl"
                style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                }}
              >
                <div 
                  className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center"
                  style={{
                    background: 'rgba(245, 158, 11, 0.3)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: '1px solid rgba(245, 158, 11, 0.4)',
                    boxShadow: '0 4px 16px rgba(245, 158, 11, 0.2)'
                  }}
                >
                  <span className="text-2xl font-bold text-amber-400">3</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Track Progress</h3>
                <p className="text-gray-300 mb-6">
                  Monitor your report&rsquo;s status in real-time. Get notified when authorities acknowledge, investigate, or resolve your submitted issue.
                </p>
                <div 
                  className="rounded-lg p-4"
                  style={{
                    background: 'rgba(255, 255, 255, 0.06)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
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
                  background: 'rgba(15, 23, 42, 0.6)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                }}
              >
                <h3 className="text-2xl font-bold text-white mb-4">Ready to Make a Difference?</h3>
                <p className="text-gray-300 mb-6 max-w-md mx-auto">
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
    </PerformanceMonitor>
  );
}