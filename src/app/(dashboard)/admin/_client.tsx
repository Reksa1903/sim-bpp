// src/app/(dashboard)/admin/_client.tsx
'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Komponen “berbau browser” → no-SSR
const Announcements = dynamic(() => import('@/components/Announcements'), { ssr: false });
const EventCalendarContainer = dynamic(() => import('@/components/EventCalendarContainer'), { ssr: false });
const PanenChart = dynamic(() => import('@/components/PanenChart'), { ssr: false });
// Kalau nanti pakai ActivityChart beneran:
// const ActivityChart = dynamic(() => import('@/components/ActivityChart'), { ssr: false });

export default function AdminClient({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>;
}) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/stats', { cache: 'no-store', credentials: 'include' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setStats(data);
      } catch (e) {
        console.error('Fetch stats failed:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="p-4">Loading dashboard data...</div>;
  if (!stats) return <div className="p-4 text-red-500">Failed to load data.</div>;

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

        {/* CHARTS */}
        <div className="flex gap-4 flex-col lg:flex-row">
          <div className="w-full lg:w-1/3 h-[450px] bg-white rounded-xl flex items-center justify-center">
            <p>CountChart (data: {stats.kelompokTani + stats.kiosPertanian})</p>
          </div>
          <div className="w-full lg:w-2/3 h-[450px] bg-white rounded-xl flex items-center justify-center">
            <p>ActivityChart (total kegiatan: {stats.kegiatan.length})</p>
            {/* Saat siap: <ActivityChart data={stats.kegiatanAgg} /> */}
          </div>
        </div>

        <div className="w-full h-[500px]">
          <PanenChart data={stats.panen ?? []} />
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
