import { prisma } from "../../configs/db";

export class FeedWorkerRepository {

  async findActiveRegions(): Promise<string[]> {
    const rows = await prisma.$queryRaw<
      { region_key: string }[]
    >`
      SELECT DISTINCT
        ROUND(latitude::numeric, 2)::text || ':' ||
        ROUND(longitude::numeric, 2)::text AS region_key
      FROM meetups
      WHERE status = 'PUBLISHED'
        AND "startTime" > now()
        AND "startTime" < now() + interval '7 days'
    `;

    return rows.map(r => r.region_key);
  }

  async findMeetupsInRegion(region: string) {
    const [latStr, lngStr] = region.split(":");
    const lat = Number(latStr);
    const lng = Number(lngStr);

    const offset = 0.5; // ~55km box for candidate pool

    return prisma.meetup.findMany({
      where: {
        status: "PUBLISHED",
        startTime: { gt: new Date() },
        latitude: { gte: lat - offset, lte: lat + offset },
        longitude: { gte: lng - offset, lte: lng + offset }
      },
      select: {
        id: true,
        startTime: true,
        _count: {
          select: { participants: true }
        }
      }
    });
  }

  async upsertRegionHotMeetups(
    region: string,
    rows: {
      meetupId: string;
      popularityScore: number;
      startsAt: Date;
    }[]
  ) {
    await prisma.$transaction(async (tx) => {
      // Clear old entries for region
      await tx.regionHotMeetup.deleteMany({
        where: { regionKey: region }
      });

      // Insert fresh ones
      await tx.regionHotMeetup.createMany({
        data: rows.map(r => ({
          regionKey: region,
          meetupId: r.meetupId,
          popularityScore: r.popularityScore,
          startsAt: r.startsAt
        }))
      });
    });
  }
}
