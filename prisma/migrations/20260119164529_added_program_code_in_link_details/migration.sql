/*
  Warnings:

  - Added the required column `programCode` to the `link_details` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "link_details" ADD COLUMN     "programCode" TEXT NOT NULL;
