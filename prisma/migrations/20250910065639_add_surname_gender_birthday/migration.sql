/*
  Warnings:

  - Added the required column `birthday` to the `Penyuluh` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `Penyuluh` table without a default value. This is not possible if the table is not empty.
  - Added the required column `surname` to the `Penyuluh` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserSex" AS ENUM ('PRIA', 'WANITA');

-- AlterTable
ALTER TABLE "Penyuluh" ADD COLUMN     "birthday" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "gender" "UserSex" NOT NULL,
ADD COLUMN     "surname" TEXT NOT NULL;
