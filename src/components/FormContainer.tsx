// ✅ src/components/FormContainer.tsx
import prisma from '@/lib/prisma';
import FormModal from './FormModal';

export type FormContainerProps = {
  table:
    | 'penyuluh'
    | 'kelompoktani'
    | 'kisopertanian'
    | 'materi'
    | 'kegiatan'
    | 'dokumentasiacara'
    | 'pengumuman'
    | 'desabinaan';
  type: 'create' | 'update' | 'delete' | 'download';
  data?: any;
  id?: number | string;
  href?: string; // hanya untuk download
};

const FormContainer = async ({
  table,
  type,
  data,
  id,
  href,
}: FormContainerProps) => {
  let relatedData: any = {};

  if (type !== 'delete') {
    switch (table) {
      // === Penyuluh ===
      case 'penyuluh': {
        const desaBinaan = await prisma.desaBinaan.findMany({
          select: { id: true, name: true },
        });
        relatedData = { desaBinaan };
        break;
      }

      // === Kelompok Tani ===
      case 'kelompoktani': {
        const desaBinaan = await prisma.desaBinaan.findMany({
          select: {
            id: true,
            name: true,
            penyuluh: {
              select: { id: true, name: true },
            },
          },
        });

        const penyuluh = await prisma.penyuluh.findMany({
          select: {
            id: true,
            name: true,
            desaBinaan: { select: { id: true } },
          },
        });

        relatedData = { desaBinaan, penyuluh };
        break;
      }

      // === Desa Binaan ===
      case 'desabinaan': {
        const penyuluh = await prisma.penyuluh.findMany({
          select: { id: true, name: true },
        });

        const kelompokTani = await prisma.kelompokTani.findMany({
          select: {
            id: true,
            name: true,
            desaBinaan: { select: { name: true } },
          },
        });

        const kelompokTaniOptions = kelompokTani.map((kt) => ({
          id: kt.id,
          label: `${kt.name} - ${kt.desaBinaan?.name ?? 'Tanpa Desa'}`,
        }));

        relatedData = { penyuluh, kelompokTani: kelompokTaniOptions };
        break;
      }

      // === Materi ===
      case 'materi': {
        const penyuluh = await prisma.penyuluh.findMany({
          select: { id: true, name: true },
        });
        relatedData = { penyuluh };
        break;
      }

      // === Pengumuman ===
      case 'pengumuman': {
        const penyuluh = await prisma.penyuluh.findMany({
          select: { id: true, name: true },
        });

        const kelompokTani = await prisma.kelompokTani.findMany({
          select: {
            id: true,
            name: true,
            desaBinaan: { select: { name: true } },
          },
        });

        const desaBinaan = await prisma.desaBinaan.findMany({
          select: { id: true, name: true },
        });

        const kelompokTaniOptions = kelompokTani.map((kt) => ({
          id: kt.id,
          label: `${kt.name} - ${kt.desaBinaan?.name ?? 'Tanpa Desa'}`,
        }));

        relatedData = {
          penyuluh,
          kelompokTani: kelompokTaniOptions,
          desaBinaan,
        };
        break;
      }

      // === Kegiatan ===
      case 'kegiatan': {
        const penyuluh = await prisma.penyuluh.findMany({
          select: { id: true, name: true },
        });
        relatedData = { penyuluh };
        break;
      }

      // === Dokumentasi Acara ===
      case 'dokumentasiacara': {
        const penyuluh = await prisma.penyuluh.findMany({
          select: { id: true, name: true },
        });
        relatedData = { penyuluh };
        break;
      }

      // === Kios Pertanian ===
      case 'kisopertanian': {
        // Tidak ada relasi ke tabel lain
        relatedData = {};
        break;
      }

      default:
        break;
    }
  }

  return (
    <div>
      <FormModal
        table={table}
        type={type}
        data={data}
        id={id}
        relatedData={relatedData}
        href={href}
      />
    </div>
  );
};

export default FormContainer;
