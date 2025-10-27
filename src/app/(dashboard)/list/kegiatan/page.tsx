import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import TableSearch from '@/components/TableSearch';
import prisma from '@/lib/prisma';
import { ITEM_PER_PAGE } from '@/lib/settings';
import { Kegiatan, Penyuluh, Prisma } from '@prisma/client';
import Image from 'next/image';
import { getRole } from '@/lib/utils';
import FormContainer from '@/components/FormContainer';

type KegiatanList = Kegiatan & { penyuluh: Penyuluh };

const KegiatanListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const role = await getRole(); // 🪄 Ambil role sekali di awal

  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  const query: Prisma.KegiatanWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case 'search': {
            query.title = { contains: value, mode: 'insensitive' };
            break;
          }
          case 'penyuluhId': {
            query.penyuluhId = value;
            break;
          }
          case 'desabinaanId': {
            const desa = await prisma.desaBinaan.findUnique({
              where: { id: value },
              select: { penyuluhId: true },
            });
            if (desa) query.penyuluhId = desa.penyuluhId;
            break;
          }
          default:
            break;
        }
      }
    }
  }

  const [data, count] = await prisma.$transaction([
    prisma.kegiatan.findMany({
      where: query,
      include: { penyuluh: true },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
      orderBy: { startDate: 'desc' },
    }),
    prisma.kegiatan.count({ where: query }),
  ]);

  const columns = [
    { header: 'Judul', accessor: 'title' },
    {
      header: 'Deskripsi',
      accessor: 'description',
      className: 'hidden md:table-cell',
    },
    { header: 'Hari', accessor: 'day', className: 'hidden md:table-cell' },
    {
      header: 'Tanggal',
      accessor: 'tanggal',
      className: 'hidden md:table-cell',
    },
    {
      header: 'Mulai',
      accessor: 'startTime',
      className: 'hidden lg:table-cell',
    },
    {
      header: 'Berakhir',
      accessor: 'endTime',
      className: 'hidden lg:table-cell',
    },
    {
      header: 'Penyuluh',
      accessor: 'penyuluh',
      className: 'hidden md:table-cell',
    },
    ...(role === 'admin' || role === 'penyuluh'
      ? [{ header: 'Aksi', accessor: 'actions' }]
      : []),
  ];

  const renderRow = (item: KegiatanList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-BppLightBlue"
    >
      <td className="p-4 font-semibold">{item.title}</td>
      <td className="hidden md:table-cell">{item.description}</td>
      <td className="hidden md:table-cell">{item.day}</td>
      <td className="hidden md:table-cell">
        {new Date(item.startDate).toLocaleDateString('id-ID')}
      </td>
      <td className="hidden lg:table-cell">
        {new Date(item.startDate).toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </td>
      <td className="hidden lg:table-cell">
        {new Date(item.endDate).toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </td>
      <td className="hidden md:table-cell">{item.penyuluh?.name || '-'}</td>
      {(role === 'admin' || role === 'penyuluh') && (
        <td>
          <div className="flex items-center gap-2">
            <FormContainer table="kegiatan" type="update" data={item} />
            <FormContainer table="kegiatan" type="delete" id={item.id} />
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
          Daftar Kegiatan
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
              <FormContainer table="kegiatan" type="create" />
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

export default KegiatanListPage;
