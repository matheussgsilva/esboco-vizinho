-- CreateEnum
CREATE TYPE "BusinessEventType" AS ENUM ('PROFILE_VIEW', 'CLICK_PHONE', 'CLICK_WHATSAPP', 'CLICK_SOCIAL');

-- CreateTable
CREATE TABLE "BusinessEvent" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "type" "BusinessEventType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BusinessEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BusinessEvent_businessId_type_createdAt_idx" ON "BusinessEvent"("businessId", "type", "createdAt");

-- AddForeignKey
ALTER TABLE "BusinessEvent" ADD CONSTRAINT "BusinessEvent_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;
