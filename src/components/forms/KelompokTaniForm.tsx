// src/components/forms/KelompokTaniForm.tsx
'use client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import InputField from '../InputField';
import Image from 'next/image';
import { Dispatch, SetStateAction } from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { DesaBinaan } from '@prisma/client'; // ✅ ditambahkan import ini
import {
  createKelompokTaniFromForm,
  updateKelompokTaniFromForm,
} from '@/lib/actions';
import {
  kelompokTaniSchema,
  KelompokTaniSchema,
} from '@/lib/formValidationSchemas';

type FormState = { success: boolean; error: boolean };

const KelompokTaniForm = ({
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
  // ✅ DesaBinaan bertipe kuat (typed)
  const desaList: DesaBinaan[] = useMemo(
    () => (relatedData?.desaBinaan ? relatedData.desaBinaan : []),
    [relatedData]
  );

  const penyuluhList = useMemo(
    () => (relatedData?.penyuluh ? relatedData.penyuluh : []),
    [relatedData]
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<KelompokTaniSchema>({
    resolver: zodResolver(kelompokTaniSchema) as any,
    defaultValues: {
      id: data?.id ?? undefined,
      username: data?.username ?? '',
      password: '', // kosongkan saat update
      name: data?.name ?? '',
      ketua: data?.ketua ?? '',
      phone: data?.phone ?? '',
      address: data?.address ?? '',
      luasArea: data?.luasArea ?? '', // ✅ tambahkan luasArea
      desaBinaanId: data?.desaBinaanId ?? '',
      penyuluhId: data?.penyuluhId ?? data?.desaBinaan?.penyuluh?.id ?? '',
      img: data?.img ?? '',
    } as any,
  });

  const router = useRouter();
  const [img, setImg] = useState<any>(null);
  const selectedDesaId = watch('desaBinaanId');

  // ✅ Filter penyuluh berdasarkan desa
  const filteredPenyuluh = useMemo(() => {
    if (!selectedDesaId) return [];
    return penyuluhList.filter((p: any) => {
      if (!p?.desaBinaan) return false;
      return p.desaBinaan.some(
        (db: any) => String(db.id) === String(selectedDesaId)
      );
    });
  }, [selectedDesaId, penyuluhList]);

  // ✅ Sinkronisasi penyuluh otomatis berdasarkan desa
  useEffect(() => {
    if (!selectedDesaId) {
      setValue('penyuluhId', '');
      return;
    }

    const desa = desaList.find(
      (d: DesaBinaan) => String(d.id) === String(selectedDesaId)
    );

    if ((desa as any)?.penyuluh?.id) {
      setValue('penyuluhId', (desa as any).penyuluh.id);
      return;
    }

    if (filteredPenyuluh.length === 1) {
      setValue('penyuluhId', filteredPenyuluh[0].id);
      return;
    }

    setValue('penyuluhId', '');
  }, [selectedDesaId, desaList, filteredPenyuluh, setValue]);

  // ✅ Submit handler
  const onSubmit = handleSubmit(async (formValues) => {
    try {
      const trimmedPwd = (formValues.password ?? '').toString().trim();

      const payload: any = {
        id: data?.id,
        username: formValues.username ?? '',
        name: formValues.name ?? '',
        ketua: formValues.ketua ?? '',
        phone: formValues.phone ?? '',
        address: formValues.address ?? '',
        luasArea:
          formValues.luasArea === ''
            ? null
            : Number(formValues.luasArea) ?? null,
        desaBinaanId: formValues.desaBinaanId ?? '',
        penyuluhId: formValues.penyuluhId ?? '',
        img: img?.secure_url ?? img ?? data?.img ?? null,
      };

      if (trimmedPwd) payload.password = trimmedPwd;

      const initial: FormState = { success: false, error: false };
      const res: FormState =
        type === 'create'
          ? await createKelompokTaniFromForm(initial, payload)
          : await updateKelompokTaniFromForm(initial, payload);

      if (res?.success) {
        toast(
          `Kelompok Tani berhasil ${type === 'create' ? 'dibuat' : 'diubah'}!`
        );
        setOpen(false);
        router.refresh();
      } else {
        toast.error('Gagal menyimpan data kelompok tani. Coba lagi ya.');
      }
    } catch (err: any) {
      console.error('Submit KelompokTani Error:', err);
      toast.error(err?.message ?? 'Terjadi kesalahan saat menyimpan.');
    }
  });

  return (
    <form className="flex flex-col gap-4" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === 'create'
          ? 'Buat Kelompok Tani baru'
          : 'Perbarui Kelompok Tani'}
      </h1>

      {type === 'update' && data?.id && (
        <input type="hidden" {...register('id' as any)} value={data.id} />
      )}

      <span className="text-xs text-gray-400 font-medium">
        Informasi Autentifikasi
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Username"
          name="username"
          register={register}
          error={errors?.username}
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

      <span className="text-xs text-gray-400 font-medium mt-4">
        Informasi Kelompok
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Nama Kelompok"
          name="name"
          register={register}
          error={errors?.name}
        />
        <InputField
          label="Nama Ketua"
          name="ketua"
          register={register}
          error={errors?.ketua}
        />
        <InputField
          label="No Hp"
          name="phone"
          register={register}
          error={errors?.phone}
        />
        <InputField
          label="Alamat"
          name="address"
          register={register}
          error={errors?.address}
        />
        {/* ✅ Tambahkan field luasArea */}
        <InputField
          label="Luas Area (hektar)"
          name="luasArea"
          type="number"
          register={register}
          error={errors?.luasArea}
        />

        {/* Desa Binaan select */}
        <div className="flex flex-col w-44">
          <label className="text-xs text-gray-500">Desa Binaan</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register('desaBinaanId' as any)}
            defaultValue={data?.desaBinaanId ?? ''}
          >
            <option value="">-- Pilih Desa Binaan --</option>
            {desaList.map((desa) => (
              <option key={desa.id} value={desa.id}>
                {desa.name}
              </option>
            ))}
          </select>
          {(errors as any).desaBinaanId?.message && (
            <p className="text-xs text-red-400">
              {String((errors as any).desaBinaanId.message)}
            </p>
          )}
        </div>

        {/* Penyuluh select */}
        <div className="flex flex-col w-44">
          <label className="text-xs text-gray-500">
            Penyuluh (penanggung jawab)
          </label>
          <input type="hidden" {...register('penyuluhId' as any)} />
          {selectedDesaId && filteredPenyuluh.length === 0 ? (
            <div className="p-2 text-sm text-gray-500">
              Tidak ada penyuluh tersedia untuk desa ini.
            </div>
          ) : (
            <select
              className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
              {...register('penyuluhId' as any)}
              value={String(watch && (watch('penyuluhId') ?? ''))}
              onChange={(e) => setValue('penyuluhId', e.target.value)}
              disabled={!selectedDesaId || filteredPenyuluh.length === 0}
            >
              <option value="">-- Pilih Penyuluh (opsional) --</option>
              {filteredPenyuluh.map((p: any) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Upload foto */}
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

export default KelompokTaniForm;
