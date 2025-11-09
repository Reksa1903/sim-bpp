// src/components/CountChart.tsx
'use client';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';
import Image from 'next/image';

export default function CountChart({
  Kios_Pertanian,
  Kelompok_Tani,
}: { Kios_Pertanian: number; Kelompok_Tani: number }) {
  const data = [
    { name: 'Total', count: Kios_Pertanian + Kelompok_Tani, fill: 'white' },
    { name: 'Kios_Pertanian', count: Kios_Pertanian, fill: '#FAE27C' },
    { name: 'Kelompok_Tani', count: Kelompok_Tani, fill: '#CAE8BD' },
  ];
  return (
    <div className="relative w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart cx="50%" cy="50%" innerRadius="40%" outerRadius="100%" barSize={32} data={data}>
          <RadialBar background dataKey="count" />
        </RadialBarChart>
      </ResponsiveContainer>
      <Image
        src="/KiosTani.png"
        alt=""
        width={50}
        height={50}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      />
    </div>
  );
}
