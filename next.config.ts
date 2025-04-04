// next.config.ts
import type { NextConfig } from 'next';
import { PHASE_PRODUCTION_BUILD } from 'next/constants';
import type { Configuration as WebpackConfig } from 'webpack';

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
  const isProd = phase === PHASE_PRODUCTION_BUILD || process.env.NODE_ENV === 'production';
  const bundleAnalyzer = await getBundleAnalyzer();
  
  const baseConfig: NextConfig = {
    reactStrictMode: true,
    compress: true,
    
    // Added: transpile react-icons to fix module resolution issues
    transpilePackages: ['react-icons'],
    
    // Configure image optimization
    images: {
      formats: ['image/avif', 'image/webp'],
      domains: [], 
      deviceSizes: [640, 750, 828, 1080, 1200, 1920],
      imageSizes: [16, 32, 48, 64, 96, 128, 256],
    },
    
    // Experimental features for performance
    experimental: {
      optimizeCss: isProd,
      scrollRestoration: true,
      // Fixed: serverActions needs proper configuration instead of boolean
      serverActions: {
        bodySizeLimit: '2mb',
        allowedOrigins: ['*'],
      },
      // Improved code generation
      serverComponentsExternalPackages: [],
      // Removed: HMR optimizations as 'hmr' is not a valid property
    },
    
    // Enhanced webpack configuration for better performance
    webpack: (config: WebpackConfig, { dev, isServer }): WebpackConfig => {
      // Add module alias for react-icons/fa6
      config.resolve = {
        ...config.resolve,
        alias: {
          ...config.resolve?.alias,
          'react-icons/fa6': 'react-icons/fa',
        },
        fallback: {
          ...(config.resolve?.fallback || {}),
          fs: false,
        },
      };
      
      // Add snapshot configuration to improve module resolution during HMR
      config.snapshot = {
        ...(config.snapshot || {}),
        managedPaths: [/^(.+?[\\/]node_modules[\\/])(.*)[\\/]*/],
      };
      
      // Only optimize in production
      if (!dev && !isServer) {
        // Optimize module concatenation
        if (config.optimization) {
          // More aggressive code splitting strategy
          config.optimization.splitChunks = {
            chunks: 'all',
            minSize: 10000,
            maxSize: 50000, // Smaller chunk size for faster loading
            minChunks: 1,
            maxAsyncRequests: 30,
            maxInitialRequests: 30,
            cacheGroups: {
              framework: {
                test: /[\\/]node_modules[\\/](react|react-dom|next)[\\/]/,
                name: 'framework',
                priority: 40,
                chunks: 'all',
                enforce: true,
              },
              // Separate framer-motion into its own chunk
              motion: {
                test: /[\\/]node_modules[\\/](framer-motion)[\\/]/,
                name: 'motion',
                priority: 35,
                chunks: 'all',
              },
              // Separate react-icons into its own chunk to improve HMR
              icons: {
                test: /[\\/]node_modules[\\/](react-icons|@heroicons)[\\/]/,
                name: 'icons',
                priority: 37, // Higher than lib priority
                chunks: 'all',
                enforce: true, // Added enforce: true
              },
              // Break down lib chunks into smaller pieces
              lib: {
                test: /[\\/]node_modules[\\/](!react)(!react-dom)(!next)(!framer-motion)(!react-icons)(!@heroicons)[\\/]/,
                name(module: any) {
                  // Get the name of the npm package
                  const packageName = module.context.match(
                    /[\\/]node_modules[\\/](.*?)([\\/]|$)/
                  )[1];
                  
                  // Group larger packages separately, and group smaller ones together
                  const bigPackages = ['lodash', '@mui', '@emotion', 'chart.js', 'date-fns'];
                  for (const pkg of bigPackages) {
                    if (packageName.startsWith(pkg)) {
                      return `lib-${pkg.replace('@', '')}`;
                    }
                  }
                  
                  // npm package names are URL-safe, but some servers don't like @ symbols
                  return `lib-shared`;
                },
                priority: 30,
                chunks: 'all',
                reuseExistingChunk: true,
              },
              commons: {
                name: 'commons',
                minChunks: 2,
                priority: 10,
                reuseExistingChunk: true,
              },
            },
          };
          
          // Add more aggressive optimizations
          config.optimization.runtimeChunk = 'single';
          if (!config.optimization.minimizer) {
            config.optimization.minimizer = [];
          }
        }
        
        // Use brotli compression when possible
        if (config.plugins) {
          // Add any additional plugins here
        }
      }
      
      return config;
    },
    
    // Enhanced caching headers
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
        // Add improved caching for API routes if they don't change often
        {
          source: '/api/static/:path*',
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, max-age=3600, s-maxage=86400',
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
    
    // Add production-only outputs for better Vercel performance
    output: isProd ? 'standalone' : undefined,
    
    // Configure production source maps 
    productionBrowserSourceMaps: false,
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
export default setupNextConfig();