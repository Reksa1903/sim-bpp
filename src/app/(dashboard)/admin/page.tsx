'use client';

// src/app/(dashboard)/admin/page.tsx
console.log('🔍 BUILD-TIME ENV CHECK:', {
  DATABASE_URL: process.env.DATABASE_URL,
  DIRECT_URL: process.env.DIRECT_URL,
  CLERK_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
});

import { useEffect, useState } from 'react';
import Announcements from '@/components/Announcements';
import EventCalendarContainer from '@/components/EventCalendarContainer';
import PanenChart from '@/components/PanenChart';

export default function AdminPage({
  searchParams,
}: {
  searchParams: { [keys: string]: string | undefined };
}) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/stats`,
          {
            cache: 'no-store',
          }
        );
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error('Fetch stats failed:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return <div className="p-4">Loading dashboard data...</div>;
  }

  if (!stats) {
    return <div className="p-4 text-red-500">Failed to load data.</div>;
  }

  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      {/* LEFT */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        {/* USER CARDS */}
        <div className="flex gap-4 justify-between flex-wrap">
          <UserCard title="Admin" count={stats.admin} />
          <UserCard title="Penyuluh" count={stats.penyuluh} />
          <UserCard title="Kelompok Tani" count={stats.kelompokTani} />
          <UserCard title="Kios Pertanian" count={stats.kiosPertanian} />
        </div>

        {/* CHART PLACEHOLDERS */}
        <div className="flex gap-4 flex-col lg:flex-row">
          <div className="w-full lg:w-1/3 h-[450px] bg-white rounded-xl flex items-center justify-center">
            <p>CountChart (data: {stats.kelompokTani + stats.kiosPertanian})</p>
          </div>
          <div className="w-full lg:w-2/3 h-[450px] bg-white rounded-xl flex items-center justify-center">
            <p>ActivityChart (total kegiatan: {stats.kegiatan.length})</p>
          </div>
        </div>

        <div className="w-full h-[500px]">
          <PanenChart />
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <EventCalendarContainer searchParams={searchParams} />
        <Announcements />
      </div>
    </div>
  );
}

function UserCard({ title, count }: { title: string; count: number }) {
  return (
    <div className="rounded-2xl odd:bg-BppGreen even:bg-BppBlue p-4 flex-1 min-w-[130px]">
      <h1 className="text-2xl font-semibold my-4">{count}</h1>
      <h2 className="capitalize text-sm font-medium text-gray-500">{title}</h2>
    </div>
  );
}
