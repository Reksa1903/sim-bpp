// next.config.mjs
import withPWA from "next-pwa";

const isDev = process.env.NODE_ENV !== "production";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // HAPUS: distDir
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV !== "development",
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.pexels.com", pathname: "/**" },
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
    ],
    domains: ["res.cloudinary.com"],
  },
  // JANGAN pakai output: 'export' untuk proyek ini
  // (Opsional) output: 'standalone' tidak wajib di Vercel
};

export default withPWA({
  dest: "public",
  disable: isDev,     // nonaktif saat development
  register: true,
  skipWaiting: true,
})(nextConfig);
