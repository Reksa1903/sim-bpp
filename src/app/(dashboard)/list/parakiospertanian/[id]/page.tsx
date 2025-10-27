// src/app/(dashboard)/list/parakiospertanian/[id]/page.tsx

import Announcements from '@/components/Announcements';
import Performance from '@/components/Performance';
import prisma from '@/lib/prisma';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import FormContainer from '@/components/FormContainer';
import { auth } from '@clerk/nextjs/server';

const SingleKiosPertanianPage = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  // 🔹 Ambil role dari Clerk (agar hanya admin bisa edit)
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  // 🔹 Ambil data kios berdasarkan ID
  const kios = await prisma.kiosPertanian.findUnique({
    where: { id },
    include: {
      pengumuman: true,
    },
  });

  if (!kios) return notFound();

  return (
    <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
      {/* LEFT SIDE */}
      <div className="w-full xl:w-2/3">
        {/* TOP SECTION */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* USER INFO CARD */}
          <div className="bg-BppBlue py-6 px-4 rounded-md flex-1 flex gap-4 items-center">
            {/* FOTO PROFIL */}
            <div className="w-1/3 flex justify-center items-center">
              <Image
                src={kios.img || '/noAvatar.png'}
                alt={kios.name}
                width={144}
                height={144}
                className="w-36 h-36 rounded-full object-cover"
              />
            </div>

            {/* INFO */}
            <div className="w-2/3 flex flex-col justify-between gap-4">
              {/* NAMA + UPDATE */}
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold">{kios.name}</h1>
                {role === 'admin' && (
                  <FormContainer
                    table="kisopertanian"
                    type="update"
                    data={kios}
                  />
                )}
              </div>

              {/* DESKRIPSI */}
              <p className="text-sm text-gray-500">
                Kios pertanian ini dikelola oleh{' '}
                {kios.owner || 'Pemilik tidak diketahui'} dan berperan aktif
                dalam penyediaan sarana serta bahan pertanian di wilayah
                sekitar.
              </p>

              {/* DETAIL */}
              <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                {/* OWNER */}
                <div className="w-full md:w-1/2 lg:w-full 2xl:w-1/2 flex items-center gap-2">
                  <Image src="/profil.png" alt="" width={14} height={14} />
                  <span>{kios.owner || '-'}</span>
                </div>

                {/* ALAMAT */}
                <div className="w-full md:w-1/2 lg:w-full 2xl:w-1/2 flex items-center gap-2">
                  <Image src="/lokasi.png" alt="" width={14} height={14} />
                  <span>{kios.address || '-'}</span>
                </div>

                {/* TELEPON */}
                <div className="w-full md:w-1/2 lg:w-full 2xl:w-1/2 flex items-center gap-2">
                  <Image src="/phone.png" alt="" width={14} height={14} />
                  <span>{kios.phone || '-'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* SMALL CARDS */}
          <div className="flex-1 flex gap-4 justify-between flex-wrap">
            {/* PENGUMUMAN */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%] justify-center items-center">
              <Image
                src="/singleAttendance.png"
                alt="Pengumuman Icon"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div>
                <h1 className="text-xl font-semibold">
                  {kios.pengumuman.length}
                </h1>
                <span className="text-sm text-gray-400">Pengumuman</span>
              </div>
            </div>

            {/* STATUS */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%] justify-center items-center">
              <Image
                src="/singleClass.png"
                alt="Status Icon"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div>
                <h1 className="text-xl font-semibold">Aktif</h1>
                <span className="text-sm text-gray-400">Status Kios</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        <Performance />
        <Announcements />
      </div>
    </div>
  );
};

export default SingleKiosPertanianPage;
