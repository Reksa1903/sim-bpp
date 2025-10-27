import Announcements from '@/components/Announcements';
import FormContainer from '@/components/FormContainer';
import FotoKegiatan from '@/components/FotoKegiatan';
import Performance from '@/components/Performance';
import prisma from '@/lib/prisma';
import { Penyuluh } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import BigCalendarContainer from '@/components/BigCalendarContainer';

const SinglePenyuluhPage = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  // Ambil role user dari Clerk
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  // Ambil penyuluh + summary counts
  const penyuluh:
    | (Penyuluh & {
        _count: {
          pengumuman: number;
          materi: number;
          kegiatan: number;
          desaBinaan: number;
        };
      })
    | null = await prisma.penyuluh.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          pengumuman: true,
          materi: true,
          kegiatan: true,
          desaBinaan: true,
        },
      },
      desaBinaan: { select: { id: true, name: true } },
    },
  });

  if (!penyuluh) return notFound();

  // 🔹 FOTO KEGIATAN: ambil dokumentasi milik penyuluh (terbaru)
  const dokumentasi = await prisma.dokumentasiAcara.findMany({
    where: { penyuluhId: id },
    orderBy: { date: 'desc' },
    take: 9,
  });

  return (
    <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        {/* TOP */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* USER INFO CARD */}
          <div className="bg-BppBlue py-6 px-4 rounded-md flex-1 flex gap-4">
            <div className="w-1/3">
              <Image
                src={penyuluh.img || '/noAvatar.png'}
                alt={`${penyuluh.name} ${penyuluh.surname}`}
                width={144}
                height={144}
                className="w-36 h-36 rounded-full object-cover "
              />
            </div>
            <div className="w-2/3 flex flex-col justify-between gap-4">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold">
                  {`${penyuluh.name} ${penyuluh.surname}`}
                </h1>
                {role === 'admin' && (
                  <FormContainer
                    table="penyuluh"
                    type="update"
                    data={penyuluh}
                  />
                )}
              </div>
              <p className="text-sm text-gray-500">
                Anggota serta Penyuluh aktif di sektor pertanian Kecamatan Bodeh
                tergabung dalam BPP (Balai Penyuluhan Pertanian)
              </p>
              <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/plant.png" alt="" width={14} height={14} />
                  <span>
                    {Array.isArray(penyuluh.bidang) && penyuluh.bidang.length
                      ? penyuluh.bidang.join(', ')
                      : '-'}
                  </span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/dateBlackII.png" alt="" width={14} height={14} />
                  <span>
                    {new Intl.DateTimeFormat('id-ID', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    }).format(new Date(penyuluh.birthday))}
                  </span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/mail.png" alt="" width={14} height={14} />
                  <span>{penyuluh.email || '-'}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/phone.png" alt="" width={14} height={14} />
                  <span>{penyuluh.phone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* SMALL CARDS */}
          <div className="flex-1 flex gap-4 justify-between flex-wrap">
            {/* Pengumuman */}
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
                  {penyuluh._count.pengumuman}
                </h1>
                <span className="text-sm text-gray-400">Pengumuman</span>
              </div>
            </div>

            {/* Kegiatan */}
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
                  {penyuluh._count.kegiatan}
                </h1>
                <span className="text-sm text-gray-400">Kegiatan</span>
              </div>
            </div>

            {/* Materi */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%] justify-center items-center">
              <Image
                src="/singleLesson.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div>
                <h1 className="text-xl font-semibold">
                  {penyuluh._count.materi}
                </h1>
                <span className="text-sm text-gray-400">Materi</span>
              </div>
            </div>

            {/* Desa Binaan */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%] justify-center items-center">
              <Image
                src="/singleClass.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div>
                <h1 className="text-xl font-semibold">
                  {penyuluh._count.desaBinaan}
                </h1>
                <span className="text-sm text-gray-400">Desa Binaan</span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM I: Jadwal */}
        <div className="mt-4 bg-white rounded-md p-4 h-[900px]">
          <h1 className="font-semibold">Jadwal Kegiatan</h1>
          <BigCalendarContainer penyuluhId={id} />
        </div>

        {/* BOTTOM II: Foto Kegiatan */}
        <div className="mt-4 bg-white rounded-md p-4">
          <h1 className="font-semibold">Foto Kegiatan</h1>

          {dokumentasi.length === 0 ? (
            <p className="text-sm text-gray-500 mt-4">
              Belum ada dokumentasi kegiatan.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              {dokumentasi.map((doc) => (
                <FotoKegiatan
                  key={doc.id}
                  photo={doc.photo}
                  title={doc.title}
                  description={doc.description}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        <div className="bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Pintasan</h1>
          <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
            <Link
              className="p-3 rounded-md bg-BppLightGreen"
              href={`/list/parakelompoktani?penyuluhId=${penyuluh.id}`}
            >
              Desa Binaan
            </Link>
            <Link
              className="p-3 rounded-md bg-BppLightBlue"
              href={`/list/materi?penyuluhId=${penyuluh.id}`}
            >
              Materi
            </Link>
            <Link
              className="p-3 rounded-md bg-BppLightYellow"
              href={`/list/kegiatan?penyuluhId=${penyuluh.id}`}
            >
              Kegiatan
            </Link>
            <Link
              className="p-3 rounded-md bg-purple-100"
              href={`/list/pengumuman?penyuluhId=${penyuluh.id}`}
            >
              Pengumuman
            </Link>
          </div>
        </div>
        <Performance />
        <Announcements />
      </div>
    </div>
  );
};

export default SinglePenyuluhPage;
