
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      { // Add new pattern for coca-cola.com
        protocol: 'https',
        hostname: 'www.coca-cola.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Add webpack configuration
  webpack: (config, { isServer, dev }) => {
    // Exclude Node.js specific modules used by OpenTelemetry (a Genkit dependency)
    // from being incorrectly bundled for the browser.
    if (!isServer) {
      // Add 'fs' to the externals list along with 'async_hooks'
       config.externals = [...config.externals, 'async_hooks', 'fs'];
    }

    if (!dev && isServer) {
      config.optimization = {
        ...config.optimization,
        minimize: true, // Ensure code is minified in production
      };
    }

    // Important: return the modified config
    return config;
  },
  experimental: {
    // Enable SWC minification for faster builds
    swcMinify: true,
    // Enable optimizing CSS for smaller bundles
    optimizeCss: true,
    // Enable instrumentation hook for webpack build
    webpackBuildInstrumentation: true,
  },
};

export default nextConfig;
