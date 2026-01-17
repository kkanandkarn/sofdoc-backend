/*
  Warnings:

  - A unique constraint covering the columns `[fileId]` on the table `url_mapper` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "url_mapper_fileId_key" ON "url_mapper"("fileId");
