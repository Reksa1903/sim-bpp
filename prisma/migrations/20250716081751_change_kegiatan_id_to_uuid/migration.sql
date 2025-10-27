/*
  Warnings:

  - The primary key for the `Kegiatan` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Kegiatan" DROP CONSTRAINT "Kegiatan_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Kegiatan_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Kegiatan_id_seq";
