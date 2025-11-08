// src/app/not-found.tsx
import Link from 'next/link';
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = { title: 'Halaman tidak ditemukan' };
export const viewport: Viewport = {
  themeColor: '#0D9252',
  width: 'device-width',
  initialScale: 1,
};

export default function NotFound() {
  return (
    <div className="min-h-[60vh] grid place-items-center p-6 text-center">
      <div>
        <h1 className="text-2xl font-semibold mb-2">404 – Tidak ditemukan</h1>
        <p className="text-gray-600 mb-6">Halaman yang kamu cari tidak tersedia.</p>
        <Link href="/" className="text-BppGreen underline">Kembali ke beranda</Link>
      </div>
    </div>
  );
}
