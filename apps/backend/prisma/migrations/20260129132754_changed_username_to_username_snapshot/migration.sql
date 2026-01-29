/*
  Warnings:

  - You are about to drop the column `username` on the `participations` table. All the data in the column will be lost.
  - Added the required column `usernameSnapshot` to the `participations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "participations" DROP COLUMN "username",
ADD COLUMN     "usernameSnapshot" TEXT NOT NULL;
