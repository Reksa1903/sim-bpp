// src/app/layout.tsx
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import NextDynamic from 'next/dynamic';

const inter = Inter({ subsets: ['latin'] });

// ⬇️ Pindahkan themeColor & viewport ke export viewport (bukan metadata)
export const metadata: Metadata = {
  title: 'Sistem Informasi Manajemen BPP',
  description: 'Sistem Informasi Manajemen Balai Penyuluhan Pertanian',
  generator: 'Next.js',
  manifest: '/manifest.json',
  keywords: ['Next.js', 'Next14', 'PWA', 'next-pwa', 'Sistem Informasi BPP'],
  authors: [{ name: 'TIM SIM-BPP', url: 'https://example.com' }],
  icons: [
    { rel: 'apple-touch-icon', url: '/icons/Pemalang-512.png' },
    { rel: 'icon', url: '/icons/Pemalang-512.png' },
  ],
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

// ⬇️ Import client wrapper tanpa SSR
import ClerkRoot from './ClerkRoot';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={inter.className}>
        {/* Semua provider klien dipindah ke ClerkRoot */}
        <ClerkRoot>{children}</ClerkRoot>
      </body>
    </html>
  );
}
