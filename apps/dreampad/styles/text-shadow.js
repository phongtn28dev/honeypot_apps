const plugin = require('tailwindcss/plugin');

module.exports = plugin(function ({ addUtilities }) {
  addUtilities({
    '.text-shadow': {
      'text-shadow': '2px 2px 4px rgba(0, 0, 0, 0.3)',
    },
    '.text-shadow-sm': {
      'text-shadow': '1px 1px 2px rgba(0, 0, 0, 0.2)',
    },
    '.text-shadow-lg': {
      'text-shadow': '4px 4px 8px rgba(0, 0, 0, 0.4)',
    },
    '.text-shadow-none': {
      'text-shadow': 'none',
    },
  });
});
