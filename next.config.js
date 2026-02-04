/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'thumb-cdn77.others-cdn.com' },
      { protocol: 'https', hostname: 'img-hw.xvideos-cdn.com' },
    ],
  },
  async redirects() {
    return [
      { source: '/categories/:slug', destination: '/category/:slug', permanent: true },
    ];
  },
};

module.exports = nextConfig;
