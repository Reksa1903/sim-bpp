// src/components/BigCalendarContainer.tsx
import prisma from '@/lib/prisma';
import BigCalendar from './BigCalender';

type BigCalendarContainerProps = {
  /** Opsional: tanggal awal minggu (akan dinormalkan ke Senin). Jika tidak diisi → Senin minggu ini */
  weekStartDate?: Date;
  /** Opsional: filter kegiatan hanya milik penyuluh tertentu */
  penyuluhId?: string;
};

// Helper: ambil tanggal Senin pada minggu dari sebuah tanggal (local time)
function getStartOfWeek(date: Date) {
  const d = new Date(date);
  const day = d.getDay(); // 0=Min, 1=Sen, dst
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // geser ke Senin
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

const BigCalendarContainer = async ({
  weekStartDate,
  penyuluhId,
}: BigCalendarContainerProps) => {
  // Tentukan start-of-week (local) lalu normalisasi ke UTC 00:00
  const startLocal = weekStartDate
    ? new Date(weekStartDate)
    : getStartOfWeek(new Date());
  const fixedWeekStartUTC = new Date(
    Date.UTC(
      startLocal.getFullYear(),
      startLocal.getMonth(),
      startLocal.getDate(),
      0,
      0,
      0
    )
  );
  const endOfWeekUTC = new Date(fixedWeekStartUTC);
  endOfWeekUTC.setUTCDate(endOfWeekUTC.getUTCDate() + 6);
  endOfWeekUTC.setUTCHours(23, 59, 59, 999);

  // Ambil kegiatan (opsional filter penyuluhId)
  const kegiatan = await prisma.kegiatan.findMany({
    where: {
      ...(penyuluhId ? { penyuluhId } : {}),
      startDate: { gte: fixedWeekStartUTC, lte: endOfWeekUTC },
    },
    include: { penyuluh: true },
    orderBy: { startDate: 'asc' },
  });

  const data = kegiatan.map((k) => ({
    title: `${k.title} - ${
      k.penyuluh?.name ?? k.penyuluhId ?? 'Tanpa Penyuluh'
    }`,
    start: new Date(k.startDate),
    end: new Date(k.endDate),
  }));

  if (!data.length) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        Tidak ada kegiatan di minggu ini.
      </div>
    );
  }

  return (
    <div className="h-full">
      <BigCalendar data={data} />
    </div>
  );
};

export default BigCalendarContainer;
