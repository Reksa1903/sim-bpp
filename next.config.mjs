// next.config.mjs
import withPWA from 'next-pwa';

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

export default withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,

  // Penting: jangan jadikan _rsc bagian dari cache key precache
  workboxOptions: {
    ignoreURLParametersMatching: [/^utm_/, /^fbclid$/, /^_rsc$/],
  },

  // Jaga App Router & API: semua ini HARUS ke network
  runtimeCaching: [
    // 1) Data App Router (RSC/Flight)
    {
      urlPattern: ({ url }) => url.searchParams.has('_rsc'),
      handler: 'NetworkOnly',
    },
    // 2) API / TRPC
    {
      urlPattern: /^\/(api|trpc)\//,
      handler: 'NetworkOnly',
    },
    // 3) Next Image optimizer
    {
      urlPattern: /^\/_next\/image/,
      handler: 'NetworkOnly',
    },
    // 4) Static chunks – aman untuk cache
    {
      urlPattern: /^\/_next\/static\//,
      handler: 'CacheFirst',
      options: {
        cacheName: 'next-static-chunks',
        expiration: { maxEntries: 64, maxAgeSeconds: 60 * 60 * 24 * 30 },
      },
    },
    // 5) Gambar app (opsional)
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
  ],
})(nextConfig);
