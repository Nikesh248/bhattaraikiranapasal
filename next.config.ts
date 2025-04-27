
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
};

export default nextConfig;
