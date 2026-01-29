/*
  Warnings:

  - You are about to drop the column `meetupImageKey` on the `UserMeetupHistory` table. All the data in the column will be lost.
  - Added the required column `meetupImageUrl` to the `UserMeetupHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserMeetupHistory" DROP COLUMN "meetupImageKey",
ADD COLUMN     "meetupImageUrl" TEXT NOT NULL;
