import Image from 'next/image';
import CountChart from './CountChart';
import prisma from '@/lib/prisma';

const CountChartContainer = async () => {
  // Ambil data
  const [kelompokCount, kiosCount] = await Promise.all([
    prisma.kelompokTani.count(),
    prisma.kiosPertanian.count(),
  ]);

  const total = kelompokCount + kiosCount;
  const kelompokPercent =
    total > 0 ? Math.round((kelompokCount / total) * 100) : 0;
  const kiosPercent = total > 0 ? Math.round((kiosCount / total) * 100) : 0;

  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      {/* TITLE */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Keanggotaan</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>

      {/* CHART */}
      <CountChart Kelompok_Tani={kelompokCount} Kios_Pertanian={kiosCount} />

      {/* BOTTOM */}
      <div className="flex justify-center gap-8 mt-4">
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-BppGreen rounded-full"></div>
            <span className="font-bold">{kelompokCount}</span>
          </div>
          <div className="text-xs text-gray-500">
            Kelompok Tani ({kelompokPercent}%)
          </div>
        </div>

        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-BppYellow rounded-full"></div>
            <span className="font-bold">{kiosCount}</span>
          </div>
          <div className="text-xs text-gray-500">
            Kios Pertanian ({kiosPercent}%)
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountChartContainer;
