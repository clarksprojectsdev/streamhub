/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'placehold.co' },
    ],
  },
  async redirects() {
    return [
      { source: '/categories/:slug', destination: '/category/:slug', permanent: true },
    ];
  },
};

module.exports = nextConfig;
