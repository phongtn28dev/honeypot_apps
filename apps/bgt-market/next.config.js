//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/next');
const path = require('path');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    // Set this to true if you would like to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
  reactStrictMode: false,
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
        port: '',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        port: '',
        hostname: 'upload.wikimedia.org',
      },
      {
        protocol: 'https',
        port: '',
        hostname: 'vphdxociarqnaxj6.public.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        port: '',
        hostname: 'upload.wikimedia.org',
      },
      {
        protocol: 'http',
        port: '3000',
        hostname: 'localhost',
      },
      {
        protocol: 'http',
        port: '5000',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        port: '',
        hostname: 'honeypotfinance.xyz',
      },
      {
        protocol: 'https',
        port: '',
        hostname: '*.honeypotfinance.xyz',
      },
      {
        protocol: 'https',
        port: '',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        port: '',
        hostname: 'cdn.alphakek.ai',
      },
      {
        protocol: 'https',
        port: '',
        hostname: 'pump.mypinata.cloud',
      },
    ],
    domains: ['cdn.alphakek.ai'],
  },

  transpilePackages: ['styled-components'],
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
];

module.exports = composePlugins(...plugins)(nextConfig);
