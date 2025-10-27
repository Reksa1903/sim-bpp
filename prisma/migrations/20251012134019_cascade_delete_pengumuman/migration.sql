-- DropForeignKey
ALTER TABLE "KiosPengumuman" DROP CONSTRAINT "KiosPengumuman_pengumumanId_fkey";

-- AddForeignKey
ALTER TABLE "KiosPengumuman" ADD CONSTRAINT "KiosPengumuman_pengumumanId_fkey" FOREIGN KEY ("pengumumanId") REFERENCES "Pengumuman"("id") ON DELETE CASCADE ON UPDATE CASCADE;
