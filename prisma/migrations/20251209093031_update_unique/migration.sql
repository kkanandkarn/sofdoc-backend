/*
  Warnings:

  - A unique constraint covering the columns `[permissionName,parent,packageId]` on the table `global_permission_master` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "global_permission_master_permissionName_parent_key";

-- CreateIndex
CREATE UNIQUE INDEX "global_permission_master_permissionName_parent_packageId_key" ON "global_permission_master"("permissionName", "parent", "packageId");
