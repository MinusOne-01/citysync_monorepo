/*
  Warnings:

  - Added the required column `username` to the `participations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "participations" ADD COLUMN     "username" TEXT NOT NULL;
