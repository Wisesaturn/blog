/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  webpack(config) {
    config.resolve.modules.push(__dirname);
    return config;
  },
};
