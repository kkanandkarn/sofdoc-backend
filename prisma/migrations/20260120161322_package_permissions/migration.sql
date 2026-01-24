/*
  Warnings:

  - The primary key for the `global_permission_master` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `packageId` on the `global_permission_master` table. All the data in the column will be lost.
  - The `id` column on the `global_permission_master` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `link_details` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `link_details` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `otp` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `otp` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `otp_count` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `otp_count` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `packages` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `packages` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `roles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `roles` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `tenants` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `tenants` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `url_mapper` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `url_mapper` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `userId` column on the `url_mapper` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `tenantId` column on the `url_mapper` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `roleId` column on the `url_mapper` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `roleId` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `tenantId` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `whitelist_email` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `whitelist_email` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `global_role_permissions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `global_tenant_permissions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `global_user_permissions` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[permissionName,parent]` on the table `global_permission_master` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `tenantId` on the `roles` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `packageId` on the `tenants` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "global_permission_master" DROP CONSTRAINT "global_permission_master_packageId_fkey";

-- DropForeignKey
ALTER TABLE "global_role_permissions" DROP CONSTRAINT "global_role_permissions_permissionId_fkey";

-- DropForeignKey
ALTER TABLE "global_role_permissions" DROP CONSTRAINT "global_role_permissions_roleId_fkey";

-- DropForeignKey
ALTER TABLE "global_tenant_permissions" DROP CONSTRAINT "global_tenant_permissions_permissionsId_fkey";

-- DropForeignKey
ALTER TABLE "global_tenant_permissions" DROP CONSTRAINT "global_tenant_permissions_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "global_user_permissions" DROP CONSTRAINT "global_user_permissions_permissionId_fkey";

-- DropForeignKey
ALTER TABLE "global_user_permissions" DROP CONSTRAINT "global_user_permissions_userId_fkey";

-- DropForeignKey
ALTER TABLE "roles" DROP CONSTRAINT "roles_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "tenants" DROP CONSTRAINT "tenants_packageId_fkey";

-- DropForeignKey
ALTER TABLE "url_mapper" DROP CONSTRAINT "url_mapper_roleId_fkey";

-- DropForeignKey
ALTER TABLE "url_mapper" DROP CONSTRAINT "url_mapper_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "url_mapper" DROP CONSTRAINT "url_mapper_userId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_roleId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_tenantId_fkey";

-- DropIndex
DROP INDEX "global_permission_master_permissionName_parent_packageId_key";

-- AlterTable
ALTER TABLE "global_permission_master" DROP CONSTRAINT "global_permission_master_pkey",
DROP COLUMN "packageId",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "global_permission_master_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "link_details" DROP CONSTRAINT "link_details_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "link_details_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "otp" DROP CONSTRAINT "otp_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "otp_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "otp_count" DROP CONSTRAINT "otp_count_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "otp_count_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "packages" DROP CONSTRAINT "packages_pkey",
ADD COLUMN     "isMaster" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "packages_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "roles" DROP CONSTRAINT "roles_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "tenantId",
ADD COLUMN     "tenantId" INTEGER NOT NULL,
ADD CONSTRAINT "roles_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "tenants" DROP CONSTRAINT "tenants_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "packageId",
ADD COLUMN     "packageId" INTEGER NOT NULL,
ADD CONSTRAINT "tenants_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "url_mapper" DROP CONSTRAINT "url_mapper_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER,
DROP COLUMN "tenantId",
ADD COLUMN     "tenantId" INTEGER,
ALTER COLUMN "createdBy" SET DEFAULT 'SYSTEM',
ALTER COLUMN "updatedBy" SET DEFAULT 'SYSTEM',
DROP COLUMN "roleId",
ADD COLUMN     "roleId" INTEGER,
ADD CONSTRAINT "url_mapper_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
ADD COLUMN     "packageId" INTEGER,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "roleId",
ADD COLUMN     "roleId" INTEGER,
DROP COLUMN "tenantId",
ADD COLUMN     "tenantId" INTEGER,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "whitelist_email" DROP CONSTRAINT "whitelist_email_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "whitelist_email_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "global_role_permissions";

-- DropTable
DROP TABLE "global_tenant_permissions";

-- DropTable
DROP TABLE "global_user_permissions";

-- CreateTable
CREATE TABLE "package_permissions" (
    "id" SERIAL NOT NULL,
    "packageId" INTEGER NOT NULL,
    "permissionsId" INTEGER NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "createdBy" TEXT NOT NULL DEFAULT 'System',
    "updatedBy" TEXT NOT NULL DEFAULT 'System',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "package_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "global_permission_master_permissionName_parent_key" ON "global_permission_master"("permissionName", "parent");

-- AddForeignKey
ALTER TABLE "package_permissions" ADD CONSTRAINT "package_permissions_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "packages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "package_permissions" ADD CONSTRAINT "package_permissions_permissionsId_fkey" FOREIGN KEY ("permissionsId") REFERENCES "global_permission_master"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenants" ADD CONSTRAINT "tenants_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "packages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roles" ADD CONSTRAINT "roles_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "packages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "url_mapper" ADD CONSTRAINT "url_mapper_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "url_mapper" ADD CONSTRAINT "url_mapper_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "url_mapper" ADD CONSTRAINT "url_mapper_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE;
