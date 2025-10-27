import FormContainer from '@/components/FormContainer';
import FormModal from '@/components/FormModal';
import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import TableSearch from '@/components/TableSearch';
import prisma from '@/lib/prisma';
import { ITEM_PER_PAGE } from '@/lib/settings';
import { getRole } from '@/lib/utils';
import { Materi, Penyuluh, Prisma } from '@prisma/client';
import Image from 'next/image';

type MateriList = Materi & { penyuluh: Penyuluh };

const MateriPenyuluhanListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  // Ambil role user saat ini
  const role = await getRole();

  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  // Query pencarian
  const query: Prisma.MateriWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case 'search':
            query.title = { contains: value, mode: 'insensitive' };
            break;
          case 'penyuluhId':
            query.penyuluhId = value;
            break;
          case 'desabinaanId':
            query.penyuluh = { desaBinaan: { some: { id: value } } };
            break;
          default:
            break;
        }
      }
    }
  }

  const [data, count] = await prisma.$transaction([
    prisma.materi.findMany({
      where: query,
      include: { penyuluh: true },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
      orderBy: [{ uploadDate: 'desc' }, { updateDate: 'desc' }],
    }),
    prisma.materi.count({ where: query }),
  ]);

  const columns = [
    { header: 'Topik Penyuluhan', accessor: 'title' },
    {
      header: 'Nama File',
      accessor: 'fileName',
      className: 'hidden md:table-cell',
    },
    {
      header: 'Tanggal Upload',
      accessor: 'uploadDate',
      className: 'hidden md:table-cell',
    },
    {
      header: 'Tanggal Update',
      accessor: 'updateDate',
      className: 'hidden md:table-cell',
    },
    {
      header: 'Penyuluh',
      accessor: 'penyuluh',
      className: 'hidden lg:table-cell',
    },
    { header: 'Aksi', accessor: 'actions' }, // Tampilkan untuk semua role
  ];

  const renderRow = (item: MateriList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-BppLightBlue"
    >
      <td className="flex items-center gap-4 p-4 font-semibold">
        {item.title}
      </td>
      <td className="hidden md:table-cell">{item.fileName}</td>
      <td className="hidden md:table-cell">
        {item.uploadDate?.toLocaleDateString('id-ID')}
      </td>
      <td className="hidden md:table-cell">
        {item.updateDate?.toLocaleDateString('id-ID')}
      </td>
      <td className="hidden lg:table-cell">{item.penyuluh?.name || '-'}</td>
      <td>
        <div className="flex items-center gap-2">
          {/* Semua role bisa download */}
          <FormModal table="materi" type="download" href={item.fileUrl} />
          {/* Hanya admin & penyuluh bisa update & delete */}
          {(role === 'admin' || role === 'penyuluh') && (
            <>
              <FormContainer table="materi" type="update" data={item} />
              <FormContainer table="materi" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">
          Daftar Materi Penyuluhan
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
            {/* Hanya admin & penyuluh yang bisa tambah materi */}
            {(role === 'admin' || role === 'penyuluh') && (
              <FormContainer table="materi" type="create" />
            )}
          </div>
        </div>
      </div>

      {/* Daftar tabel materi */}
      <Table columns={columns} renderRow={renderRow} data={data} />

      {/* Pagination */}
      <Pagination page={p} count={count} />
    </div>
  );
};

export default MateriPenyuluhanListPage;
