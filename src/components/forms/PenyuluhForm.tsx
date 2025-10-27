// src/components/forms/PenyuluhForm.tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import InputField from '../InputField';
import Image from 'next/image';
import { Dispatch, SetStateAction, useState } from 'react';
import { createPenyuluhFromForm, updatePenyuluhFromForm } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { CldUploadWidget } from 'next-cloudinary';
import { penyuluhSchema, PenyuluhSchema } from '@/lib/formValidationSchemas';

type FormState = { success: boolean; error: boolean };

const PenyuluhForm = ({
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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PenyuluhSchema>({
    resolver: zodResolver(penyuluhSchema) as any,
    // IMPORTANT: sertakan id di defaultValues saat update supaya Zod tahu ini UPDATE
    defaultValues: {
      id: data?.id ?? undefined,
      username: data?.username ?? '',
      email: data?.email ?? '',
      password: '', // boleh kosong saat update
      name: data?.name ?? '',
      surname: data?.surname ?? '',
      phone: data?.phone ?? '',
      address: data?.address ?? '',
      birthday: data?.birthday
        ? new Date(data.birthday).toISOString().split('T')[0]
        : '',
      gender: data?.gender ?? 'PRIA',
      bidang: Array.isArray(data?.bidang)
        ? data?.bidang.join(',')
        : data?.bidang ?? '',
    } as any,
  });

  const [img, setImg] = useState<any>(null);
  const router = useRouter();

  const normalizeDate = (val: any) => {
    if (!val) return '';
    const s = String(val).trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
    const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (m) {
      const dd = m[1].padStart(2, '0');
      const mm = m[2].padStart(2, '0');
      const yyyy = m[3];
      return `${yyyy}-${mm}-${dd}`;
    }
    return s;
  };

  const onSubmit = handleSubmit(async (formValues) => {
    try {
      const desaIds = Array.isArray((formValues as any).desaBinaanIds)
        ? (formValues as any).desaBinaanIds
        : (formValues as any).desaBinaanIds
        ? [(formValues as any).desaBinaanIds]
        : [];

      // Jika password kosong, JANGAN kirim supaya tidak diubah
      const trimmedPwd = (formValues.password ?? '').trim();
      const payload: any = {
        id: data?.id, // tetap kirim ke server untuk jaga-jaga
        username: formValues.username ?? '',
        email: formValues.email ?? '',
        name: formValues.name ?? '',
        surname: formValues.surname ?? '',
        phone: formValues.phone ?? '',
        address: formValues.address ?? '',
        birthday: normalizeDate(formValues.birthday ?? ''),
        gender: formValues.gender ?? '',
        bidang: Array.isArray(formValues.bidang)
          ? formValues.bidang.join(',')
          : formValues.bidang ?? '',
        desaBinaanIds: desaIds,
        img: img?.secure_url ?? img ?? data?.img ?? null,
      };

      if (trimmedPwd) {
        payload.password = trimmedPwd; // hanya saat admin benar-benar mengisi password baru
      }

      const initial: FormState = { success: false, error: false };
      const res: FormState =
        type === 'create'
          ? await createPenyuluhFromForm(initial, payload)
          : await updatePenyuluhFromForm(initial, payload);

      if (res?.success) {
        toast(`Penyuluh berhasil ${type === 'create' ? 'dibuat' : 'diubah'}!`);
        setOpen(false);
        router.refresh();
      } else {
        toast.error('Gagal menyimpan data penyuluh. Coba lagi ya.');
      }
    } catch (err: any) {
      console.error('Submit Penyuluh Error:', err);
      toast.error(err?.message ?? 'Terjadi kesalahan saat menyimpan.');
    }
  });

  const { desaBinaan = [] } = relatedData || {};

  return (
    <form className="flex flex-col gap-4" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === 'create' ? 'Buat Penyuluh Baru' : 'Update Penyuluh'}
      </h1>

      {/* hidden id agar Zod tahu ini update */}
      {type === 'update' && data?.id && (
        <input type="hidden" {...register('id')} value={data.id} />
      )}

      <span className="text-xs text-gray-400 font-medium">
        Informasi Otentikasi
      </span>
      <div className="flex justify-between flex-wrap gap-1">
        <InputField
          label="Username"
          name="username"
          register={register}
          error={errors?.username}
        />
        <InputField
          label="Email"
          name="email"
          register={register}
          error={errors?.email}
        />
        <InputField
          label="Password"
          name="password"
          type="password"
          register={register}
          error={errors?.password}
          inputProps={{
            placeholder: type === 'update' ? 'Kosongkan jika tidak diubah' : '',
          }}
        />
      </div>

      <span className="text-xs text-gray-400 font-medium mt-7">
        Informasi Pribadi
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Nama Depan"
          name="name"
          register={register}
          error={errors.name}
        />
        <InputField
          label="Nama Belakang"
          name="surname"
          register={register}
          error={errors.surname}
        />
        <InputField
          label="No Hp"
          name="phone"
          register={register}
          error={errors.phone}
        />
        <InputField
          label="Alamat"
          name="address"
          register={register}
          error={errors.address}
        />
        <InputField
          label="Kelahiran"
          name="birthday"
          register={register}
          error={errors.birthday}
          type="date"
        />

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Gender</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register('gender')}
            defaultValue={data?.gender ?? 'PRIA'}
          >
            <option value="PRIA">Pria</option>
            <option value="WANITA">Wanita</option>
          </select>
          {errors.gender?.message && (
            <p className="text-xs text-red-400">
              {String(errors.gender.message)}
            </p>
          )}
        </div>

        <InputField
          label="Bidang"
          name="bidang"
          register={register}
          error={errors.bidang as any}
        />

        <div className="flex flex-col w-44">
          <label className="text-xs text-gray-500">Desa Binaan</label>
          <select
            multiple
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register('desaBinaanIds' as any)}
            defaultValue={data?.desaBinaan?.map((desa: any) => desa.id) || []}
          >
            {desaBinaan.map(
              (desa: { id: string; name: string; kecamatan?: string }) => (
                <option key={desa.id} value={desa.id}>
                  {desa.name}
                  {desa.kecamatan ? ` - ${desa.kecamatan}` : ''}
                </option>
              )
            )}
          </select>
          {(errors as any).desaBinaanIds?.message && (
            <p className="text-xs text-red-400">
              {String((errors as any).desaBinaanIds.message)}
            </p>
          )}
        </div>

        <CldUploadWidget
          uploadPreset="SIM-BPP"
          onSuccess={(result, { widget }) => {
            setImg((result as any).info);
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
      </div>

      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === 'create' ? 'Buat' : 'Update'}
      </button>
    </form>
  );
};

export default PenyuluhForm;
