-- DropForeignKey
ALTER TABLE "KiosPengumuman" DROP CONSTRAINT "KiosPengumuman_kiosPertanianId_fkey";

-- AlterTable
ALTER TABLE "KiosPengumuman" ALTER COLUMN "kiosPertanianId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "KiosPengumuman" ADD CONSTRAINT "KiosPengumuman_kiosPertanianId_fkey" FOREIGN KEY ("kiosPertanianId") REFERENCES "KiosPertanian"("id") ON DELETE SET NULL ON UPDATE CASCADE;
