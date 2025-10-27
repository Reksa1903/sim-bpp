/*
  Warnings:

  - The primary key for the `KelompokTani` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Made the column `kelompokTaniId` on table `Pengumuman` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Pengumuman" DROP CONSTRAINT "Pengumuman_kelompokTaniId_fkey";

-- AlterTable
ALTER TABLE "KelompokTani" DROP CONSTRAINT "KelompokTani_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "KelompokTani_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "KelompokTani_id_seq";

-- AlterTable
ALTER TABLE "Pengumuman" ALTER COLUMN "kelompokTaniId" SET NOT NULL,
ALTER COLUMN "kelompokTaniId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "Pengumuman" ADD CONSTRAINT "Pengumuman_kelompokTaniId_fkey" FOREIGN KEY ("kelompokTaniId") REFERENCES "KelompokTani"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
