import Announcements from '@/components/Announcements';
import BigCalendarContainer from '@/components/BigCalendarContainer';
import { getUserSession, getStartOfWeek } from '@/lib/utils';

// Komponen ini async karena butuh ambil session
const PenyuluhPage = async () => {
  // 🪄 Ambil role & userId dari session
  const { userId, role } = await getUserSession();

  // Pastikan hanya untuk role penyuluh
  if (role !== 'penyuluh') {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500 font-semibold">
          Anda tidak memiliki akses ke halaman ini.
        </p>
      </div>
    );
  }

  // 🗓️ Ambil awal minggu (Senin) pakai helper dari utils.ts
  const weekStartDate = getStartOfWeek();

  return (
    <div className="flex-1 p-4 flex gap-4 flex-col xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        <div className="h-[1200px] bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold mb-4">Jadwal Kegiatan</h1>

          {/* BigCalendarContainer dengan type, id & weekStartDate */}
          <BigCalendarContainer weekStartDate={weekStartDate} />
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <Announcements />
      </div>
    </div>
  );
};

export default PenyuluhPage;
