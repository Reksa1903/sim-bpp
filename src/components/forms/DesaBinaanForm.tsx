// src/components/forms/DesaBinaanForm.tsx
'use client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

import { useFormState } from 'react-dom';
import { Dispatch, SetStateAction, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import {
  createDesaBinaanFromForm,
  updateDesaBinaanFromForm,
} from '@/lib/actions';

// --- Action untuk server ---
const createDesaBinaanAction = async (
  _prevState: { success: boolean; error: boolean },
  formData: FormData
) => await createDesaBinaanFromForm(formData);

const updateDesaBinaanAction = async (
  _prevState: { success: boolean; error: boolean },
  formData: FormData
) => await updateDesaBinaanFromForm(formData);

const DesaBinaanForm = ({
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
    type === 'create' ? createDesaBinaanAction : updateDesaBinaanAction,
    { success: false, error: false }
  );

  const router = useRouter();

  // Penyuluh list (fallback ke array kosong)
  const penyuluh: Array<{ id: string; name: string }> = Array.isArray(
    relatedData?.penyuluh
  )
    ? relatedData.penyuluh
    : [];

  /**
   * relatedData.kelompokTani bisa berupa:
   *  - [{ id, label }, ...]  (dari FormContainer yang men-generate label), atau
   *  - [{ id, name }, ...]   (jika kamu mengirim name)
   *
   * Normalisasi menjadi { id, label } agar form selalu menggunakan label untuk tampilan
   */
  const kelompokTaniOptions: Array<{ id: string; label: string }> =
    useMemo(() => {
      if (!Array.isArray(relatedData?.kelompokTani)) return [];
      return relatedData.kelompokTani.map((k: any) => ({
        id: String(k.id),
        label: k.label ?? k.name ?? String(k.id),
      }));
    }, [relatedData?.kelompokTani]);

  // Default selected ids ketika edit (beri fallback ke array kosong)
  const defaultSelectedKelompokIds: string[] = useMemo(() => {
    // Jika data.kelompokTani adalah array objek dari prisma
    if (Array.isArray(data?.kelompokTani)) {
      return data.kelompokTani.map((k: any) => String(k.id));
    }
    // Jika ada field eksplisit kelompokTaniIds (mis. dari page), gunakan itu
    if (Array.isArray(data?.kelompokTaniIds)) {
      return data.kelompokTaniIds.map((id: any) => String(id));
    }
    return [];
  }, [data]);

  useEffect(() => {
    if (state.success) {
      toast(
        `Desa Binaan berhasil ${type === 'create' ? 'ditambahkan' : 'diubah'}!`
      );
      setOpen(false);
      router.refresh();
    }
  }, [state, router, setOpen, type]);

  return (
    <form className="flex flex-col gap-8" action={formAction}>
      <h1 className="text-xl font-semibold">
        {type === 'create' ? 'Tambah Desa Binaan Baru' : 'Edit Desa Binaan'}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        {/* Nama Desa */}
        <div className="flex flex-col gap-2 w-full md:w-2/3">
          <label className="text-xs text-gray-500">Nama Desa</label>
          <input
            type="text"
            name="name"
            defaultValue={data?.name || ''}
            required
            placeholder="Contoh: Desa Sukamaju"
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
          />
        </div>

        {/* ID Hidden saat update */}
        {type === 'update' && data?.id && (
          <input type="hidden" name="id" value={data.id} />
        )}

        {/* Penyuluh (optional karena penyuluhId nullable di schema) */}
        <div className="flex flex-col gap-2 w-full md:w-1/3">
          <label className="text-xs text-gray-500">Penyuluh</label>
          <select
            name="penyuluhId"
            defaultValue={data?.penyuluhId ?? ''}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
          >
            <option value="">-- Tidak memilih penyuluh --</option>
            {penyuluh.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Kelompok Tani (multiple select) */}
      <div className="flex flex-col gap-2 w-full">
        <label className="text-xs text-gray-500">
          Kelompok Tani (bisa pilih lebih dari satu)
        </label>

        <select
          name="kelompokTaniIds"
          multiple
          required
          defaultValue={defaultSelectedKelompokIds}
          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full h-36"
        >
          {kelompokTaniOptions.length === 0 ? (
            <option value="" disabled>
              (Tidak ada kelompok tani)
            </option>
          ) : (
            kelompokTaniOptions.map((k) => (
              <option key={k.id} value={k.id}>
                {k.label}
              </option>
            ))
          )}
        </select>
      </div>

      {/* Error umum */}
      {state.error && (
        <span className="text-red-500 text-sm">
          Gagal menyimpan data. Silakan coba lagi!
        </span>
      )}

      {/* Tombol submit */}
      <div className="flex gap-2">
        <button className="bg-blue-500 text-white p-2 rounded-md">
          {type === 'create' ? 'Buat Desa' : 'Update Desa'}
        </button>
      </div>
    </form>
  );
};

export default DesaBinaanForm;
