/*
  Warnings:

  - You are about to drop the column `expiredAt` on the `whitelist_email` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "whitelist_email" DROP COLUMN "expiredAt";
