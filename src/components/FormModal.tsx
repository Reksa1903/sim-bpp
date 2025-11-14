// src/components/FormModal.tsx
'use client';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;
export const runtime = 'nodejs';

import {
  deleteDesaBinaan,
  deleteDokumentasiAcaraFromForm,
  deleteKegiatan,
  deleteKelompokTani,
  deleteKiosPertanian,
  deleteMateri,
  deletePengumuman,
  deletePenyuluh,
} from '@/lib/actions';
import NextDynamic from 'next/dynamic';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { FormContainerProps } from './FormContainer';

// ===== map delete actions =====
const deleteActionMap: Record<string, any> = {
  penyuluh: deletePenyuluh,
  kelompoktani: deleteKelompokTani,
  materi: deleteMateri,
  kegiatan: deleteKegiatan,
  dokumentasiacara: deleteDokumentasiAcaraFromForm,
  pengumuman: deletePengumuman,
  kisopertanian: deleteKiosPertanian,
  desabinaan: deleteDesaBinaan,
};

// ===== lazy forms =====
const PenyuluhForm = NextDynamic(() => import('./forms/PenyuluhForm'), {
  loading: () => <h1>Loading...</h1>,
});
const KelompokTaniForm = NextDynamic(() => import('./forms/KelompokTaniForm'), {
  loading: () => <h1>Loading...</h1>,
});
const DesaBinaanForm = NextDynamic(() => import('./forms/DesaBinaanForm'), {
  loading: () => <h1>Loading...</h1>,
});
const KiosPertanianForm = NextDynamic(() => import('./forms/KiosPertanianForm'), {
  loading: () => <h1>Loading...</h1>,
});
const MateriForm = NextDynamic(() => import('./forms/MateriForm'), {
  loading: () => <h1>Loading...</h1>,
});
const KegiatanForm = NextDynamic(() => import('./forms/KegiatanForm'), {
  loading: () => <h1>Loading...</h1>,
});
const DokumentasiAcaraForm = NextDynamic(
  () => import('./forms/DokumentasiAcaraForm'),
  { loading: () => <h1>Loading...</h1> }
);
const PengumumanForm = NextDynamic(() => import('./forms/PengumumanForm'), {
  loading: () => <h1>Loading...</h1>,
});

// ===== form switcher =====
const forms: {
  [key: string]: (
    type: 'create' | 'update',
    data: any,
    setOpen: Dispatch<SetStateAction<boolean>>,
    relatedData?: any
  ) => JSX.Element;
} = {
  penyuluh: (type, data, setOpen, relatedData) => (
    <PenyuluhForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  kelompoktani: (type, data, setOpen, relatedData) => (
    <KelompokTaniForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  desabinaan: (type, data, setOpen, relatedData) => (
    <DesaBinaanForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  kisopertanian: (type, data, setOpen) => (
    <KiosPertanianForm type={type} data={data} setOpen={setOpen} />
  ),
  materi: (type, data, setOpen, relatedData) => (
    <MateriForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  kegiatan: (type, data, setOpen, relatedData) => (
    <KegiatanForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  dokumentasiacara: (type, data, setOpen, relatedData) => (
    <DokumentasiAcaraForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  pengumuman: (type, data, setOpen, relatedData) => (
    <PengumumanForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
};

const FormModal = ({
  table,
  type,
  data,
  id,
  href,
  relatedData,
}: FormContainerProps & { relatedData?: any }) => {
  const size = type === 'create' ? 'w-8 h-8' : 'w-7 h-7';
  const bgColor =
    type === 'create'
      ? 'bg-BppYellow'
      : type === 'update'
        ? 'bg-BppGreen'
        : type === 'delete'
          ? 'bg-BppBlue'
          : 'bg-BppPurple';

  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  const deleteAction = useMemo(() => deleteActionMap[table], [table]);

  // ---- DELETE handler (client-side) ----
  const handleDelete = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!deleteAction || !id) return;

    try {
      setDeleting(true);

      // mayoritas delete actions kamu bertipe (_state, FormData)
      const fd = new FormData();
      fd.append('id', String(id));

      const initial = { success: false, error: false };
      const res =
        // bila action kamu menerima FormData langsung:
        await deleteAction(initial, fd);

      if (res?.success) {
        toast.success('Data telah dihapus!');
        setOpen(false);
        router.refresh();
      } else {
        toast.error('Gagal menghapus data.');
      }
    } catch (err) {
      console.error('Delete error:', err);
      toast.error('Terjadi kesalahan saat menghapus.');
    } finally {
      setDeleting(false);
    }
  };

  // ---- Inner content ----
  const Form = () => {
    if (type === 'delete' && id) {
      if (!deleteAction) {
        return (
          <div className="p-4 text-sm">
            Aksi hapus belum tersedia untuk tabel <b>{table}</b>.
          </div>
        );
      }

      return (
        <form onSubmit={handleDelete} className="p-4 flex flex-col gap-4">
          <span className="text-center font-medium">
            Data pada <b>{table}</b> yang dipilih akan hilang. Apakah Anda
            yakin?
          </span>

          <button
            disabled={deleting}
            className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center disabled:opacity-60"
          >
            {deleting ? 'Menghapus…' : 'Hapus'}
          </button>
        </form>
      );
    }

    if (type === 'create' || type === 'update') {
      if (typeof forms[table] === 'function') {
        return forms[table](type, data, setOpen, relatedData);
      }
      return <p>Form tidak ditemukan.</p>;
    }

    return <p>Formulir tidak ditemukan!</p>;
  };

  const icon = `/${type}.png`;

  if (type === 'download' && href) {
    return (
      <a
        href={href}
        download
        className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
        title="Unduh"
      >
        <Image src={icon} alt="Download" width={16} height={16} />
      </a>
    );
  }

  return (
    <>
      <button
        className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
        title={type.charAt(0).toUpperCase() + type.slice(1)}
        onClick={() => setOpen(true)}
      >
        <Image src={icon} alt={type} width={16} height={16} />
      </button>

      {open && (
        <div className="w-screen h-screen absolute left-0 top-0 bg-black/60 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
            <Form />
            <div
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setOpen(false)}
              aria-label="Tutup modal"
            >
              <Image src="/close.png" alt="Tutup" width={14} height={14} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;
