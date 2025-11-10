// src/components/forms/DokumentasiAcaraForm.tsx
'use client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

import { useFormState } from 'react-dom';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import {
  createDokumentasiAcaraFromForm,
  deleteDokumentasiAcaraFromForm,
  updateDokumentasiAcaraFromForm,
} from '@/lib/actions';

// ✅ Wrapper untuk create
const createAction = async (
  _prevState: { success: boolean; error: boolean },
  formData: FormData
) => {
  return await createDokumentasiAcaraFromForm(formData);
};

// ✅ Wrapper untuk update
const updateAction = async (
  _prevState: { success: boolean; error: boolean },
  formData: FormData
) => {
  return await updateDokumentasiAcaraFromForm(formData);
};

// ✅ Wrapper untuk delete
const deleteAction = async (
  prevState: { success: boolean; error: boolean },
  formData: FormData
) => {
  return await deleteDokumentasiAcaraFromForm(prevState, formData);
};

const DokumentasiAcaraForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: 'create' | 'update' | 'delete';
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: {
    penyuluh: Array<{ id: string; name: string }>;
  };
}) => {
  // Tentukan action sesuai type
  const [state, formAction] = useFormState(
    type === 'create'
      ? createAction
      : type === 'update'
        ? updateAction
        : deleteAction,
    { success: false, error: false }
  );

  const router = useRouter();
  const penyuluh = relatedData?.penyuluh || [];

  // Feedback toast + refresh setelah sukses
  useEffect(() => {
    if (state.success) {
      if (type === 'delete') {
        toast.success('Dokumentasi acara berhasil dihapus!');
      } else {
        toast.success(
          `Dokumentasi acara berhasil ${type === 'create' ? 'ditambahkan' : 'diubah'
          }!`
        );
      }
      setOpen(false);
      router.refresh();
    }
  }, [state, router, setOpen, type]);

  // ✅ Mode delete: tampilkan konfirmasi
  if (type === 'delete') {
    return (
      <form action={formAction} className="p-4 flex flex-col gap-4">
        <input type="hidden" name="id" value={data?.id ?? ''} />
        <span className="text-center font-medium">
          Data dokumentasi <b>{data?.title ?? ''}</b> akan dihapus. Apakah Anda
          yakin?
        </span>
        <div className="flex justify-center gap-3">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="px-4 py-2 rounded-md border"
          >
            Batal
          </button>
          <button
            type="submit"
            className="bg-red-700 text-white py-2 px-4 rounded-md"
          >
            Hapus
          </button>
        </div>
      </form>
    );
  }

  // ✅ Mode create / update
  return (
    <form
      className="flex flex-col gap-8"
      action={formAction}
      encType="multipart/form-data"
    >
      <h1 className="text-xl font-semibold">
        {type === 'create'
          ? 'Tambah Dokumentasi Acara Baru'
          : 'Edit Dokumentasi Acara'}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        {/* Judul Dokumentasi */}
        <div className="flex flex-col gap-2 w-full md:w-2/3">
          <label className="text-xs text-gray-500">Judul Dokumentasi</label>
          <input
            type="text"
            name="title"
            defaultValue={data?.title ?? ''}
            required
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
          />
        </div>

        {/* Deskripsi */}
        <div className="flex flex-col gap-2 w-full md:w-2/3">
          <label className="text-xs text-gray-500">Deskripsi</label>
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

        {/* Tanggal */}
        <div className="flex flex-col gap-2 w-full md:w-1/3">
          <label className="text-xs text-gray-500">Tanggal</label>
          <input
            type="date"
            name="date"
            defaultValue={
              data?.date ? new Date(data.date).toISOString().slice(0, 10) : ''
            }
            required
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
          />
        </div>

        {/* Upload Foto */}
        <div className="flex flex-col gap-2 w-full md:w-2/3">
          <label className="text-xs text-gray-500">Upload Foto</label>
          <input
            type="file"
            name="photo"
            accept="image/*"
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
          />
          {type === 'update' && data?.photo && (
            <span className="text-xs text-gray-400">
              Foto saat ini: {data.photo}
            </span>
          )}
        </div>

        {/* Pilih Penyuluh */}
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
        {type === 'create' ? 'Simpan Dokumentasi' : 'Update Dokumentasi'}
      </button>
    </form>
  );
};

export default DokumentasiAcaraForm;
