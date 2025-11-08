// src/components/forms/KiosPertanianForm.tsx
'use client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import InputField from '../InputField';
import Image from 'next/image';
import { Dispatch, SetStateAction, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { CldUploadWidget } from 'next-cloudinary';
import {
  kiosPertanianSchema,
  KiosPertanianSchema,
} from '@/lib/formValidationSchemas';
import {
  createKiosPertanianFromForm,
  updateKiosPertanianFromForm,
} from '@/lib/actions';

type FormState = { success: boolean; error: boolean };

const KiosPertanianForm = ({
  type,
  data,
  setOpen,
}: {
  type: 'create' | 'update';
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<KiosPertanianSchema>({
    resolver: zodResolver(kiosPertanianSchema) as any,
    defaultValues: {
      id: data?.id ?? undefined,
      name: data?.name ?? '',
      owner: data?.owner ?? '',
      address: data?.address ?? '',
      phone: data?.phone ?? '',
    } as any,
  });

  // normalisasi initial img: jika data.img adalah object (rare), ambil secure_url, kalau string biarkan
  const initImg = (() => {
    if (!data?.img) return null;
    if (typeof data.img === 'string') return data.img;
    if (typeof data.img === 'object' && data.img?.secure_url)
      return data.img.secure_url;
    return null;
  })();

  const [img, setImg] = useState<string | null>(initImg);
  const [previewBroken, setPreviewBroken] = useState(false);
  const router = useRouter();

  const onSubmit = handleSubmit(async (formValues) => {
    try {
      // pastikan payload.img adalah string atau null
      const payload: any = {
        id: data?.id,
        name: formValues.name ?? '',
        owner: formValues.owner ?? '',
        address: formValues.address ?? '',
        phone: formValues.phone ?? '',
        img: img ?? null,
      };

      const initial: FormState = { success: false, error: false };
      const res: FormState =
        type === 'create'
          ? await createKiosPertanianFromForm(initial, payload)
          : await updateKiosPertanianFromForm(initial, payload);

      if (res?.success) {
        toast(
          `Kios Pertanian berhasil ${type === 'create' ? 'dibuat' : 'diubah'}!`
        );
        setOpen(false);
        router.refresh();
      } else {
        toast.error('Gagal menyimpan data kios pertanian. Coba lagi ya.');
      }
    } catch (err: any) {
      console.error('Submit Kios Pertanian Error:', err);
      toast.error(err?.message ?? 'Terjadi kesalahan saat menyimpan.');
    }
  });

  return (
    <form className="flex flex-col gap-4" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === 'create' ? 'Buat Kios Pertanian' : 'Update Kios Pertanian'}
      </h1>

      {type === 'update' && data?.id && (
        <input type="hidden" {...register('id')} value={data.id} />
      )}

      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Nama Kios"
          name="name"
          register={register}
          error={errors.name}
        />
        <InputField
          label="Nama Pemilik"
          name="owner"
          register={register}
          error={errors.owner}
        />
        <InputField
          label="Alamat"
          name="address"
          register={register}
          error={errors.address}
        />
        <InputField
          label="No. Telepon"
          name="phone"
          register={register}
          error={errors.phone}
        />

        <CldUploadWidget
          uploadPreset="SIM-BPP"
          onSuccess={(result, { widget }) => {
            // simpan hanya secure_url (string)
            const secure =
              (result as any)?.info?.secure_url ??
              (result as any)?.info?.url ??
              null;
            setImg(secure);
            setPreviewBroken(false);
            widget.close();
          }}
        >
          {({ open }) => (
            <div
              className="text-xs text-gray-500 flex items-center gap-1 cursor-pointer w-full md:w-1/4"
              onClick={() => open()}
            >
              <Image src="/upload.png" alt="" width={28} height={28} />
              <span>Upload foto</span>
            </div>
          )}
        </CldUploadWidget>

        {/* preview */}
        <div className="w-full flex justify-start">
          <div className="w-[100px] h-[100px] relative">
            <Image
              src={
                !previewBroken && img
                  ? img
                  : data?.img && !previewBroken && typeof data.img === 'string'
                  ? data.img
                  : '/noAvatar.png'
              }
              alt="Kios Image"
              fill
              style={{ objectFit: 'cover' }}
              className="rounded-md mt-2"
              onError={() => setPreviewBroken(true)}
            />
          </div>
        </div>
      </div>

      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === 'create' ? 'Buat' : 'Update'}
      </button>
    </form>
  );
};

export default KiosPertanianForm;
