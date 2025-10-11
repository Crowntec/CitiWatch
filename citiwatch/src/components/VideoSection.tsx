"use client";

import { useScrollReveal } from "@/hooks/useScrollAnimations";

export default function VideoSection() {
  const titleAnimation = useScrollReveal({ threshold: 0.3 });
  const videoAnimation = useScrollReveal({ threshold: 0.2 });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Title */}
      <div 
        ref={titleAnimation.ref}
        className={`
          text-center mb-12 transition-all duration-1000 ease-out
          ${titleAnimation.isVisible 
            ? 'translate-y-0 opacity-100' 
            : 'translate-y-8 opacity-0'
          }
        `}
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 hover:scale-105 transition-transform duration-300">
          See CitiWatch in Action
        </h2>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Watch how citizens around the world are using CitiWatch to transform their communities and create positive change.
        </p>
      </div>

      {/* YouTube Video Container */}
      <div 
        ref={videoAnimation.ref}
        className={`
          relative rounded-2xl overflow-hidden shadow-2xl group transition-all duration-1200 ease-out
          hover:scale-[1.02] hover:shadow-3xl
          ${videoAnimation.isVisible 
            ? 'translate-y-0 opacity-100 scale-100' 
            : 'translate-y-12 opacity-0 scale-95'
          }
        `}
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
          transitionDelay: '0.3s'
        }}
      >
        {/* Glow effect on hover */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.2) 0%, transparent 70%)',
            filter: 'blur(20px)',
          }}
        />
        
        {/* Video Aspect Ratio Container */}
        <div className="relative w-full" style={{ paddingBottom: '56.25%' /* 16:9 aspect ratio */ }}>
          <iframe
            className="absolute top-0 left-0 w-full h-full transition-all duration-300 group-hover:scale-[1.01]"
            src="https://www.youtube.com/embed/uyIQ3n1MWSE?autoplay=0&mute=1&controls=1&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1"
            title="CitiWatch Demo Video - Smart City Solutions"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
          />
        </div>

        {/* Play Button Overlay (Optional) */}
        <div 
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-all duration-300 cursor-pointer backdrop-blur-sm"
          onClick={() => {
            const iframe = document.querySelector('#youtube-video-container iframe') as HTMLIFrameElement;
            if (iframe) {
              const src = iframe.src;
              iframe.src = src.replace('autoplay=0', 'autoplay=1');
            }
          }}
        >
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center transform hover:scale-110 transition-all duration-300 group-hover:shadow-2xl"
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
            }}
          >
            <svg className="w-8 h-8 text-gray-800 ml-1 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}