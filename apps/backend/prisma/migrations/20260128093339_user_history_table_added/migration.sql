/*
  Warnings:

  - You are about to drop the `user_meetup_history` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "user_meetup_history";

-- CreateTable
CREATE TABLE "UserMeetupHistory" (
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

    CONSTRAINT "UserMeetupHistory_pkey" PRIMARY KEY ("userId","meetupId")
);

-- CreateIndex
CREATE INDEX "UserMeetupHistory_userId_meetupDate_idx" ON "UserMeetupHistory"("userId", "meetupDate" DESC);
