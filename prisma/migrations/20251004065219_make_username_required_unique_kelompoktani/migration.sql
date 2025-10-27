/*
  Warnings:

  - Made the column `username` on table `KelompokTani` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "KelompokTani" ALTER COLUMN "username" SET NOT NULL;
