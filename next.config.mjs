// next.config.mjs
import withPWA from 'next-pwa'

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
}

export async function rewrites() {
  const api = process.env.NEXT_PUBLIC_CLERK_FRONTEND_API // ex: balanced-salmon-2.clerk.accounts.dev
  return {
    beforeFiles: [
      // 1) Asset Clerk (JS/CSS/fonts) dari clerk.services
      { source: '/clerk/npm@clerk/:path*', destination: 'https://clerk.services/npm@clerk/:path*' },
      { source: '/clerk/assets/:path*', destination: 'https://clerk.services/assets/:path*' },

      // 2) Sisanya (API/pages) ke frontend API dev kamu
      { source: '/clerk/:path*', destination: `https://${api}/:path*` },
      { source: '/clerk', destination: `https://${api}` },
    ],
  }
}

export default withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,

  // Lindungi App Router & API dari SW
  runtimeCaching: [
    // App Router RSC/Flight data
    { urlPattern: ({ url }) => url.searchParams.has('_rsc'), handler: 'NetworkOnly' },
    // API / TRPC
    { urlPattern: /^\/(api|trpc)\//, handler: 'NetworkOnly' },
    // Next image optimizer
    { urlPattern: /^\/_next\/image/, handler: 'NetworkOnly' },

    // Static chunks
    {
      urlPattern: /^\/_next\/static\//,
      handler: 'CacheFirst',
      options: {
        cacheName: 'next-static-chunks',
        expiration: { maxEntries: 64, maxAgeSeconds: 60 * 60 * 24 * 30 },
      },
    },

    // Gambar lokal app (opsional)
    {
      urlPattern: ({ url }) =>
        url.origin === self.location.origin &&
        (url.pathname.startsWith('/uploads') || url.pathname.startsWith('/photos')),
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'app-images',
        expiration: { maxEntries: 256, maxAgeSeconds: 60 * 60 * 24 * 30 },
      },
    },

    // ⬇️ Jangan pernah cache halaman auth & Clerk
    { urlPattern: /^\/(sign-in|sign-up)(\/.*)?$/, handler: 'NetworkOnly' },
    { urlPattern: ({ url }) => url.pathname.startsWith('/clerk/'), handler: 'NetworkOnly' },
  ],
})(nextConfig)
