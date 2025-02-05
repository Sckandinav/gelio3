// config-overrides.js
module.exports = function override(config) {
  config.resolve.alias = {
    ...config.resolve.alias,
    '@mui/styled-engine': '@mui/styled-engine-sc',
  };
  return config;
};
