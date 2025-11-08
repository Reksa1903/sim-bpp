// next.config.mjs
import withPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
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
};

export async function rewrites() {
  const api = process.env.NEXT_PUBLIC_CLERK_FRONTEND_API; // contoh: balanced-salmon-2.clerk.accounts.dev
  return {
    beforeFiles: [
      { source: '/clerk/:path*', destination: `https://${api}/:path*` },
    ],
  };
}

export default withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,

  // Penting: lindungi request data App Router & API dari SW
  runtimeCaching: [
    // App Router RSC/Flight data
    { urlPattern: ({ url }) => url.searchParams.has('_rsc'), handler: 'NetworkOnly' },
    // API / TRPC
    { urlPattern: /^\/(api|trpc)\//, handler: 'NetworkOnly' },
    // Next image optimizer
    { urlPattern: /^\/_next\/image/, handler: 'NetworkOnly' },

    // Static chunks (aman dicache)
    {
      urlPattern: /^\/_next\/static\//,
      handler: 'CacheFirst',
      options: {
        cacheName: 'next-static-chunks',
        expiration: { maxEntries: 64, maxAgeSeconds: 60 * 60 * 24 * 30 },
      },
    },

    // Gambar aplikasi (opsional)
    {
      urlPattern: ({ url }) =>
        url.pathname.startsWith('/clerk/') || // proxy lokal
        url.hostname.endsWith('clerk.accounts.dev') ||
        url.hostname.endsWith('clerk.services'),
      handler: 'NetworkOnly',
      options: {
        cacheName: 'app-images',
        expiration: { maxEntries: 256, maxAgeSeconds: 60 * 60 * 24 * 30 },
      },
    },
  ],
})(nextConfig);
