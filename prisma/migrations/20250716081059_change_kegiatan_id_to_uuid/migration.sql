/*
  Warnings:

  - The primary key for the `Kegiatan` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Materi` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Materi` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Kegiatan" DROP CONSTRAINT "Kegiatan_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Kegiatan_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Kegiatan_id_seq";

-- AlterTable
ALTER TABLE "Materi" DROP CONSTRAINT "Materi_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Materi_pkey" PRIMARY KEY ("id");
