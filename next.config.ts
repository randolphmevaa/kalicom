// next.config.ts
import type { NextConfig } from 'next';
import { PHASE_PRODUCTION_BUILD } from 'next/constants';

// Define webpack module for proper typing
import type { Configuration as WebpackConfig } from 'webpack';

// For bundle analyzer, we need to conditionally import it
// This helper type handles conditional imports
type BundleAnalyzer = (config: NextConfig) => NextConfig;

/**
 * Get a configured Bundle Analyzer if enabled
 */
const getBundleAnalyzer = async (): Promise<BundleAnalyzer | null> => {
  if (process.env.ANALYZE === 'true') {
    const { default: withBundleAnalyzer } = await import('@next/bundle-analyzer');
    return withBundleAnalyzer({
      enabled: process.env.ANALYZE === 'true',
    });
  }
  return null;
};

/**
 * Configure Next.js, with environment-specific settings
 */
const configureNext = async (phase: string): Promise<NextConfig> => {
  // Check if we're in production build
  const isProd = phase === PHASE_PRODUCTION_BUILD || process.env.NODE_ENV === 'production';
  
  // Import and configure bundle analyzer if needed
  const bundleAnalyzer = await getBundleAnalyzer();
  
  // Base configuration
  const baseConfig: NextConfig = {
    reactStrictMode: true,
    
    // Static file compression
    compress: true,
    
    // Configure image optimization
    images: {
      formats: ['image/avif', 'image/webp'],
      // Add your domain if you're loading external images
      domains: [], 
      deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
      imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    },
    
    // Experimental features for performance
    experimental: {
      // Optimize CSS for production
      optimizeCss: isProd,
      // Improve scroll performance
      scrollRestoration: true,
      // Removed 'appDir' as it is not a valid property
    },
    
    // Webpack configuration for better performance
    webpack: (config: WebpackConfig, { dev, isServer }): WebpackConfig => {
      // Only optimize in production
      if (!dev && !isServer) {
        // Optimize module concatenation
        if (config.optimization) {
          // Properly split chunks for better loading
          config.optimization.splitChunks = {
            chunks: 'all',
            minSize: 20000,
            maxSize: 90000, // Limit chunk size
            minChunks: 1,
            maxAsyncRequests: 30,
            maxInitialRequests: 30,
            cacheGroups: {
              framework: {
                test: /[\\/]node_modules[\\/](react|react-dom|next|framer-motion)[\\/]/,
                name: 'framework',
                priority: 40,
                chunks: 'all',
                enforce: true,
              },
              lib: {
                test: /[\\/]node_modules[\\/]/,
                name: 'lib',
                priority: 30,
                chunks: 'all',
              },
              icons: {
                test: /[\\/]node_modules[\\/]react-icons[\\/]/,
                name: 'icons',
                priority: 20,
                chunks: 'all',
              },
              commons: {
                name: 'commons',
                minChunks: 2,
                priority: 10,
                reuseExistingChunk: true,
              },
            },
          };
        }
        
        // Additional optimizations
        if (config.module?.rules) {
          // Add any module rule optimizations here
        }
      }
      
      return config;
    },
    
    // Add headers for better caching and performance
    async headers() {
      return [
        {
          source: '/images/:path*',
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, max-age=31536000, immutable',
            },
          ],
        },
        {
          source: '/fonts/:path*',
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, max-age=31536000, immutable',
            },
          ],
        },
        {
          source: '/_next/static/:path*',
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, max-age=31536000, immutable',
            },
          ],
        },
      ];
    },
    
    // Remove console logs in production
    compiler: {
      removeConsole: isProd ? {
        exclude: ['error', 'warn'],
      } : false,
    },
    
    // Increase static generation concurrency for better build performance
    staticPageGenerationTimeout: 120,
    
    // Configure other build settings
    poweredByHeader: false,
    generateEtags: true,
  };
  
  // Apply bundle analyzer if configured
  let config = baseConfig;
  if (bundleAnalyzer) {
    config = bundleAnalyzer(config);
  }
  
  return config;
};

// Set up for immediate or async configuration
const setupNextConfig = async () => {
  const phase = process.env.NEXT_PHASE || '';
  return await configureNext(phase);
};

// This is necessary for Next.js to properly handle the async config
// Note: Next.js expects a synchronous export, so we use this pattern
export default setupNextConfig();