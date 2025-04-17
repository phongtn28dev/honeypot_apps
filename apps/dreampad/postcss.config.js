const { join } = require('path');

/** @type {import('postcss').Config} */
module.exports = {
  plugins: {
    'tailwindcss/nesting': {},
    tailwindcss: {
      config: join(__dirname, 'tailwind.config.ts'),
    },
    autoprefixer: {},
    ...(process.env.NODE_ENV === 'production' ? { cssnano: {} } : {}),
  },
};
