-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CREATOR', 'PARTICIPANT');

-- CreateTable
CREATE TABLE "user_meetup_history" (
    "userId" TEXT NOT NULL,
    "meetupId" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL,
    "meetupDate" TIMESTAMP(3) NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "city" TEXT,
    "area" TEXT,
    "placeName" TEXT,
    "meetupImageKey" TEXT NOT NULL,

    CONSTRAINT "user_meetup_history_pkey" PRIMARY KEY ("userId","meetupId")
);

-- CreateIndex
CREATE INDEX "user_meetup_history_userId_meetupDate_idx" ON "user_meetup_history"("userId", "meetupDate" DESC);
