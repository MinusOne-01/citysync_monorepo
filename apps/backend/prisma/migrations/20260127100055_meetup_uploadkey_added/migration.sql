/*
  Warnings:

  - Added the required column `meetupImageKey` to the `meetups` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "meetups" ADD COLUMN     "meetupImageKey" TEXT NOT NULL;
