// src/app/(dashboard)/list/parapenyuluh/_client.tsx
import Table from '@/components/Table';
import { PenyuluhWithDesa } from './page';
import Pagination from '@/components/Pagination';
import Image from 'next/image';

interface Props {
  data: PenyuluhWithDesa[];
  count: number;
  role: string;
}

const ParaPenyuluhClient = ({ data, count, role }: Props) => {
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
    <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-BppLightBlue">
      <td className="flex items-center gap-4 p-4">
        <Image
          src={item.img ? item.img : '/noAvatar.png'}
          alt={item.name || 'Penyuluh'}
          width={40}
          height={40}
          className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
          priority={true}
        />
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-xs text-gray-500">{item.email}</p>
        </div>
      </td>
      <td>{item.username}</td>
      <td>{item.bidang.length > 0 ? `${item.bidang.slice(0, 1).join(', ')}${item.bidang.length > 1 ? ', …' : ''}` : '-'}</td>
      <td>{item.desaBinaan.length > 0 ? `${item.desaBinaan.map((desa: { name: any; }) => desa.name).slice(0, 1).join(', ')}${item.desaBinaan.length > 1 ? ', …' : ''}` : '-'}</td>
      <td>{item.phone}</td>
      <td>{item.address}</td>
      <td>
        <div className="flex items-center gap-2">
          <button className="w-7 h-7 flex items-center justify-center rounded-full bg-BppGreen">View</button>
          {role === 'admin' && <button className="w-7 h-7 flex items-center justify-center rounded-full bg-red-500">Delete</button>}
        </div>
      </td>
    </tr>
  );

  return (
    <div>
      <div className="flex justify-between">
        <h1>Semua Penyuluh</h1>
        <div className="flex flex-col md:flex-row items-center gap-4">
          {/* Table and Pagination */}
          <Table columns={columns} renderRow={renderRow} data={data} />
        </div>
      </div>
      {/* Pagination Component */}
      <Pagination page={1} count={count} />
    </div>
  );
};

export default ParaPenyuluhClient;
