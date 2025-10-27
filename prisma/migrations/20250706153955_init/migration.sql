-- CreateEnum
CREATE TYPE "Day" AS ENUM ('Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat');

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Penyuluh" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "img" TEXT,
    "bidang" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Penyuluh_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DesaBinaan" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "penyuluhId" TEXT NOT NULL,

    CONSTRAINT "DesaBinaan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KelompokTani" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "ketua" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "img" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "desaBinaanId" INTEGER NOT NULL,

    CONSTRAINT "KelompokTani_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KiosPertanian" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KiosPertanian_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Materi" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "uploadDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateDate" TIMESTAMP(3) NOT NULL,
    "penyuluhId" TEXT NOT NULL,

    CONSTRAINT "Materi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Kegiatan" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "day" "Day" NOT NULL,
    "penyuluhId" TEXT NOT NULL,

    CONSTRAINT "Kegiatan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DokumentasiAcara" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "photo" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "penyuluhId" TEXT NOT NULL,

    CONSTRAINT "DokumentasiAcara_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pengumuman" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "penyuluhId" TEXT NOT NULL,
    "kelompokTaniId" INTEGER,

    CONSTRAINT "Pengumuman_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Penyuluh_username_key" ON "Penyuluh"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Penyuluh_email_key" ON "Penyuluh"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Penyuluh_phone_key" ON "Penyuluh"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "KelompokTani_email_key" ON "KelompokTani"("email");

-- CreateIndex
CREATE UNIQUE INDEX "KelompokTani_phone_key" ON "KelompokTani"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "KiosPertanian_phone_key" ON "KiosPertanian"("phone");

-- AddForeignKey
ALTER TABLE "DesaBinaan" ADD CONSTRAINT "DesaBinaan_penyuluhId_fkey" FOREIGN KEY ("penyuluhId") REFERENCES "Penyuluh"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KelompokTani" ADD CONSTRAINT "KelompokTani_desaBinaanId_fkey" FOREIGN KEY ("desaBinaanId") REFERENCES "DesaBinaan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Materi" ADD CONSTRAINT "Materi_penyuluhId_fkey" FOREIGN KEY ("penyuluhId") REFERENCES "Penyuluh"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kegiatan" ADD CONSTRAINT "Kegiatan_penyuluhId_fkey" FOREIGN KEY ("penyuluhId") REFERENCES "Penyuluh"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DokumentasiAcara" ADD CONSTRAINT "DokumentasiAcara_penyuluhId_fkey" FOREIGN KEY ("penyuluhId") REFERENCES "Penyuluh"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pengumuman" ADD CONSTRAINT "Pengumuman_penyuluhId_fkey" FOREIGN KEY ("penyuluhId") REFERENCES "Penyuluh"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pengumuman" ADD CONSTRAINT "Pengumuman_kelompokTaniId_fkey" FOREIGN KEY ("kelompokTaniId") REFERENCES "KelompokTani"("id") ON DELETE SET NULL ON UPDATE CASCADE;
