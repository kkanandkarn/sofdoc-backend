/*
  Warnings:

  - The primary key for the `global_permission_master` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `global_role_permissions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `global_tenant_permissions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `global_user_permissions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `otp` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `otp_count` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `packages` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `roles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `tenants` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `url_mapper` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.

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

-- AlterTable
ALTER TABLE "global_permission_master" DROP CONSTRAINT "global_permission_master_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "packageId" SET DATA TYPE TEXT,
ADD CONSTRAINT "global_permission_master_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "global_permission_master_id_seq";

-- AlterTable
ALTER TABLE "global_role_permissions" DROP CONSTRAINT "global_role_permissions_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "roleId" SET DATA TYPE TEXT,
ALTER COLUMN "permissionId" SET DATA TYPE TEXT,
ADD CONSTRAINT "global_role_permissions_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "global_role_permissions_id_seq";

-- AlterTable
ALTER TABLE "global_tenant_permissions" DROP CONSTRAINT "global_tenant_permissions_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "tenantId" SET DATA TYPE TEXT,
ALTER COLUMN "permissionsId" SET DATA TYPE TEXT,
ALTER COLUMN "packageId" SET DATA TYPE TEXT,
ADD CONSTRAINT "global_tenant_permissions_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "global_tenant_permissions_id_seq";

-- AlterTable
ALTER TABLE "global_user_permissions" DROP CONSTRAINT "global_user_permissions_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ALTER COLUMN "permissionId" SET DATA TYPE TEXT,
ADD CONSTRAINT "global_user_permissions_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "global_user_permissions_id_seq";

-- AlterTable
ALTER TABLE "otp" DROP CONSTRAINT "otp_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "otp_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "otp_id_seq";

-- AlterTable
ALTER TABLE "otp_count" DROP CONSTRAINT "otp_count_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "otp_count_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "otp_count_id_seq";

-- AlterTable
ALTER TABLE "packages" DROP CONSTRAINT "packages_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "price" SET DATA TYPE TEXT,
ADD CONSTRAINT "packages_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "packages_id_seq";

-- AlterTable
ALTER TABLE "roles" DROP CONSTRAINT "roles_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "tenantId" SET DATA TYPE TEXT,
ADD CONSTRAINT "roles_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "roles_id_seq";

-- AlterTable
ALTER TABLE "tenants" DROP CONSTRAINT "tenants_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "packageId" SET DATA TYPE TEXT,
ADD CONSTRAINT "tenants_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "tenants_id_seq";

-- AlterTable
ALTER TABLE "url_mapper" DROP CONSTRAINT "url_mapper_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ALTER COLUMN "tenantId" SET DATA TYPE TEXT,
ALTER COLUMN "createdBy" SET DATA TYPE TEXT,
ALTER COLUMN "updatedBy" SET DATA TYPE TEXT,
ALTER COLUMN "roleId" SET DATA TYPE TEXT,
ADD CONSTRAINT "url_mapper_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "url_mapper_id_seq";

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "roleId" SET DATA TYPE TEXT,
ALTER COLUMN "tenantId" SET DATA TYPE TEXT,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "users_id_seq";

-- AddForeignKey
ALTER TABLE "global_permission_master" ADD CONSTRAINT "global_permission_master_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "packages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "global_tenant_permissions" ADD CONSTRAINT "global_tenant_permissions_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "global_tenant_permissions" ADD CONSTRAINT "global_tenant_permissions_permissionsId_fkey" FOREIGN KEY ("permissionsId") REFERENCES "global_permission_master"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenants" ADD CONSTRAINT "tenants_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "packages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roles" ADD CONSTRAINT "roles_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "global_role_permissions" ADD CONSTRAINT "global_role_permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "global_role_permissions" ADD CONSTRAINT "global_role_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "global_tenant_permissions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "global_user_permissions" ADD CONSTRAINT "global_user_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "global_permission_master"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "global_user_permissions" ADD CONSTRAINT "global_user_permissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "url_mapper" ADD CONSTRAINT "url_mapper_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "url_mapper" ADD CONSTRAINT "url_mapper_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "url_mapper" ADD CONSTRAINT "url_mapper_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE;
