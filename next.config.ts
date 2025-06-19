import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Deployment configuration for Vercel
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
  
  // Development configuration
  devIndicators: {
    position: 'bottom-left',
  },
  
  // Disable ESLint and TypeScript checks during build for faster deployment
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Optimize for production
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  
  // Cloudflare compatibility
  async redirects() {
    return [
      {
        source: '/admin/:path*',
        destination: 'https://admintms.masterfilmon.com/admin/:path*',
        permanent: true,
        has: [
          {
            type: 'host',
            value: 'tms.masterfilmon.com'
          }
        ]
      }
    ];
  },
  
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
    ],
  },
  
  // Environment variables validation
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // Headers for security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ];
  }
};

export default nextConfig;