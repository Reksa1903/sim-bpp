'use client';
// src/components/Announcements.tsx
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

import { useEffect, useState } from 'react';

const Announcements = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/pengumuman')
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  return (
    <div className="bg-white p-4 rounded-md">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Pengumuman</h1>
        <span className="text-xs text-gray-400">Lihat Semua</span>
      </div>
      <div className="flex flex-col gap-4 mt-4">
        {data.map((item: any, i: number) => (
          <div
            key={item.id}
            className={`rounded-md p-4 ${
              i === 0
                ? 'bg-BppLightGreen'
                : i === 1
                ? 'bg-BppLightYellow'
                : 'bg-BppLightBlue'
            }`}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-medium">{item.title}</h2>
              <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
                {new Date(item.date).toLocaleDateString('id-ID')}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Announcements;
