// src/components/forms/MateriForm.tsx
'use client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

import { useFormState } from 'react-dom';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { createMateriFromForm, updateMateriFromForm } from '@/lib/actions';

const createMateriAction = async (
  _prevState: { success: boolean; error: boolean },
  formData: FormData
) => await createMateriFromForm(formData);

const updateMateriAction = async (
  _prevState: { success: boolean; error: boolean },
  formData: FormData
) => await updateMateriFromForm(formData);

const MateriForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: 'create' | 'update';
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
}) => {
  const [state, formAction] = useFormState(
    type === 'create' ? createMateriAction : updateMateriAction,
    { success: false, error: false }
  );

  const router = useRouter();

  // SAFETY: relatedData may be undefined — fallback ke array kosong
  const penyuluh: Array<{ id: string; name: string }> = Array.isArray(
    relatedData?.penyuluh
  )
    ? relatedData.penyuluh
    : [];

  useEffect(() => {
    if (state.success) {
      toast(`Materi berhasil ${type === 'create' ? 'ditambahkan' : 'diubah'}!`);
      setOpen(false);
      router.refresh();
    }
    // tambahkan router, setOpen, type ke dependencies agar lint tidak complain
  }, [state, router, setOpen, type]);

  return (
    <form
      className="flex flex-col gap-8"
      action={formAction}
      encType="multipart/form-data"
    >
      <h1 className="text-xl font-semibold">
        {type === 'create' ? 'Tambah Materi Baru' : 'Edit Materi'}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        {/* Judul Materi */}
        <div className="flex flex-col gap-2 w-full md:w-2/3">
          <label className="text-xs text-gray-500">Judul Materi</label>
          <input
            type="text"
            name="title"
            defaultValue={data?.title || ''}
            required
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
          />
        </div>

        {/* ID (Hidden Saat Update) */}
        {type === 'update' && data?.id && (
          <input type="hidden" name="id" value={data.id} />
        )}

        {/* Penyuluh */}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Penyuluh</label>
          <select
            name="penyuluhId"
            defaultValue={data?.penyuluhId || ''}
            required
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
          >
            <option value="">Pilih penyuluh</option>
            {penyuluh.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Nama File */}
        <div className="flex flex-col gap-2 w-full md:w-2/3">
          <label className="text-xs text-gray-500">Nama File</label>
          <input
            type="text"
            name="fileName"
            defaultValue={data?.fileName || ''}
            required={type === 'create'}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            placeholder="Contoh: Materi Penyuluhan Padi.pdf"
          />
        </div>

        {/* Upload File */}
        <div className="flex flex-col gap-2 w-full md:w-2/3">
          <label className="text-xs text-gray-500">Upload File (.pdf)</label>
          <input
            type="file"
            name="file"
            accept=".pdf"
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
          />
          {type === 'update' && data?.fileUrl && (
            <a
              href={data.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 underline mt-1"
            >
              Lihat File Sebelumnya
            </a>
          )}
        </div>
      </div>

      {/* Error Umum */}
      {state.error && (
        <span className="text-red-500">Gagal menyimpan data. Coba lagi!</span>
      )}

      {/* Tombol Submit */}
      <button className="bg-blue-500 text-white p-2 rounded-md">
        {type === 'create' ? 'Simpan Materi' : 'Update Materi'}
      </button>
    </form>
  );
};

export default MateriForm;
