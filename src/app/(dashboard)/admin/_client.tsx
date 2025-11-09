// src/app/(dashboard)/admin/_client.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';

// Chart client-only
const CountChart = dynamic(() => import('@/components/CountChart'), { ssr: false });
const ActivityChart = dynamic(() => import('@/components/ActivityChart'), { ssr: false });
const PanenChart = dynamic(() => import('@/components/PanenChart'), { ssr: false });

type Stats = {
  admin: number;
  penyuluh: number;
  kelompokTani: number;
  kiosPertanian: number;
  // daftar kegiatan dengan startDate
  kegiatan?: Array<{ id: string; startDate: string | Date }>;
};

export default function AdminClient() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/stats', { cache: 'no-store', credentials: 'include' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as Stats;
        setStats(data);
      } catch (e) {
        console.error('Fetch /api/stats failed:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Aggregasi kegiatan per hari (Sen–Jum)
  const kegiatanPerHari = useMemo(() => {
    const order = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum'];
    const map: Record<string, number> = Object.fromEntries(order.map((d) => [d, 0]));
    if (stats?.kegiatan?.length) {
      for (const k of stats.kegiatan) {
        const d = new Date(k.startDate);
        const idx = d.getDay(); // 0=Min ... 6=Sab
        const nama = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'][idx];
        if (map[nama] !== undefined) map[nama] += 1;
      }
    }
    return order.map((name) => ({ name, kegiatan: map[name] ?? 0 }));
  }, [stats]);

  if (loading) return <div className="p-4">Loading dashboard data...</div>;
  if (!stats) return <div className="p-4 text-red-500">Failed to load data.</div>;

  return (
    <div className="w-full lg:w-2/3 flex flex-col gap-8">
      {/* CARDS COUNT */}
      <div className="flex gap-4 justify-between flex-wrap">
        <UserCard title="Admin" count={stats.admin} />
        <UserCard title="Penyuluh" count={stats.penyuluh} />
        <UserCard title="Kelompok Tani" count={stats.kelompokTani} />
        <UserCard title="Kios Pertanian" count={stats.kiosPertanian} />
      </div>

      {/* CHARTS */}
      <div className="flex gap-4 flex-col lg:flex-row">
        {/* CountChart card */}
        <div className="w-full lg:w-1/3 h-[450px] bg-white rounded-xl p-4 flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-lg font-semibold">Keanggotaan</h1>
          </div>
          <div className="flex-1 min-h-0">
            <CountChart
              Kelompok_Tani={stats.kelompokTani ?? 0}
              Kios_Pertanian={stats.kiosPertanian ?? 0}
            />
          </div>
        </div>

        {/* ActivityChart card */}
        <div className="w-full lg:w-2/3 h-[450px] bg-white rounded-xl p-4 flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-lg font-semibold">Jumlah Kegiatan</h1>
          </div>
          <div className="flex-1 min-h-0">
            <ActivityChart data={kegiatanPerHari} />
          </div>
        </div>
      </div>

      {/* Panen */}
      <div className="w-full h-[500px]">
        <PanenChart />
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
