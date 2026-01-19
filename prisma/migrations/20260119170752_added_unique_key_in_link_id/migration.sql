/*
  Warnings:

  - A unique constraint covering the columns `[linkId]` on the table `link_details` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Status" ADD VALUE 'EXPIRED';
ALTER TYPE "Status" ADD VALUE 'USED';

-- CreateIndex
CREATE UNIQUE INDEX "link_details_linkId_key" ON "link_details"("linkId");
