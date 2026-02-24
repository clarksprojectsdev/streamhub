/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: '/categories/:slug', destination: '/category/:slug', permanent: true },
    ];
  },
};

module.exports = nextConfig;
