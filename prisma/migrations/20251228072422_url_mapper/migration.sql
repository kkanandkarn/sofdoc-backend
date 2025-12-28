-- CreateTable
CREATE TABLE "url_mapper" (
    "id" SERIAL NOT NULL,
    "fileId" TEXT NOT NULL,
    "originalUrl" TEXT NOT NULL,
    "mapUrl" TEXT NOT NULL,
    "fileName" TEXT,
    "originalFileName" TEXT,
    "mimeType" TEXT,
    "fileSize" TEXT,
    "userId" INTEGER,
    "tenantId" INTEGER,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "createdBy" INTEGER,
    "updatedBy" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "url_mapper_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "url_mapper" ADD CONSTRAINT "url_mapper_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "url_mapper" ADD CONSTRAINT "url_mapper_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE;
