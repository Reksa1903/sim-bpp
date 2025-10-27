-- DropForeignKey
ALTER TABLE "Pengumuman" DROP CONSTRAINT "Pengumuman_desaBinaanId_fkey";

-- DropForeignKey
ALTER TABLE "Pengumuman" DROP CONSTRAINT "Pengumuman_kelompokTaniId_fkey";

-- AlterTable
ALTER TABLE "Pengumuman" ALTER COLUMN "kelompokTaniId" DROP NOT NULL,
ALTER COLUMN "desaBinaanId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Pengumuman" ADD CONSTRAINT "Pengumuman_kelompokTaniId_fkey" FOREIGN KEY ("kelompokTaniId") REFERENCES "KelompokTani"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pengumuman" ADD CONSTRAINT "Pengumuman_desaBinaanId_fkey" FOREIGN KEY ("desaBinaanId") REFERENCES "DesaBinaan"("id") ON DELETE SET NULL ON UPDATE CASCADE;
