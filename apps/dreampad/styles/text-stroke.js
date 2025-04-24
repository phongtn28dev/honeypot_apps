const plugin = require('tailwindcss/plugin');

module.exports = plugin(function ({ addUtilities }) {
  addUtilities({
    '.text-stroke': {
      '-webkit-text-stroke': '1px currentColor',
    },
    '.text-stroke-2': {
      '-webkit-text-stroke': '2px currentColor',
    },
    '.text-stroke-3': {
      '-webkit-text-stroke': '3px currentColor',
    },
    '.text-stroke-4': {
      '-webkit-text-stroke': '4px currentColor',
    },
  });
});
