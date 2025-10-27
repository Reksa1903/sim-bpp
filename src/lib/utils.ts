// src/lib/utils.ts
import { auth } from "@clerk/nextjs/server";

/**
 * Mendapatkan role user saat ini saja.
 */
export async function getRole(): Promise<string | undefined> {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  return role;
}

/**
 * Mendapatkan role & userId user saat ini.
 */
export async function getUserSession(): Promise<{ role?: string; userId?: string }> {
  const { userId, sessionClaims } = await auth();

  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const safeUserId = userId ?? undefined;

  return { role, userId: safeUserId };
}

/**
 * Tanggal awal minggu (Senin)
 * Fungsi ini mengembalikan tanggal Senin pada minggu ini berdasarkan tanggal saat ini.
 */
export const getStartOfWeek = (): Date => {
  const now = new Date();
  const day = now.getDay();
  // Senin (1) harus dihitung dengan benar, minggu dimulai pada hari Senin.
  const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Jika hari ini Minggu (0), set tanggal ke Senin (6 hari lalu)
  const monday = new Date(now.setDate(diff));
  monday.setHours(0, 0, 0, 0); // Reset waktu ke 00:00:00 untuk memastikan pagi hari
  return monday;
};

/**
 * Tanggal akhir minggu (Minggu)
 * Fungsi ini mengembalikan tanggal Minggu (6 hari setelah Senin)
 */
export const getEndOfWeek = (): Date => {
  const monday = getStartOfWeek();
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6); // 6 hari setelah Senin
  sunday.setHours(23, 59, 59, 999); // Set ke waktu terakhir di hari Minggu
  return sunday;
};

/**
 * Menyesuaikan jadwal yang ada dengan minggu yang aktif
 * Fungsi ini akan memfilter kegiatan yang ada dan menyesuaikannya dengan rentang tanggal minggu ini.
 */
export const adjustScheduleToWeek = (
  data: { title: string; start: Date; end: Date }[],
  weekStartDate: Date
) => {
  const weekEndDate = new Date(weekStartDate);
  weekEndDate.setDate(weekStartDate.getDate() + 6); // Menghitung tanggal akhir minggu

  return data.filter((kegiatan) => {
    const eventStart = new Date(kegiatan.start);
    const eventEnd = new Date(kegiatan.end);

    // Filter data untuk kegiatan yang terjadi dalam rentang minggu aktif (Senin sampai Minggu)
    return (
      (eventStart >= weekStartDate && eventStart <= weekEndDate) ||
      (eventEnd >= weekStartDate && eventEnd <= weekEndDate) ||
      (eventStart <= weekStartDate && eventEnd >= weekEndDate)
    );
  });
};
