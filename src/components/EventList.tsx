// src/components/EventList.tsx
import prisma from '@/lib/prisma';

const EventList = async ({ dateParam }: { dateParam: string | undefined }) => {
  // Gunakan tanggal dari URL jika ada, jika tidak gunakan hari ini
  const date = dateParam ? new Date(dateParam) : new Date();

  // buat dua objek baru: satu di-set ke 00:00:00, satu di-set ke 23:59:59
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  // Query kegiatan dengan startDate pada hari itu
  const data = await prisma.kegiatan.findMany({
    where: {
      startDate: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
    orderBy: {
      startDate: 'asc', // urutkan dari paling awal
    },
  });

  // Jika tidak ada kegiatan
  if (data.length === 0) {
    return (
      <p className="text-center text-gray-400">
        Tidak ada kegiatan pada tanggal ini.
      </p>
    );
  }

  // Jika ada kegiatan, tampilkan
  return (
    <div className="flex flex-col gap-4">
      {data.map((kegiatan) => (
        <div
          key={kegiatan.id}
          className="p-5 rounded-md border-2 border-gray-100 border-t-4 odd:border-t-BppGreen even:border-t-BppYellow"
        >
          <div className="flex items-center justify-between">
            <h1 className="font-semibold text-gray-600">{kegiatan.title}</h1>
            <span className="text-gray-300 text-xs">
              {new Date(kegiatan.startDate).toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
          <p className="mt-2 text-gray-400 text-sm">{kegiatan.description}</p>
        </div>
      ))}
    </div>
  );
};

export default EventList;
