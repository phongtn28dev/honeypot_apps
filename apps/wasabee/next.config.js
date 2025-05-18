// @ts-check
const withBaseConfig = require('../../next.base.config');

module.exports = withBaseConfig({
  redirects: async () => [
    {
      source: '/',
      destination: '/swap',
      permanent: false,
    },
  ],
});
