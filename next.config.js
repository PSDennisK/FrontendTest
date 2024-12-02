/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  images: {
    formats: ['image/webp'],
    deviceSizes: [350, 640, 750, 828, 1080, 1200],
    imageSizes: [65, 96, 128, 256, 350],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'permalink.psinfoodservice.com',
        port: '',
        pathname: '/prod/image/**',
      },
      {
        protocol: 'https',
        hostname: 'permalink.psinfoodservice.com',
        port: '',
        pathname: '/prod/image/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.psinfoodservice.com',
        port: '',
        pathname: '/images/productsheet/**',
      },
      {
        protocol: 'https',
        hostname: 'foodbook.psinfoodservice.com',
        port: '',
        pathname: '/prod/**',
      },
      {
        protocol: 'https',
        hostname: 'psinfoodservice.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'site.psinfoodservice.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'vumbnail.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};
module.exports = nextConfig;
