// src/components/forms/KegiatanForm.tsx
'use client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

import { useFormState } from 'react-dom';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { createKegiatanFromForm, updateKegiatanFromForm } from '@/lib/actions';

const createKegiatanAction = async (
  _prevState: { success: boolean; error: boolean },
  formData: FormData
) => await createKegiatanFromForm(formData);

const updateKegiatanAction = async (
  _prevState: { success: boolean; error: boolean },
  formData: FormData
) => await updateKegiatanFromForm(formData);

const KegiatanForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: 'create' | 'update';
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: {
    penyuluh: Array<{ id: string; name: string }>;
  };
}) => {
  const [state, formAction] = useFormState(
    type === 'create' ? createKegiatanAction : updateKegiatanAction,
    { success: false, error: false }
  );

  const router = useRouter();
  const penyuluh = relatedData?.penyuluh || [];

  useEffect(() => {
    if (state.success) {
      toast(
        `Kegiatan berhasil ${type === 'create' ? 'ditambahkan' : 'diubah'}!`
      );
      setOpen(false);
      router.refresh();
    }
  }, [state, router, setOpen, type]);

  return (
    <form className="flex flex-col gap-8" action={formAction}>
      <h1 className="text-xl font-semibold">
        {type === 'create' ? 'Tambah Kegiatan Baru' : 'Edit Kegiatan'}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        {/* Judul Kegiatan */}
        <div className="flex flex-col gap-2 w-full md:w-2/3">
          <label className="text-xs text-gray-500">Judul Kegiatan</label>
          <input
            type="text"
            name="title"
            defaultValue={data?.title ?? ''}
            required
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
          />
        </div>

        {/* Deskripsi Kegiatan */}
        <div className="flex flex-col gap-2 w-full md:w-2/3">
          <label className="text-xs text-gray-500">Deskripsi Kegiatan</label>
          <textarea
            name="description"
            defaultValue={data?.description ?? ''}
            required
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
          />
        </div>

        {/* Hidden ID saat update */}
        {type === 'update' && data?.id && (
          <input type="hidden" name="id" value={data.id} />
        )}

        {/* Tanggal Mulai */}
        <div className="flex flex-col gap-2 w-full md:w-1/3">
          <label className="text-xs text-gray-500">Tanggal & Waktu Mulai</label>
          <input
            type="datetime-local"
            name="startDate"
            defaultValue={
              data?.startDate
                ? new Date(data.startDate).toISOString().slice(0, 16)
                : ''
            }
            required
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
          />
        </div>

        {/* Tanggal Selesai */}
        <div className="flex flex-col gap-2 w-full md:w-1/3">
          <label className="text-xs text-gray-500">
            Tanggal & Waktu Selesai
          </label>
          <input
            type="datetime-local"
            name="endDate"
            defaultValue={
              data?.endDate
                ? new Date(data.endDate).toISOString().slice(0, 16)
                : ''
            }
            required
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
          />
        </div>

        {/* Hari */}
        <div className="flex flex-col gap-2 w-full md:w-1/3">
          <label className="text-xs text-gray-500">Hari</label>
          <select
            name="day"
            defaultValue={data?.day ?? ''}
            required
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full text-black"
          >
            <option value="">Pilih Hari</option>
            <option value="Senin">Senin</option>
            <option value="Selasa">Selasa</option>
            <option value="Rabu">Rabu</option>
            <option value="Kamis">Kamis</option>
            <option value="Jumat">Jumat</option>
          </select>
        </div>

        {/* Penyuluh */}
        <div className="flex flex-col gap-2 w-full md:w-1/3">
          <label className="text-xs text-gray-500">Penyuluh</label>
          <select
            name="penyuluhId"
            defaultValue={data?.penyuluhId ?? ''}
            required
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full text-black"
          >
            <option value="">Pilih Penyuluh</option>
            {penyuluh.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Error Umum */}
      {state.error && (
        <span className="text-red-500">Gagal menyimpan data. Coba lagi!</span>
      )}

      {/* Tombol Submit */}
      <button className="bg-blue-500 text-white p-2 rounded-md">
        {type === 'create' ? 'Simpan Kegiatan' : 'Update Kegiatan'}
      </button>
    </form>
  );
};

export default KegiatanForm;
