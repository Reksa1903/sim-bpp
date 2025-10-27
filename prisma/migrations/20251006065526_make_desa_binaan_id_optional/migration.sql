-- DropForeignKey
ALTER TABLE "KelompokTani" DROP CONSTRAINT "KelompokTani_desaBinaanId_fkey";

-- AlterTable
ALTER TABLE "KelompokTani" ALTER COLUMN "desaBinaanId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "KelompokTani" ADD CONSTRAINT "KelompokTani_desaBinaanId_fkey" FOREIGN KEY ("desaBinaanId") REFERENCES "DesaBinaan"("id") ON DELETE SET NULL ON UPDATE CASCADE;
