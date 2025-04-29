
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
    // Exclude 'async_hooks' from client-side bundles
    // This prevents Node.js specific modules used by OpenTelemetry (a Genkit dependency)
    // from being incorrectly bundled for the browser.
    if (!isServer) {
      // config.resolve.fallback = {
      //   ...config.resolve.fallback,
      //   async_hooks: false, // Mark async_hooks as not available on the client
      // };
       // Alternatively, treat it as external
       config.externals = [...config.externals, 'async_hooks'];
    }
    // Important: return the modified config
    return config;
  },
};

export default nextConfig;
