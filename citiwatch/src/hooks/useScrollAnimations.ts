"use client";

import { useEffect, useState, useCallback } from 'react';

interface ScrollAnimationConfig {
  threshold?: number;
  rootMargin?: string;
}

export function useScrollReveal(config: ScrollAnimationConfig = {}) {
  const [isVisible, setIsVisible] = useState(false);
  const [elementRef, setElementRef] = useState<Element | null>(null);

  const ref = useCallback((node: Element | null) => {
    setElementRef(node);
  }, []);

  useEffect(() => {
    if (!elementRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(elementRef);
        }
      },
      {
        threshold: config.threshold || 0.1,
        rootMargin: config.rootMargin || '0px 0px -50px 0px',
      }
    );

    observer.observe(elementRef);

    return () => {
      if (elementRef) observer.unobserve(elementRef);
    };
  }, [elementRef, config.threshold, config.rootMargin]);

  return { ref, isVisible };
}

export function useParallaxScroll(speed: number = 0.5) {
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setOffsetY(window.pageYOffset * speed);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return offsetY;
}

export function useMouseParallax(sensitivity: number = 0.02) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX - window.innerWidth / 2) * sensitivity;
      const y = (e.clientY - window.innerHeight / 2) * sensitivity;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [sensitivity]);

  return mousePosition;
}