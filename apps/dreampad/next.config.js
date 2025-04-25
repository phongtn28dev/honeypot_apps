// @ts-check
const withBaseConfig = require('../../next.base.config');

module.exports = withBaseConfig({
  redirects: async () => [
    {
      source: '/',
      destination: '/launchpad-projects',
    },
  ],
});
