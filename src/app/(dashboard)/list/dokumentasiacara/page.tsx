import prisma from '@/lib/prisma';
import Image from 'next/image';
import Pagination from '@/components/Pagination';
import TableSearch from '@/components/TableSearch';
import { ITEM_PER_PAGE } from '@/lib/settings';
import { getRole } from '@/lib/utils'; // ✅ pakai utils.ts terbaru
import { Penyuluh, DokumentasiAcara, Prisma } from '@prisma/client';
import FormContainer from '@/components/FormContainer';

type DokumentasiAcaraList = DokumentasiAcara & {
  penyuluh: Penyuluh;
};

const DokumentasiAcaraPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const role = await getRole(); // 🪄 ambil role

  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  const query: Prisma.DokumentasiAcaraWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case 'search': {
            query.OR = [
              { title: { contains: value, mode: 'insensitive' } },
              { description: { contains: value, mode: 'insensitive' } },
              { penyuluh: { name: { contains: value, mode: 'insensitive' } } },
            ];
            break;
          }
          case 'penyuluhId': {
            query.penyuluhId = value;
            break;
          }
          default:
            break;
        }
      }
    }
  }

  const [data, count] = await prisma.$transaction([
    prisma.dokumentasiAcara.findMany({
      where: query,
      include: { penyuluh: true },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
      orderBy: { date: 'desc' },
    }),
    prisma.dokumentasiAcara.count({ where: query }),
  ]);

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP BAR */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">
          Dokumentasi Acara
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-BppYellow">
              <Image src="/filter.png" alt="Filter" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-BppYellow">
              <Image src="/sort.png" alt="Sort" width={14} height={14} />
            </button>
            {(role === 'admin' || role === 'penyuluh') && (
              <FormContainer table="dokumentasiacara" type="create" />
            )}
          </div>
        </div>
      </div>

      {/* GRID LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {data.map((item) => (
          <div
            key={item.id}
            className="border-2 border-dashed border-purple-300 rounded-md p-4 hover:shadow-md transition"
          >
            <p className="text-sm text-gray-600 mb-2">{item.description}</p>

            <div className="w-full aspect-video bg-gray-100 rounded-md overflow-hidden mb-3">
              <Image
                src={item.photo}
                alt={item.title}
                width={400}
                height={300}
                className="object-cover w-full h-full"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <div className="flex items-center gap-1">
                <Image
                  src="/calendar.png"
                  alt="Calendar"
                  width={12}
                  height={12}
                />
                <span>{new Date(item.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Image src="/file.png" alt="File" width={12} height={12} />
                <span>{item.penyuluh?.name ?? '-'}</span>
              </div>
            </div>

            {/* Title + Delete */}
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-800 truncate">
                {item.title}
              </p>
              {(role === 'admin' || role === 'penyuluh') && (
                <FormContainer
                  table="dokumentasiacara"
                  type="delete"
                  id={item.id}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      <div className="mt-6">
        <Pagination page={p} count={count} />
      </div>
    </div>
  );
};

export default DokumentasiAcaraPage;
