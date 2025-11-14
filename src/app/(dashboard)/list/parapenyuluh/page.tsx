// src/app/(dashboard)/list/parapenyuluh/page.tsx
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

import FormContainer from '@/components/FormContainer';
import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import TableSearch from '@/components/TableSearch';
import prisma from '@/lib/prisma';
import { ITEM_PER_PAGE } from '@/lib/settings';
import { getRole } from '@/lib/utils';
import { DesaBinaan, Penyuluh, Prisma } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';

type PenyuluhWithDesa = Penyuluh & {
  desaBinaan: DesaBinaan[];
};

const ParaPenyuluhListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  // 🔷 Ambil role user
  const role = await getRole();

  const { default: prisma } = await import('@/lib/prisma');

  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  // 🔷 Query condition
  const query: Prisma.PenyuluhWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case 'desabinaanId': {
            query.desaBinaan = {
              some: { id: value },
            };
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

  const [data, count] = await prisma.$transaction([
    prisma.penyuluh.findMany({
      where: query,
      include: { desaBinaan: true },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.penyuluh.count({ where: query }),
  ]);

  // 🔷 Kolom tabel
  const columns = [
    { header: 'Info', accessor: 'info' },
    {
      header: 'Penyuluh ID',
      accessor: 'penyuluhId',
      className: 'hidden md:table-cell',
    },
    {
      header: 'Bidang',
      accessor: 'bidang',
      className: 'hidden md:table-cell',
    },
    {
      header: 'Desa Binaan',
      accessor: 'desaBinaan',
      className: 'hidden md:table-cell',
    },
    {
      header: 'Nomor Hp',
      accessor: 'phone',
      className: 'hidden lg:table-cell',
    },
    {
      header: 'Alamat',
      accessor: 'address',
      className: 'hidden lg:table-cell',
    },
    { header: 'Aksi', accessor: 'actions' },
  ];

  const renderRow = (item: PenyuluhWithDesa) => (
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
          alt={item.name || 'Penyuluh'}
          width={40}
          height={40}
          className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-xs text-gray-500">{item.email}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.username}</td>
      <td className="hidden md:table-cell">
        {item.bidang.length > 0
          ? `${item.bidang.slice(0, 1).join(', ')}${item.bidang.length > 1 ? ', …' : ''
          }`
          : '-'}
      </td>
      <td className="hidden md:table-cell">
        {item.desaBinaan.length > 0
          ? `${item.desaBinaan
            .map((desa) => desa.name)
            .slice(0, 1)
            .join(', ')}${item.desaBinaan.length > 1 ? ', …' : ''}`
          : '-'}
      </td>
      <td className="hidden md:table-cell">{item.phone}</td>
      <td className="hidden md:table-cell">{item.address}</td>

      {/* --------------- Perubahan: selalu render kolom Aksi --------------- */}
      <td>
        <div className="flex items-center gap-2">
          {/* View -> bisa diakses semua user */}
          <Link href={`/list/parapenyuluh/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-BppGreen">
              <Image src="/view.png" alt="" width={16} height={16} />
            </button>
          </Link>

          {/* Delete -> hanya untuk admin */}
          {role === 'admin' && (
            <FormContainer table="penyuluh" type="delete" id={item.id} />
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">
          Semua Penyuluh
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
              <FormContainer table="penyuluh" type="create" />
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

export default ParaPenyuluhListPage;
