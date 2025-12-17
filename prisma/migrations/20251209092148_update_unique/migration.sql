/*
  Warnings:

  - A unique constraint covering the columns `[permissionName,parent]` on the table `global_permission_master` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "global_permission_master_permissionName_parent_key" ON "global_permission_master"("permissionName", "parent");
