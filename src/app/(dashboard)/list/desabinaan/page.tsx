// ✅ src/app/(dashboard)/list/desabinaan/page.tsx
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
import Image from 'next/image';
import { DesaBinaan, Penyuluh, KelompokTani, Prisma } from '@prisma/client';

type DesaBinaanList = DesaBinaan & {
  penyuluh: Penyuluh | null;
  kelompokTani: KelompokTani[];
};

const DesaBinaanListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const role = await getRole();

  const { page, search } = searchParams;
  const p = page ? parseInt(page) : 1;

  const query: Prisma.DesaBinaanWhereInput = {};
  if (search) {
    query.name = { contains: search, mode: 'insensitive' };
  }

  let data: DesaBinaanList[] = [];
  let count = 0;

  try {
    // 📦 Ambil data + total count
    [data, count] = await prisma.$transaction([
      prisma.desaBinaan.findMany({
        where: query,
        include: {
          penyuluh: true,
          kelompokTani: true,
        },
        take: ITEM_PER_PAGE,
        skip: ITEM_PER_PAGE * (p - 1),
        orderBy: { name: 'asc' },
      }),
      prisma.desaBinaan.count({ where: query }),
    ]);
  } catch (error) {
    console.error('❌ Error fetching desa binaan:', error);
  }

  const columns = [
    { header: 'Nama Desa', accessor: 'name' },
    {
      header: 'Penyuluh',
      accessor: 'penyuluh',
      className: 'hidden md:table-cell',
    },
    {
      header: 'Kelompok Tani',
      accessor: 'kelompokTani',
      className: 'hidden lg:table-cell',
    },
    ...(role === 'admin' ? [{ header: 'Aksi', accessor: 'actions' }] : []),
  ];

  const renderRow = (item: DesaBinaanList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-BppLightBlue"
    >
      <td className="p-4 font-semibold">{item.name}</td>
      <td className="hidden md:table-cell">{item.penyuluh?.name || '-'}</td>
      <td className="hidden lg:table-cell">
        {item.kelompokTani.length > 0
          ? `${item.kelompokTani
              .map((kt) => kt.name)
              .slice(0, 2)
              .join(', ')}${item.kelompokTani.length > 2 ? ', …' : ''}`
          : '-'}
      </td>
      {role === 'admin' && (
        <td>
          <div className="flex items-center gap-2">
            <FormContainer table="desabinaan" type="update" data={item} />
            <FormContainer table="desabinaan" type="delete" id={item.id} />
          </div>
        </td>
      )}
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">
          Daftar Desa Binaan
        </h1>

        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-BppYellow">
              <Image src="/filter.png" alt="filter" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-BppYellow">
              <Image src="/sort.png" alt="sort" width={14} height={14} />
            </button>

            {role === 'admin' && (
              <FormContainer table="desabinaan" type="create" />
            )}
          </div>
        </div>
      </div>

      {/* Jika gagal fetch data, tampilkan pesan error */}
      {data.length === 0 ? (
        <div className="text-center text-gray-500 p-8">
          Tidak ada data Desa Binaan.
        </div>
      ) : (
        <Table columns={columns} renderRow={renderRow} data={data} />
      )}

      <Pagination page={p} count={count} />
    </div>
  );
};

export default DesaBinaanListPage;
