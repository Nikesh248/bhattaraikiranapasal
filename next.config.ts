
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
  webpack: (config, { isServer }) => {
    // Exclude Node.js specific modules used by OpenTelemetry (a Genkit dependency)
    // from being incorrectly bundled for the browser.
    if (!isServer) {
      // Add 'fs' to the externals list along with 'async_hooks'
       config.externals = [...config.externals, 'async_hooks', 'fs'];
    }
    // Important: return the modified config
    return config;
  },
};

export default nextConfig;
