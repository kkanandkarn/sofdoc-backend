/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `whitelist_email` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "whitelist_email_email_key" ON "whitelist_email"("email");
