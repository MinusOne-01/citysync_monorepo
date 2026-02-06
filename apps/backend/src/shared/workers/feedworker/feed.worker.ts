import { FeedWorkerRepository } from "./feed.worker.repo";

const repo = new FeedWorkerRepository();

function popularityScore(
  participantCount: number,
  startsAt: Date
): number {
  const hoursUntilStart = Math.max(
    1,
    (startsAt.getTime() - Date.now()) / (1000 * 60 * 60)
  );

  return (
    Math.log(participantCount + 1) * 0.7 +
    (1 / hoursUntilStart) * 0.3
  );
}

export async function runFeedWorker() {

  const regions = await repo.findActiveRegions();

  for (const region of regions) {
    try {
      const meetups = await repo.findMeetupsInRegion(region);

      const ranked = meetups
        .map(m => ({
          meetupId: m.id,
          startsAt: m.startTime,
          popularityScore: popularityScore(
            m._count.participants,
            m.startTime
          )
        }))
        .sort((a, b) => b.popularityScore - a.popularityScore)
        .slice(0, 200); // candidate pool

      await repo.upsertRegionHotMeetups(region, ranked);

      console.log(
        `[feed-worker] region=${region} updated (${ranked.length})`
      );

    } catch (err) {
      console.error(
        `[feed-worker] region=${region} failed`,
        err
      );
    }
  }

}
