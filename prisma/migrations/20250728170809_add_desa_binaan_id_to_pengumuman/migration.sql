/*
  Warnings:

  - Added the required column `desaBinaanId` to the `Pengumuman` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pengumuman" ADD COLUMN     "desaBinaanId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Pengumuman" ADD CONSTRAINT "Pengumuman_desaBinaanId_fkey" FOREIGN KEY ("desaBinaanId") REFERENCES "DesaBinaan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
