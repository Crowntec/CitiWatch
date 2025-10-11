"use client";

import { useState, useEffect } from 'react';

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when user scrolls down 300px
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Add scroll listener with throttling for better performance
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          toggleVisibility();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      className={`
        fixed bottom-8 right-8 z-50 
        w-14 h-14 rounded-2xl 
        flex items-center justify-center
        transition-all duration-500 ease-out
        group cursor-pointer
        ${isVisible 
          ? 'translate-y-0 opacity-100 scale-100 pointer-events-auto' 
          : 'translate-y-16 opacity-0 scale-50 pointer-events-none'
        }
      `}
      style={{
        background: isHovered 
          ? 'rgba(255, 255, 255, 0.25)' 
          : 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: isHovered
          ? '0 20px 40px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.4)'
          : '0 10px 30px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={scrollToTop}
      aria-label="Scroll to top"
    >
      {/* Animated background glow */}
      <div 
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.3) 0%, transparent 70%)',
        }}
      />
      
      {/* Arrow icon with animation */}
      <svg 
        className={`
          w-6 h-6 text-white relative z-10
          transition-all duration-300 ease-out
          ${isHovered ? 'transform -translate-y-0.5 scale-110' : ''}
        `}
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
        style={{
          filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))'
        }}
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2.5} 
          d="M5 15l7-7 7 7" 
        />
      </svg>

      {/* Ripple effect on click */}
      <div 
        className="absolute inset-0 rounded-2xl opacity-0 group-active:opacity-100 transition-opacity duration-150"
        style={{
          background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.4) 0%, transparent 50%)',
        }}
      />
    </button>
  );
}