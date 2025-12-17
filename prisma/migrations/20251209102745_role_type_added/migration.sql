/*
  Warnings:

  - Added the required column `roleType` to the `roles` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RoleType" AS ENUM ('ADMIN', 'GENERAL');

-- AlterTable
ALTER TABLE "roles" ADD COLUMN     "roleType" "RoleType" NOT NULL;
