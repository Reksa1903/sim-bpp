'use client';

import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const menuItems = [
  {
    title: 'MENU',
    items: [
      {
        icon: '/home.png',
        label: 'Home',
        href: '/',
        visible: ['admin', 'penyuluh', 'kelompoktani'],
      },
      {
        icon: '/penyuluh.png',
        label: 'Penyuluh Pertanian',
        href: '/list/parapenyuluh',
        visible: ['admin', 'penyuluh', 'kelompoktani'],
      },
      {
        icon: '/kelompoktani.png',
        label: 'Kelompok Tani',
        href: '/list/parakelompoktani',
        visible: ['admin', 'penyuluh'],
      },
      {
        icon: '/DesaBinaan.png',
        label: 'Desa Binaan',
        href: '/list/desabinaan',
        visible: ['admin', 'penyuluh', 'kelompoktani'],
      },
      {
        icon: '/kiospertanian.png',
        label: 'Kios Pertanian',
        href: '/list/parakiospertanian',
        visible: ['admin', 'penyuluh', 'kelompoktani'],
      },
      {
        icon: '/materi.png',
        label: 'Materi',
        href: '/list/materi',
        visible: ['admin', 'penyuluh', 'kelompoktani'],
      },
      {
        icon: '/acara.png',
        label: 'Kegiatan',
        href: '/list/kegiatan',
        visible: ['admin', 'penyuluh', 'kelompoktani'],
      },
      {
        icon: '/dokumentasi.png',
        label: 'Dokumentasi Acara',
        href: '/list/dokumentasiacara',
        visible: ['admin', 'penyuluh'],
      },
      {
        icon: '/pengumuman.png',
        label: 'Pengumuman',
        href: '/list/pengumuman',
        visible: ['admin', 'penyuluh', 'kelompoktani'],
      },
    ],
  },
  {
    title: 'LAINNYA',
    items: [
      {
        icon: '/profil.png',
        label: 'Profil',
        href: '/profil',
        visible: ['admin', 'penyuluh', 'kelompoktani'],
      },
      {
        icon: '/pengaturan.png',
        label: 'Pengaturan',
        href: '/pengaturan',
        visible: ['admin', 'penyuluh', 'kelompoktani'],
      },
      {
        icon: '/logout.png',
        label: 'Logout',
        href: '/logout',
        visible: ['admin', 'penyuluh', 'kelompoktani'],
      },
    ],
  },
];

const Menu = () => {
  const { user, isLoaded } = useUser();
  const [role, setRole] = useState<string | null>(null);

  // Ambil role dari metadata setelah Clerk siap
  useEffect(() => {
    if (isLoaded && user) {
      const userRole = user.publicMetadata.role as string;
      setRole(userRole);
    }
  }, [isLoaded, user]);

  // Saat data belum siap
  if (!isLoaded) {
    return (
      <div className="mt-4 text-sm text-gray-400 animate-pulse">
        Memuat menu...
      </div>
    );
  }

  // Kalau user belum login
  if (!user || !role) {
    return (
      <div className="mt-4 text-sm text-red-500">
        Tidak ada sesi pengguna. Silakan login dulu.
      </div>
    );
  }

  return (
    <div className="mt-4 text-sm">
      {menuItems.map((section) => (
        <div className="flex flex-col gap-2" key={section.title}>
          <span className="hidden lg:block text-gray-400 font-light my-4">
            {section.title}
          </span>
          {section.items.map((item) => {
            if (item.visible.includes(role)) {
              return (
                <Link
                  href={item.href}
                  key={item.label}
                  className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-BppLightGreen transition-colors"
                >
                  <Image
                    src={item.icon}
                    alt={item.label}
                    width={20}
                    height={20}
                  />
                  <span className="hidden lg:block">{item.label}</span>
                </Link>
              );
            }
            return null;
          })}
        </div>
      ))}
    </div>
  );
};

export default Menu;
