//@ts-check

const { composePlugins, withNx } = require('@nx/next');
const path = require('path');
const isProd = process.env.NODE_ENV === 'production';

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const baseConfig = {
  nx: {
    // Set this to true if you would like to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
  reactStrictMode: true,
  output: 'standalone',
  experimental: {
    optimizeCss: true,
    swcMinify: true,
  },
  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@honeypot/shared': path.resolve(__dirname, 'libs/shared/hpot-sdk/src'),
    };
    config.resolve.modules = [
      path.resolve(__dirname, 'libs/shared/hpot-sdk/src'), // 👈 prioritize shared library
      path.resolve(__dirname, 'node_modules'),
      'node_modules',
    ];

    // Optimize memory usage
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        cacheGroups: {
          default: false,
          vendors: false,
          commons: {
            name: 'commons',
            chunks: 'all',
            minChunks: 2,
          },
          vendor: {
            name: 'vendor',
            test: /[\\/]node_modules[\\/]/,
            chunks: 'all',
            priority: 10,
          },
        },
      },
      minimize: true,
    };

    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async headers() {
    return [
      {
        // matching all API routes
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://wasabee.honeypotfinance.xyz',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,DELETE,PATCH,POST,PUT',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
        ],
      },
      {
        source: '/_next/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ];
  },
  ...(isProd && {
    transpilePackages: [
      'styled-components',
      'viem',
      '@safe-global/safe-apps-sdk',
      '@safe-global/safe-apps-react-sdk',
      'framer-motion',
      '@rainbow-me/rainbowkit',
      'react-toastify',
    ],
  }),
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
];

module.exports = (customConfig = {}) =>
  withNx({ ...baseConfig, ...customConfig });
