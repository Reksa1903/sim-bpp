// next.config.mjs
import pkg from 'next-pwa';
const nextPWA = pkg.default ?? pkg;

const isDev = process.env.NODE_ENV !== 'production';

const withPWA = nextPWA({
  dest: 'public',
  disable: isDev,
  register: true,
  skipWaiting: true,
  // FIX untuk Next 13/14 + next-pwa 5.6
  runtimeCaching: [],
  buildExcludes: [/app-build-manifest\.json$/],
});

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV !== 'development',
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.pexels.com', pathname: '/**' },
      { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**' },
    ],
    domains: ['res.cloudinary.com'],
  },
  async rewrites() {
    const api = process.env.NEXT_PUBLIC_CLERK_FRONTEND_API;
    if (!api) return [];
    return [
      { source: '/clerk/npm@clerk/:path*', destination: 'https://clerk.services/npm@clerk/:path*' },
      { source: '/clerk/assets/:path*', destination: 'https://clerk.services/assets/:path*' },
      { source: '/clerk/:path*', destination: `https://${api}/:path*` },
      { source: '/clerk', destination: `https://${api}` },
    ];
  },
};

export default withPWA(nextConfig);
