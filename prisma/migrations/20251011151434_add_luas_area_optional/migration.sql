/*
  Warnings:

  - You are about to drop the column `email` on the `KelompokTani` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "KelompokTani_email_key";

-- AlterTable
ALTER TABLE "KelompokTani" DROP COLUMN "email",
ADD COLUMN     "luasArea" DOUBLE PRECISION;
