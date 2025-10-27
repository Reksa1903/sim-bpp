// src/app/(dashboard)/list/pengumuman/page.tsx
import FormContainer from '@/components/FormContainer';
import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import TableSearch from '@/components/TableSearch';
import prisma from '@/lib/prisma';
import { ITEM_PER_PAGE } from '@/lib/settings';
import { getRole } from '@/lib/utils';
import {
  Pengumuman,
  Penyuluh,
  KelompokTani,
  DesaBinaan,
  Prisma,
} from '@prisma/client';
import Image from 'next/image';

type PengumumanList = Pengumuman & {
  penyuluh: Penyuluh;
  kelompokTani?: (KelompokTani & { desaBinaan: DesaBinaan | null }) | null;
};

const PengumumanListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  // 🪄 ambil role dengan helper
  const role = await getRole();

  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  // 🌟 Query condition
  const query: Prisma.PengumumanWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case 'search':
            query.OR = [
              { title: { contains: value, mode: 'insensitive' } },
              { description: { contains: value, mode: 'insensitive' } },
            ];
            break;

          case 'penyuluhId':
            query.penyuluhId = value;
            break;

          case 'desabinaanId':
            query.kelompokTani = { desaBinaanId: value };
            break;

          default:
            break;
        }
      }
    }
  }

  const [data, count] = await prisma.$transaction([
    prisma.pengumuman.findMany({
      where: query,
      include: {
        penyuluh: true,
        kelompokTani: {
          include: {
            desaBinaan: { select: { name: true } },
          },
        },
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
      orderBy: { date: 'desc' },
    }),
    prisma.pengumuman.count({ where: query }),
  ]);

  // 📋 columns dinamis
  const columns = [
    { header: 'Pengumuman', accessor: 'title' },
    {
      header: 'Desa Binaan',
      accessor: 'desaBinaan',
      className: 'hidden md:table-cell',
    },
    {
      header: 'Tanggal',
      accessor: 'date',
      className: 'hidden md:table-cell',
    },
    {
      header: 'Deskripsi',
      accessor: 'description',
      className: 'hidden lg:table-cell',
    },
    ...(role === 'admin' || role === 'penyuluh'
      ? [{ header: 'Aksi', accessor: 'actions' }]
      : []),
  ];

  const renderRow = (item: PengumumanList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-BppLightBlue"
    >
      <td className="flex items-center gap-4 p-4 font-semibold">
        {item.title}
      </td>
      <td className="hidden md:table-cell">
        {item.kelompokTani?.desaBinaan?.name || '-'}
      </td>
      <td className="hidden md:table-cell">
        {item.date && new Date(item.date).toLocaleDateString('id-ID')}
      </td>
      <td className="hidden lg:table-cell">{item.description}</td>
      {(role === 'admin' || role === 'penyuluh') && (
        <td>
          <div className="flex items-center gap-2">
            <FormContainer table="pengumuman" type="update" data={item} />
            <FormContainer table="pengumuman" type="delete" id={item.id} />
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
          Daftar Pengumuman
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
            {(role === 'admin' || role === 'penyuluh') && (
              <FormContainer table="pengumuman" type="create" />
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

export default PengumumanListPage;
