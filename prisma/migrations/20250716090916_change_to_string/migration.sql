/*
  Warnings:

  - The primary key for the `DesaBinaan` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `DokumentasiAcara` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `KiosPengumuman` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `KiosPertanian` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Materi` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Pengumuman` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "KelompokTani" DROP CONSTRAINT "KelompokTani_desaBinaanId_fkey";

-- DropForeignKey
ALTER TABLE "KiosPengumuman" DROP CONSTRAINT "KiosPengumuman_kiosPertanianId_fkey";

-- DropForeignKey
ALTER TABLE "KiosPengumuman" DROP CONSTRAINT "KiosPengumuman_pengumumanId_fkey";

-- AlterTable
ALTER TABLE "DesaBinaan" DROP CONSTRAINT "DesaBinaan_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "DesaBinaan_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "DesaBinaan_id_seq";

-- AlterTable
ALTER TABLE "DokumentasiAcara" DROP CONSTRAINT "DokumentasiAcara_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "DokumentasiAcara_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "DokumentasiAcara_id_seq";

-- AlterTable
ALTER TABLE "KelompokTani" ALTER COLUMN "desaBinaanId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "KiosPengumuman" DROP CONSTRAINT "KiosPengumuman_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "kiosPertanianId" SET DATA TYPE TEXT,
ALTER COLUMN "pengumumanId" SET DATA TYPE TEXT,
ADD CONSTRAINT "KiosPengumuman_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "KiosPengumuman_id_seq";

-- AlterTable
ALTER TABLE "KiosPertanian" DROP CONSTRAINT "KiosPertanian_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "KiosPertanian_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "KiosPertanian_id_seq";

-- AlterTable
ALTER TABLE "Materi" DROP CONSTRAINT "Materi_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Materi_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Materi_id_seq";

-- AlterTable
ALTER TABLE "Pengumuman" DROP CONSTRAINT "Pengumuman_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Pengumuman_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Pengumuman_id_seq";

-- AddForeignKey
ALTER TABLE "KelompokTani" ADD CONSTRAINT "KelompokTani_desaBinaanId_fkey" FOREIGN KEY ("desaBinaanId") REFERENCES "DesaBinaan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KiosPengumuman" ADD CONSTRAINT "KiosPengumuman_kiosPertanianId_fkey" FOREIGN KEY ("kiosPertanianId") REFERENCES "KiosPertanian"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KiosPengumuman" ADD CONSTRAINT "KiosPengumuman_pengumumanId_fkey" FOREIGN KEY ("pengumumanId") REFERENCES "Pengumuman"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
