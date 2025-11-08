// next.config.mjs
import withPWA from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: "build", // folder hasil build
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    // Hapus console.log di mode production
    removeConsole: process.env.NODE_ENV !== "development",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
    domains: ['res.cloudinary.com'],
  },
};

// ✅ Bungkus konfigurasi Next.js dengan next-pwa
export default withPWA({
  dest: "public", // hasil file service worker akan disimpan di /public
  disable: process.env.NODE_ENV === "development", // PWA nonaktif di dev mode
  register: true, // auto register service worker
  skipWaiting: true, // langsung aktif setelah update
  output: 'standalone',
})(nextConfig);
