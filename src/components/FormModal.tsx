// src/components/FormModal.tsx

'use client';

import NextDynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { TABLES, TableName } from "./forms/tableRegistry";
import {
  deleteDesaBinaan,
  deleteDokumentasiAcaraFromForm,
  deleteKegiatan,
  deleteKelompokTani,
  deleteKiosPertanian,
  deleteMateri,
  deletePengumuman,
  deletePenyuluh,
} from "@/lib/actions";

// ========== Delete ACTION Registry (Aman dari typo) ==========
const deleteActionMap: Record<TableName, any> = {
  penyuluh: deletePenyuluh,
  kelompoktani: deleteKelompokTani,
  kiospertanian: deleteKiosPertanian,
  materi: deleteMateri,
  kegiatan: deleteKegiatan,
  dokumentasiacara: deleteDokumentasiAcaraFromForm,
  pengumuman: deletePengumuman,
  desabinaan: deleteDesaBinaan,
};

// ========== Dynamic FORM Registry (auto import) ==========
const FORM_MAP: Record<TableName, any> = {
  penyuluh: NextDynamic(() => import("./forms/PenyuluhForm")),
  kelompoktani: NextDynamic(() => import("./forms/KelompokTaniForm")),
  kiospertanian: NextDynamic(() => import("./forms/KiosPertanianForm")),
  kegiatan: NextDynamic(() => import("./forms/KegiatanForm")),
  materi: NextDynamic(() => import("./forms/MateriForm")),
  dokumentasiacara: NextDynamic(() => import("./forms/DokumentasiAcaraForm")),
  pengumuman: NextDynamic(() => import("./forms/PengumumanForm")),
  desabinaan: NextDynamic(() => import("./forms/DesaBinaanForm")),
};

type ModalProps = {
  table: TableName;
  type: "create" | "update" | "delete" | "download";
  data?: any;
  id?: string | number;
  href?: string;
  relatedData?: any;
};

const FormModal = ({ table, type, data, id, href, relatedData }: ModalProps) => {
  const Form = FORM_MAP[table];
  const deleteAction = deleteActionMap[table];
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const icon = `/${type}.png`;
  const size = type === "create" ? "w-8 h-8" : "w-7 h-7";

  // ================= Delete Handler ===================
  const handleDelete = async (e: any) => {
    e.preventDefault();
    if (!deleteAction || !id) return;

    try {
      setDeleting(true);
      const fd = new FormData();
      fd.append("id", String(id));

      const initial = { success: false, error: false };
      const res = await deleteAction(initial, fd);

      if (res.success) {
        setOpen(false);
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <button className={`${size} rounded-full bg-BppYellow flex items-center justify-center`}
        onClick={() => setOpen(true)}>
        <Image src={icon} alt={type} width={16} height={16} />
      </button>

      {open && (
        <div className="fixed left-0 top-0 w-screen h-screen bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md w-[90%] md:w-[60%] relative">

            {/* Delete Mode */}
            {type === "delete" && (
              <form onSubmit={handleDelete} className="flex flex-col gap-4">
                <p className="text-center">Yakin ingin menghapus data?</p>
                <button className="bg-red-500 text-white px-4 py-2 rounded-md"
                  disabled={deleting}>
                  {deleting ? "Menghapus..." : "Hapus"}
                </button>
              </form>
            )}

            {/* Create / Update */}
            {(type === "create" || type === "update") && (
              <Form data={data} type={type} setOpen={setOpen} relatedData={relatedData} />
            )}

            {/* close button */}
            <div className="absolute top-3 right-3 cursor-pointer"
              onClick={() => setOpen(false)}>
              <Image src="/close.png" alt="close" width={16} height={16} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;
