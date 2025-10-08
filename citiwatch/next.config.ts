import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // Enable experimental features
  experimental: {
    optimizePackageImports: ['@heroicons/react'],
  },
  
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'citiwatch-kappa.vercel.app/',
      },
      {
        protocol: 'https', 
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Headers for security and SEO
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self)',
          },
        ],
      },
    ];
  },
  
  // Compression and performance
  compress: true,
  poweredByHeader: false,
  
  // Static files handling and API proxy for production
  async rewrites() {
    const rewrites = [
      {
        source: '/robots.txt',
        destination: '/api/robots',
      },
    ];

    // Add API proxy rewrites for production to avoid mixed content issues
    if (process.env.NODE_ENV === 'production') {
      rewrites.push({
        source: '/api/proxy/:path*',
        destination: 'http://citiwatch.runasp.net/api/:path*',
      });
    }

    return rewrites;
  },
};

export default nextConfig;
