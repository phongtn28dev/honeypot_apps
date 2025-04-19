/** @type {import('next').NextConfig} */
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const isDev = process.env.NODE_ENV === 'development';
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    config.resolve.modules = [
      path.resolve(__dirname, '../../node_modules'), // 👈 prioritize root
      'node_modules', // fallback to local
    ];
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*',
      },
      {
        protocol: 'http',
        hostname: '*',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/launchpad-projects',
        permanent: false,
      },
    ];
  },
  transpilePackages: [
    '@honeypot-frontend/hpot-sdk',
    '@usecapsule/rainbowkit-wallet',
    '@usecapsule/rainbowkit',
    '@usecapsule/core-components',
    '@usecapsule/react-components',
    '@usecapsule/react-sdk',
    '@usecapsule/core-sdk',
    '@usecapsule/web-sdk',
    '@usecapsule/wagmi-v2-integration',
    '@usecapsule/viem-v2-integration',
    '@usecapsule/react-common',
    'styled-components',
  ],
};

export default nextConfig;
