// src/app/(dashboard)/list/parakelompoktani/[id]/page.tsx
import { unstable_noStore as noStore } from 'next/cache';

import dynamic from 'next/dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

import FotoKegiatan from '@/components/FotoKegiatan';
import prisma from '@/lib/prisma'; // ✅ cukup ini saja
import { auth } from '@clerk/nextjs/server';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const FormContainer = dynamic(() => import('@/components/FormContainer'), {
  ssr: false,
});
const Performance = dynamic(() => import('@/components/Performance'), {
  ssr: false,
});
const Announcements = dynamic(() => import('@/components/Announcements'), {
  ssr: false,
});
const BigCalendarContainer = dynamic(
  () => import('@/components/BigCalendarContainer'),
  { ssr: false }
);

type CalendarEvent = { title: string; start: Date; end: Date };

const SingleKelompokTaniPage = async ({ params: { id } }: { params: { id: string } }) => ({
  noStore();
  
  params: { id },
}: {
  params: { id: string };
}) => {
  // const { default: prisma } = await import('@/lib/prisma');

  // ---- Ambil role untuk hak akses ----
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  // ---- Ambil kelompok + relasi ----
  const kelompok = await prisma.kelompokTani.findUnique({
    where: { id },
    include: {
      _count: { select: { pengumuman: true } },
      desaBinaan: {
        include: {
          penyuluh: true,
          _count: { select: { kelompokTani: true } },
        },
      },
    },
  });

  if (!kelompok) return notFound();

  const penyuluhPembina = kelompok.desaBinaan?.penyuluh ?? null;
  const penyuluhId = penyuluhPembina?.id || null;

  // ---- Ambil materi, kegiatan, dokumentasi milik penyuluh pembina ----
  const [materi, kegiatan, dokumentasi] = await prisma.$transaction([
    prisma.materi.findMany({
      where: penyuluhId ? { penyuluhId } : { id: '' },
      orderBy: { uploadDate: 'desc' },
      take: 50,
    }),
    prisma.kegiatan.findMany({
      where: penyuluhId ? { penyuluhId } : { id: '' },
      orderBy: { startDate: 'asc' },
      take: 200,
    }),
    prisma.dokumentasiAcara.findMany({
      where: penyuluhId ? { penyuluhId } : { id: '' },
      orderBy: { date: 'desc' },
      take: 9,
    }),
  ]);

  // ---- Siapkan data untuk kalender ----
  const calendarData: CalendarEvent[] = kegiatan.map((k) => ({
    title: k.title,
    start: k.startDate,
    end: k.endDate,
  }));

  // ---- Hitungan ringkas ----
  const countPengumumanKelompok = kelompok._count.pengumuman;
  const countKegiatanPenyuluh = kegiatan.length;
  const countMateriPenyuluh = materi.length;
  const countKelompokDiDesa = kelompok.desaBinaan?._count.kelompokTani ?? 0;

  // format luas area (tampil 2 desimal) atau '-' jika null/undefined
  const luasAreaDisplay =
    typeof kelompok.luasArea === 'number' && !Number.isNaN(kelompok.luasArea)
      ? `${Number(kelompok.luasArea).toFixed(2)} HA`
      : '-';

  return (
    <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        {/* TOP */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* INFO CARD */}
          <div className="bg-BppBlue py-6 px-4 rounded-md flex-1 flex gap-4">
            <div className="w-1/3">
              <Image
                src={kelompok.img || '/noAvatar.png'}
                alt={kelompok.name}
                width={144}
                height={144}
                className="w-36 h-36 rounded-full object-cover"
              />
            </div>

            <div className="w-2/3 flex flex-col justify-between gap-4">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold">{kelompok.name}</h1>

                {/* ✅ Tombol Update hanya muncul untuk admin */}
                {role === 'admin' && (
                  <FormContainer
                    table="kelompoktani"
                    type="update"
                    data={kelompok}
                  />
                )}
              </div>

              <p className="text-sm text-gray-500">
                Kelompok tani di Desa&nbsp;
                <span className="font-medium">
                  {kelompok.desaBinaan?.name ?? '-'}
                </span>
                {penyuluhPembina && (
                  <>
                    {' '}
                    - dibina oleh Penyuluh&nbsp;
                    <Link
                      className="underline"
                      href={`/list/parapenyuluh/${penyuluhPembina.id}`}
                    >
                      {penyuluhPembina.name} {penyuluhPembina.surname}
                    </Link>
                  </>
                )}
                .
              </p>

              <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/profil.png" alt="" width={14} height={14} />
                  <span>Ketua: {kelompok.ketua}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/dateBlackII.png" alt="" width={14} height={14} />
                  <span>
                    Terdaftar:{' '}
                    {new Intl.DateTimeFormat('id-ID', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    }).format(new Date(kelompok.createdAt))}
                  </span>
                </div>

                {/* -- Ganti tampilan email lama menjadi Luas Area (HA) -- */}
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/luas.png" alt="" width={14} height={14} />
                  <span>{luasAreaDisplay}</span>
                </div>

                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/phone.png" alt="" width={14} height={14} />
                  <span>{kelompok.phone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* SMALL CARDS */}
          <div className="flex-1 flex gap-4 justify-between flex-wrap">
            {/* Pengumuman Kelompok */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%] justify-center items-center">
              <Image
                src="/singleAttendance.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div>
                <h1 className="text-xl font-semibold">
                  {countPengumumanKelompok}
                </h1>
                <span className="text-sm text-gray-400">Pengumuman</span>
              </div>
            </div>

            {/* Kegiatan Penyuluh */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%] justify-center items-center">
              <Image
                src="/singleBranch.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div>
                <h1 className="text-xl font-semibold">
                  {countKegiatanPenyuluh}
                </h1>
                <span className="text-sm text-gray-400">Kegiatan</span>
              </div>
            </div>

            {/* Materi Penyuluh */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%] justify-center items-center">
              <Image
                src="/singleLesson.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div>
                <h1 className="text-xl font-semibold">{countMateriPenyuluh}</h1>
                <span className="text-sm text-gray-400">Materi</span>
              </div>
            </div>

            {/* Total Kelompok di Desa */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%] justify-center items-center">
              <Image
                src="/singleClass.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div>
                <h1 className="text-xl font-semibold">{countKelompokDiDesa}</h1>
                <span className="text-sm text-gray-400">Kelompok Desa</span>
              </div>
            </div>
          </div>
        </div>

        {/* Jadwal Kegiatan */}
        <div className="mt-4 bg-white rounded-md p-4 h-[900px]">
          <h1 className="font-semibold">Jadwal Kegiatan Penyuluh</h1>
          <BigCalendarContainer penyuluhId={penyuluhId ?? undefined} />
        </div>

        {/* Dokumentasi */}
        <div className="mt-4 bg-white rounded-md p-4">
          <h1 className="font-semibold">Foto Kegiatan</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {dokumentasi.length === 0 ? (
              <p className="text-sm text-gray-500">Belum ada dokumentasi.</p>
            ) : (
              dokumentasi.map((doc) => (
                <FotoKegiatan
                  key={doc.id}
                  photo={doc.photo}
                  title={doc.title}
                  description={doc.description}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        <div className="bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Pintasan</h1>
          <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
            <Link
              className="p-3 rounded-md bg-BppLightGreen"
              href={penyuluhId ? `/list/parapenyuluh/${penyuluhId}` : '#'}
            >
              Penyuluh Pembina
            </Link>
            <Link
              className="p-3 rounded-md bg-BppLightBlue"
              href={`/list/pengumuman?kelompokTaniId=${kelompok.id}`}
            >
              Pengumuman Kelompok
            </Link>
            <Link
              className="p-3 rounded-md bg-BppLightYellow"
              href={penyuluhId ? `/list/materi?penyuluhId=${penyuluhId}` : '#'}
            >
              Materi Penyuluh
            </Link>
            <Link
              className="p-3 rounded-md bg-purple-100"
              href={
                penyuluhId ? `/list/kegiatan?penyuluhId=${penyuluhId}` : '#'
              }
            >
              Kegiatan Penyuluh
            </Link>
          </div>
        </div>

        <Performance />
        <Announcements />
      </div>
    </div>
  );
};

export default SingleKelompokTaniPage;
