/*
  Warnings:

  - You are about to drop the column `permissionname` on the `GlobalPermissionMaster` table. All the data in the column will be lost.
  - Added the required column `permissionName` to the `GlobalPermissionMaster` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GlobalPermissionMaster" DROP COLUMN "permissionname",
ADD COLUMN     "permissionName" TEXT NOT NULL;
