-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('JOIN_REQUEST', 'PARTICIPANT_APPROVED', 'PARTICIPANT_REJECTED', 'MEETUP_CANCELLED', 'MEETUP_UPDATED');

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "data" JSONB NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "notifications_userId_isRead_createdAt_idx" ON "notifications"("userId", "isRead", "createdAt");
