-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'INACTIVE', 'HOLD', 'SUSPENDED', 'BLOCKED', 'DELETED');

-- CreateTable
CREATE TABLE "GlobalPermissionMaster" (
    "id" SERIAL NOT NULL,
    "permissionname" TEXT NOT NULL,
    "parent" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "createdBy" TEXT NOT NULL DEFAULT 'System',
    "updatedBy" TEXT NOT NULL DEFAULT 'System',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GlobalPermissionMaster_pkey" PRIMARY KEY ("id")
);
