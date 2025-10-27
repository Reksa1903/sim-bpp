-- DropForeignKey
ALTER TABLE "DokumentasiAcara" DROP CONSTRAINT "DokumentasiAcara_penyuluhId_fkey";

-- DropForeignKey
ALTER TABLE "Kegiatan" DROP CONSTRAINT "Kegiatan_penyuluhId_fkey";

-- DropForeignKey
ALTER TABLE "Materi" DROP CONSTRAINT "Materi_penyuluhId_fkey";

-- DropForeignKey
ALTER TABLE "Pengumuman" DROP CONSTRAINT "Pengumuman_penyuluhId_fkey";

-- AlterTable
ALTER TABLE "DokumentasiAcara" ALTER COLUMN "penyuluhId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Kegiatan" ALTER COLUMN "penyuluhId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Materi" ALTER COLUMN "penyuluhId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Pengumuman" ALTER COLUMN "penyuluhId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Materi" ADD CONSTRAINT "Materi_penyuluhId_fkey" FOREIGN KEY ("penyuluhId") REFERENCES "Penyuluh"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kegiatan" ADD CONSTRAINT "Kegiatan_penyuluhId_fkey" FOREIGN KEY ("penyuluhId") REFERENCES "Penyuluh"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DokumentasiAcara" ADD CONSTRAINT "DokumentasiAcara_penyuluhId_fkey" FOREIGN KEY ("penyuluhId") REFERENCES "Penyuluh"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pengumuman" ADD CONSTRAINT "Pengumuman_penyuluhId_fkey" FOREIGN KEY ("penyuluhId") REFERENCES "Penyuluh"("id") ON DELETE SET NULL ON UPDATE CASCADE;
