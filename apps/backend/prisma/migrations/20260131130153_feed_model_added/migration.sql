-- DropIndex
DROP INDEX "meetups_status_idx";

-- CreateTable
CREATE TABLE "region_hot_meetups" (
    "regionKey" TEXT NOT NULL,
    "meetupId" TEXT NOT NULL,
    "popularityScore" DOUBLE PRECISION NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "region_hot_meetups_pkey" PRIMARY KEY ("regionKey","meetupId")
);

-- CreateIndex
CREATE INDEX "region_hot_meetups_regionKey_startsAt_idx" ON "region_hot_meetups"("regionKey", "startsAt");

-- CreateIndex
CREATE INDEX "meetups_status_startTime_idx" ON "meetups"("status", "startTime");

-- CreateIndex
CREATE INDEX "meetups_latitude_longitude_idx" ON "meetups"("latitude", "longitude");

-- AddForeignKey
ALTER TABLE "region_hot_meetups" ADD CONSTRAINT "region_hot_meetups_meetupId_fkey" FOREIGN KEY ("meetupId") REFERENCES "meetups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
