// src/app/(dashboard)/list/parakelompoktani/page.tsx

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;
export const runtime = 'nodejs';

import FormContainer from '@/components/FormContainer';
import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import TableSearch from '@/components/TableSearch';
import prisma from '@/lib/prisma';
import { ITEM_PER_PAGE } from '@/lib/settings';
import { getRole } from '@/lib/utils';
import { DesaBinaan, KelompokTani, Penyuluh, Prisma } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';

// 🔷 Tipe data (desaBinaan bisa null)
type KelompokTaniList = KelompokTani & {
  desaBinaan:
  | (DesaBinaan & {
    penyuluh: Penyuluh | null;
  })
  | null;
};

const ParaKelompokTaniListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  // 🔷 Ambil role user
  const role = await getRole();

  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  // 🔷 Query condition
  const query: Prisma.KelompokTaniWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case 'penyuluhId': {
            query.desaBinaan = { penyuluhId: value };
            break;
          }
          case 'search': {
            query.name = { contains: value, mode: 'insensitive' };
            break;
          }
          default:
            break;
        }
      }
    }
  }

  // 🔷 Ambil data + total count
  const [data, count] = await prisma.$transaction([
    prisma.kelompokTani.findMany({
      where: query,
      include: {
        desaBinaan: {
          include: { penyuluh: true },
        },
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.kelompokTani.count({ where: query }),
  ]);

  // 🔷 Kolom tabel
  const columns = [
    { header: 'Info', accessor: 'info' },
    {
      header: 'Kelompok ID',
      accessor: 'kelompokTaniId',
      className: 'hidden md:table-cell',
    },
    {
      header: 'Penyuluh',
      accessor: 'penyuluh',
      className: 'hidden md:table-cell',
    },
    {
      header: 'Nomor Hp',
      accessor: 'phone',
      className: 'hidden md:table-cell',
    },
    {
      header: 'Alamat',
      accessor: 'address',
      className: 'hidden lg:table-cell',
    },
    ...(role === 'admin' || role === 'penyuluh'
      ? [{ header: 'Aksi', accessor: 'actions' }]
      : []),
  ];

  // 🔷 Render baris tabel (null-safe)
  const renderRow = (item: KelompokTaniList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-BppLightBlue"
    >
      <td className="flex items-center gap-4 p-4">
        <Image
          src={
            item.img &&
              item.img.trim() !== '' &&
              item.img.trim().toLowerCase() !== 'null'
              ? item.img
              : '/noAvatar.png'
          }
          alt={item.name || 'Kelompok Tani'}
          width={40}
          height={40}
          className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-xs text-gray-500">{item.ketua}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.username}</td>

      {/* <-- perbaikan di sini: gunakan optional chaining */}
      <td className="hidden md:table-cell">
        {item.desaBinaan?.penyuluh?.name ?? '-'}
      </td>

      <td className="hidden md:table-cell">{item.phone ?? '-'}</td>
      <td className="hidden md:table-cell">{item.address ?? '-'}</td>

      {/* Perubahan: View untuk admin & penyuluh; Delete tetap admin */}
      {(role === 'admin' || role === 'penyuluh') && (
        <td>
          <div className="flex items-center gap-2">
            {/* View -> bisa diakses oleh admin dan penyuluh */}
            <Link href={`/list/parakelompoktani/${item.id}`}>
              <button className="w-7 h-7 flex items-center justify-center rounded-full bg-BppGreen">
                <Image src="/view.png" alt="" width={16} height={16} />
              </button>
            </Link>

            {/* Delete -> hanya untuk admin */}
            {role === 'admin' && (
              <FormContainer table="kelompoktani" type="delete" id={item.id} />
            )}
          </div>
        </td>
      )}
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">
          Semua Kelompok Tani
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-BppYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-BppYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === 'admin' && (
              <FormContainer table="kelompoktani" type="create" />
            )}
          </div>
        </div>
      </div>

      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />

      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  );
};

export default ParaKelompokTaniListPage;
