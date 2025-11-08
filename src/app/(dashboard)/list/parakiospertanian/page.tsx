// src/app/(dashboard)/list/parakiospertanian/page.tsx
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import TableSearch from '@/components/TableSearch';
import prisma from '@/lib/prisma';
import { ITEM_PER_PAGE } from '@/lib/settings';
import { KiosPertanian, Prisma } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import { getRole } from '@/lib/utils';
import FormContainer from '@/components/FormContainer';

type KiosPertanianList = KiosPertanian;

const ParaKiosPertanianListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const role = await getRole();

  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  const query: Prisma.KiosPertanianWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case 'search': {
            query.name = {
              contains: value,
              mode: 'insensitive',
            };
            break;
          }
          default:
            break;
        }
      }
    }
  }

  const [data, count] = await prisma.$transaction([
    prisma.kiosPertanian.findMany({
      where: query,
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.kiosPertanian.count({ where: query }),
  ]);

  const columns = [
    { header: 'Info', accessor: 'info' },
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
    { header: 'Aksi', accessor: 'actions' },
  ];

  const renderRow = (item: KiosPertanianList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-BppLightBlue"
    >
      <td className="flex items-center gap-4 p-4">
        {/* 🔹 Tambahan gambar profil */}
        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200">
          <Image
            src={item.img || '/noavatar.png'}
            alt={item.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-xs text-gray-500">{item.owner}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.phone}</td>
      <td className="hidden md:table-cell">{item.address}</td>

      {/* Perubahan: selalu render kolom Aksi -> View dapat diakses semua user */}
      <td>
        <div className="flex items-center gap-2">
          {/* View -> bisa diakses semua user */}
          <Link href={`/list/parakiospertanian/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-BppGreen">
              <Image src="/view.png" alt="" width={16} height={16} />
            </button>
          </Link>

          {/* Delete -> tetap hanya untuk admin */}
          {role === 'admin' && (
            <FormContainer table="kisopertanian" type="delete" id={item.id} />
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
          Daftar Kios Pertanian
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
              <FormContainer table="kisopertanian" type="create" />
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

export default ParaKiosPertanianListPage;
