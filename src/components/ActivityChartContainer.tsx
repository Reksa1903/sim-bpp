// src/components/ActivityChartContainer.tsx
import Image from 'next/image';
import ActivityChart from './ActivityChart';

const ActivityChartContainer = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stats`, {
    cache: 'no-store',
  });
  const stats = await res.json();

  const kegiatanData = stats.kegiatan || [];

  const hariMap: Record<string, number> = {
    Sen: 0,
    Sel: 0,
    Rab: 0,
    Kam: 0,
    Jum: 0,
  };

  kegiatanData.forEach((keg: { startDate: string }) => {
    const date = new Date(keg.startDate);
    const day = date.getDay();
    const hari = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'][day];
    if (hariMap[hari] !== undefined) {
      hariMap[hari]++;
    }
  });

  const data = Object.entries(hariMap).map(([name, kegiatan]) => ({
    name,
    kegiatan,
  }));

  return (
    <div className="bg-white rounded-lg p-4 h-full">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Jumlah Kegiatan</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>
      <ActivityChart data={data} />
    </div>
  );
};

export default ActivityChartContainer;
