/*
  Warnings:

  - The primary key for the `Materi` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Materi" DROP CONSTRAINT "Materi_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Materi_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Materi_id_seq";
