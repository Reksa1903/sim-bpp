// next.config.mjs
import withPWA from 'next-pwa';

const isDev = process.env.NODE_ENV !== 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: { removeConsole: process.env.NODE_ENV !== 'development' },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.pexels.com', pathname: '/**' },
      { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**' },
    ],
    domains: ['res.cloudinary.com'],
  },

  // ⬇️ REWRITES WAJIB di dalam objek config
  async rewrites() {
    const api = process.env.NEXT_PUBLIC_CLERK_FRONTEND_API; // e.g. balanced-salmon-2.clerk.accounts.dev
    if (!api) return [];

    return [
      // asset statis Clerk (JS/CSS/font) dari clerk.services
      { source: '/clerk/npm@clerk/:path*', destination: 'https://clerk.services/npm@clerk/:path*' },
      { source: '/clerk/assets/:path*', destination: 'https://clerk.services/assets/:path*' },

      // semua endpoint lain ke Frontend API milik instance kamu
      { source: '/clerk/:path*', destination: `https://${api}/:path*` },
      { source: '/clerk', destination: `https://${api}` },
    ];
  },
};

// PWA (tetap boleh)
export default withPWA({
  dest: 'public',
  disable: true,
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    // jangan cache halaman/auth & rute clerk
    { urlPattern: /^\/(sign-in|sign-up)(\/.*)?$/, handler: 'NetworkOnly' },
    { urlPattern: /^\/clerk\/.*/, handler: 'NetworkOnly' },

    // rsc/flight, api, image optimizer (aman di-network only)
    { urlPattern: ({ url }) => url.searchParams && url.searchParams.has('_rsc'), handler: 'NetworkOnly' },
    { urlPattern: /^\/(api|trpc)\//, handler: 'NetworkOnly' },
    { urlPattern: /^\/_next\/image/, handler: 'NetworkOnly' },

    // static chunks
    {
      urlPattern: /^\/_next\/static\//,
      handler: 'CacheFirst',
      options: { cacheName: 'next-static-chunks', expiration: { maxEntries: 64, maxAgeSeconds: 60 * 60 * 24 * 30 } },
    },
    // gambar lokal (opsional)
    {
      urlPattern: ({ url }) => url.origin === self.location.origin && (url.pathname.startsWith('/uploads') || url.pathname.startsWith('/photos')),
      handler: 'StaleWhileRevalidate',
      options: { cacheName: 'app-images', expiration: { maxEntries: 256, maxAgeSeconds: 60 * 60 * 24 * 30 } },
    },
  ],
})(nextConfig);
