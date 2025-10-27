/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `Kegiatan` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Kegiatan_title_key" ON "Kegiatan"("title");
