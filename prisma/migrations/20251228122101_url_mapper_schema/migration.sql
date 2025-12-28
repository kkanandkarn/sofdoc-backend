/*
  Warnings:

  - Added the required column `fileType` to the `url_mapper` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originalFileSize` to the `url_mapper` table without a default value. This is not possible if the table is not empty.
  - Made the column `fileName` on table `url_mapper` required. This step will fail if there are existing NULL values in that column.
  - Made the column `originalFileName` on table `url_mapper` required. This step will fail if there are existing NULL values in that column.
  - Made the column `mimeType` on table `url_mapper` required. This step will fail if there are existing NULL values in that column.
  - Made the column `fileSize` on table `url_mapper` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "url_mapper" ADD COLUMN     "fileType" TEXT NOT NULL,
ADD COLUMN     "originalFileSize" TEXT NOT NULL,
ADD COLUMN     "roleId" INTEGER,
ALTER COLUMN "fileName" SET NOT NULL,
ALTER COLUMN "originalFileName" SET NOT NULL,
ALTER COLUMN "mimeType" SET NOT NULL,
ALTER COLUMN "fileSize" SET NOT NULL;
