-- CreateTable
CREATE TABLE "KiosPengumuman" (
    "id" SERIAL NOT NULL,
    "kiosPertanianId" INTEGER NOT NULL,
    "pengumumanId" INTEGER NOT NULL,

    CONSTRAINT "KiosPengumuman_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "KiosPengumuman_kiosPertanianId_pengumumanId_key" ON "KiosPengumuman"("kiosPertanianId", "pengumumanId");

-- AddForeignKey
ALTER TABLE "KiosPengumuman" ADD CONSTRAINT "KiosPengumuman_kiosPertanianId_fkey" FOREIGN KEY ("kiosPertanianId") REFERENCES "KiosPertanian"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KiosPengumuman" ADD CONSTRAINT "KiosPengumuman_pengumumanId_fkey" FOREIGN KEY ("pengumumanId") REFERENCES "Pengumuman"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
