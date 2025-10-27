// src/components/forms/PengumumanForm.tsx
'use client';

import { useFormState } from 'react-dom';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import {
  createPengumumanFromForm,
  updatePengumumanFromForm,
} from '@/lib/actions';

const createPengumumanAction = async (
  _prevState: { success: boolean; error: boolean },
  formData: FormData
) => await createPengumumanFromForm(formData);

const updatePengumumanAction = async (
  _prevState: { success: boolean; error: boolean },
  formData: FormData
) => await updatePengumumanFromForm(formData);

const PengumumanForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: 'create' | 'update';
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: {
    desaBinaan: Array<{ id: string; name: string }>;
    penyuluh: Array<{ id: string; name: string }>;
    kelompokTani: Array<{ id: string; label: string }>;
  };
}) => {
  const [state, formAction] = useFormState(
    type === 'create' ? createPengumumanAction : updatePengumumanAction,
    { success: false, error: false }
  );

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(
        `Pengumuman berhasil ${type === 'create' ? 'ditambahkan' : 'diubah'}!`
      );
      setOpen(false);
      router.refresh();
    }
  }, [state, router, setOpen, type]);

  const desaBinaan = relatedData?.desaBinaan || [];
  const penyuluh = relatedData?.penyuluh || [];
  const kelompokTani = relatedData?.kelompokTani || [];

  return (
    <form className="flex flex-col gap-8" action={formAction}>
      <h1 className="text-xl font-semibold">
        {type === 'create' ? 'Tambah Pengumuman Baru' : 'Edit Pengumuman'}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        {/* Judul Pengumuman */}
        <div className="flex flex-col gap-2 w-full md:w-2/3">
          <label className="text-xs text-gray-500">Judul Pengumuman</label>
          <input
            type="text"
            name="title"
            defaultValue={data?.title ?? ''}
            required
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
          />
        </div>

        {/* Deskripsi Pengumuman */}
        <div className="flex flex-col gap-2 w-full md:w-2/3">
          <label className="text-xs text-gray-500">Deskripsi Pengumuman</label>
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

        {/* Desa Binaan */}
        <div className="flex flex-col gap-2 w-full md:w-1/3">
          <label className="text-xs text-gray-500">Desa Binaan</label>
          <select
            name="desaBinaanId"
            defaultValue={data?.desaBinaanId ?? ''}
            required
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
          >
            <option value="">Pilih Desa Binaan</option>
            {desaBinaan.map((db) => (
              <option key={db.id} value={db.id}>
                {db.name}
              </option>
            ))}
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

        {/* Kelompok Tani */}
        <div className="flex flex-col gap-2 w-full md:w-1/3">
          <label className="text-xs text-gray-500">Kelompok Tani</label>
          <select
            name="kelompokTaniId"
            defaultValue={data?.kelompokTaniId ?? ''}
            required
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full text-black"
          >
            <option value="">Pilih Kelompok Tani</option>
            {kelompokTani.map((kt) => (
              <option className="text-black" key={kt.id} value={kt.id}>
                {kt.label}
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
        {type === 'create' ? 'Simpan Pengumuman' : 'Update Pengumuman'}
      </button>
    </form>
  );
};

export default PengumumanForm;
