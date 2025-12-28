-- AddForeignKey
ALTER TABLE "url_mapper" ADD CONSTRAINT "url_mapper_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
