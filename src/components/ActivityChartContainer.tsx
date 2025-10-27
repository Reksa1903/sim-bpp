import Image from 'next/image';
import ActivityChart from './ActivityChart';
import prisma from '@/lib/prisma';

const ActivityChartContainer = async () => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  const lastMonday = new Date(today);
  lastMonday.setDate(today.getDate() - daysSinceMonday);

  const nextSunday = new Date(lastMonday);
  nextSunday.setDate(lastMonday.getDate() + 6);

  // Ambil data kegiatan dalam minggu ini
  const kegiatanData = await prisma.kegiatan.findMany({
    where: {
      startDate: {
        gte: lastMonday,
        lte: nextSunday,
      },
    },
    select: {
      startDate: true,
    },
  });

  // Inisialisasi jumlah kegiatan per hari
  const hariMap: Record<string, number> = {
    Sen: 0,
    Sel: 0,
    Rab: 0,
    Kam: 0,
    Jum: 0,
  };

  // Hitung jumlah per hari
  kegiatanData.forEach((keg) => {
    const date = new Date(keg.startDate);
    const day = date.getDay(); // 0=Min, 1=Sen, ..., 6=Sabtu
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
