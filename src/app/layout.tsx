import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Sistem Informasi Manajemen BPP',
  description: 'Sistem Informasi Manajemen Balai Penyuluhan Pertanian',
  generator: 'Next.js',
  manifest: '/manifest.json', // ✅ Link ke manifest
  keywords: ['Next.js', 'Next14', 'PWA', 'next-pwa', 'Sistem Informasi BPP'],
  themeColor: [{ media: '(prefers-color-scheme: dark)', color: '#ffffff' }],
  authors: [
    {
      name: 'TIM SIM-BPP',
      url: 'https://example.com', // opsional, bisa diganti dengan situs resmi nanti
    },
  ],
  viewport:
    'minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover',
  icons: [
    { rel: 'apple-touch-icon', url: '/icons/Pemalang-512.png' },
    { rel: 'icon', url: '/icons/Pemalang-512.png' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}>
      <html lang="id">
        <head>
          {/* Tambahan meta dan link untuk manifest */}
          <meta name="theme-color" content="#ffffff" />
          <link rel="manifest" href="/manifest.json" />
          <link rel="icon" href="/icons/Pemalang-512.png" />
          <link rel="apple-touch-icon" href="/icons/Pemalang-512.png" />
        </head>
        <body className={inter.className}>
          {children}
          <ToastContainer position="bottom-right" theme="dark" />
        </body>
      </html>
    </ClerkProvider>
  );
}
