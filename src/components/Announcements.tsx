'use client';
// src/components/Announcements.tsx
import { useEffect, useState } from 'react';

const Announcements = () => {
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const baseUrl =
      typeof window !== "undefined"
        ? "/api/pengumuman"
        : `${process.env.NEXT_PUBLIC_SITE_URL}/api/pengumuman`;

    fetch(baseUrl)
      .then((res) => (res.ok ? res.json() : []))
      .then(setData)
      .catch((err) => {
        console.error("Failed to load pengumuman:", err);
        setError(true);
      });
  }, []);


  if (error) {
    return (
      <div className="bg-white p-4 rounded-md">
        <h1 className="text-xl font-semibold">Pengumuman</h1>
        <p className="text-gray-400 mt-2 text-sm">Gagal memuat data.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-md">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Pengumuman</h1>
        <span className="text-xs text-gray-400">Lihat Semua</span>
      </div>
      <div className="flex flex-col gap-4 mt-4">
        {data.length === 0 && (
          <p className="text-gray-400 text-sm">Tidak ada pengumuman.</p>
        )}
        {data.map((item: any, i: number) => (
          <div
            key={item.id}
            className={`rounded-md p-4 ${i === 0
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
