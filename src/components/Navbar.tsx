// src/components/Navbar.tsx
'use client';

import React from 'react';
import { UserButton, useUser } from '@clerk/nextjs';
import Image from 'next/image';

const Navbar = () => {
  const { isLoaded, isSignedIn, user } = useUser();

  // Saat hook belum siap: tampilkan skeleton / placeholder sederhana
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-between p-4">
        {/* SEARCH BAR (skeleton) */}
        <div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
          <Image src="/search.png" alt="" width={14} height={14} />
          <input
            type="text"
            placeholder="Search..."
            className="w-[200px] p-2 bg-transparent outline-none"
            disabled
          />
        </div>

        {/* ICONS + LOADING INFO */}
        <div className="flex items-center gap-6 justify-end w-full">
          <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer">
            <Image src="/message.png" alt="" width={20} height={20} />
          </div>
          <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative">
            <Image src="/pengumuman.png" alt="" width={20} height={20} />
            <div className="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-purple-500 text-white rounded-full text-xs">
              1
            </div>
          </div>

          <div className="flex flex-col text-right">
            <span className="text-xs leading-3 font-medium">Loading...</span>
            <span className="text-[10px] text-gray-500">—</span>
          </div>

          {/* kosongkan UserButton sementara agar UI konsisten */}
          <div className="w-8 h-8" />
        </div>
      </div>
    );
  }

  // Jika user belum login / tidak ada sesi
  if (!isSignedIn || !user) {
    return (
      <div className="flex items-center justify-between p-4">
        <span className="text-sm text-red-500">
          Tidak ada sesi pengguna. Silakan login terlebih dahulu.
        </span>
      </div>
    );
  }

  // Ambil data user aman (dengan fallback)
  const role = (user.publicMetadata?.role as string) || 'guest';
  const fullName =
    user.fullName || (user.username as string) || 'User Tanpa Nama';

  return (
    <div className="flex items-center justify-between p-4">
      {/* SEARCH BAR */}
      <div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
        <Image src="/search.png" alt="" width={14} height={14} />
        <input
          type="text"
          placeholder="Search..."
          className="w-[200px] p-2 bg-transparent outline-none"
        />
      </div>

      {/* ICONS AND USER */}
      <div className="flex items-center gap-6 justify-end w-full">
        <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer">
          <Image src="/message.png" alt="" width={20} height={20} />
        </div>

        <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative">
          <Image src="/pengumuman.png" alt="" width={20} height={20} />
          <div className="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-purple-500 text-white rounded-full text-xs">
            1
          </div>
        </div>

        <div className="flex flex-col text-right">
          <span className="text-xs leading-3 font-medium">{fullName}</span>
          <span className="text-[10px] text-gray-500">{role}</span>
        </div>

        <UserButton />
      </div>
    </div>
  );
};

export default Navbar;
