-- DropForeignKey
ALTER TABLE "DesaBinaan" DROP CONSTRAINT "DesaBinaan_penyuluhId_fkey";

-- AlterTable
ALTER TABLE "DesaBinaan" ALTER COLUMN "penyuluhId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "DesaBinaan" ADD CONSTRAINT "DesaBinaan_penyuluhId_fkey" FOREIGN KEY ("penyuluhId") REFERENCES "Penyuluh"("id") ON DELETE SET NULL ON UPDATE CASCADE;
