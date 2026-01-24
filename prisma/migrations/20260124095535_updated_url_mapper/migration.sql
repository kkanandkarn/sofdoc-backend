/*
  Warnings:

  - The `createdBy` column on the `url_mapper` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `updatedBy` column on the `url_mapper` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "url_mapper" DROP COLUMN "createdBy",
ADD COLUMN     "createdBy" INTEGER,
DROP COLUMN "updatedBy",
ADD COLUMN     "updatedBy" INTEGER;
