// src/app/(dashboard)/list/parapenyuluh/_client.tsx
'use client';

import { PenyuluhWithDesa } from './types';
import Table from '@/components/Table';
import Pagination from '@/components/Pagination';
import FormContainer from '@/components/FormContainer';
import Image from 'next/image';
import Link from 'next/link';
import TableSearch from '@/components/TableSearch';
import React, { useState } from 'react';

interface Props {
  data: PenyuluhWithDesa[];
  count: number;
  role: string;
}

const ParaPenyuluhClient = ({ data, count, role }: Props) => {

  const columns = [
    { header: 'Info', accessor: '' },
    { header: 'Penyuluh ID', accessor: '' },
    { header: 'Bidang', accessor: '' },
    { header: 'Desa Binaan', accessor: '' },
    { header: 'Nomor Hp', accessor: '' },
    { header: 'Alamat', accessor: '' },
    { header: 'Aksi', accessor: '' },
  ];

  const renderRow = (item: PenyuluhWithDesa) => (
    <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-BppLightBlue">
      <td className="flex items-center gap-4 p-4">
        <Image
          src={item.img && item.img.trim() !== '' && item.img.trim().toLowerCase() !== 'null' ? item.img : '/noAvatar.png'}
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
          ? `${item.bidang.slice(0, 1).join(', ')}${item.bidang.length > 1 ? ', …' : ''}`
          : '-'}
      </td>
      <td className="hidden md:table-cell">
        {item.desaBinaan.length > 0
          ? `${item.desaBinaan.map((desa) => desa.name).slice(0, 1).join(', ')}${item.desaBinaan.length > 1 ? ', …' : ''}`
          : '-'}
      </td>
      <td className="hidden md:table-cell">{item.phone}</td>
      <td className="hidden md:table-cell">{item.address}</td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/list/parapenyuluh/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-BppGreen">
              <Image src="/view.png" alt="" width={16} height={16} />
            </button>
          </Link>
          {role === 'admin' && (
            <FormContainer table="penyuluh" type="delete" id={item.id} />
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Semua Penyuluh</h1>
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

      {/* TABLE */}
      <Table columns={columns} renderRow={renderRow} data={data} />

      {/* PAGINATION */}
      <Pagination page={1} count={count} />
    </div>
  );
};

export default ParaPenyuluhClient;
