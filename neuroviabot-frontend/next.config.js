/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Fast Refresh - Hot reload for development
  swcMinify: true,
  
  // Next.js 15 optimizations
  turbopack: {
    resolveAlias: {
      '@': './',
    },
  },
  
  // Webpack config for hot reload
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 500, // Check for changes every 500ms (more aggressive)
        aggregateTimeout: 200, // Faster rebuild
        ignored: ['**/node_modules', '**/.git', '**/.next'],
      };
      
      // Disable cache for development
      config.cache = false;
      
      // Enable hot module replacement
      config.optimization = {
        ...config.optimization,
        moduleIds: 'named',
      };
    }
    return config;
  },
  
  // Production build optimizations
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Type checking happens during build, don't block deployment
    ignoreBuildErrors: false,
  },
  
  // Output configuration
  output: 'standalone',
  
  // Experimental features for Next.js 15
  experimental: {
    // optimizeCss: true, // Disabled - requires 'critters' package
    optimizePackageImports: ['framer-motion', '@heroicons/react'],
  },
  
  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_BOT_CLIENT_ID: process.env.NEXT_PUBLIC_BOT_CLIENT_ID,
  },
  
  // Image optimization
  images: {
    domains: ['cdn.discordapp.com', 'i.scdn.co'],
    formats: ['image/avif', 'image/webp'],
  },
  
  // Headers for security
  async headers() {
    return [
      {
        source: '/:path*',
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
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  
  // Redirects
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/dashboard/overview',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
