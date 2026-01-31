import { feedRepo } from "./feed.repo";
import { BuildMainFeedInput, BuildMainFeedResponse } from "./feed.type";


export interface FeedService {
    buildMainFeed(input: BuildMainFeedInput): Promise<BuildMainFeedResponse>
}


const toRad = (value: number) => (value * Math.PI) / 180;


class FeedServiceImpl implements FeedService {

    private distanceKm(lat1: number, lng1: number, lat2: number, lng2: number){

        const R = 6371;
        const dLat = toRad(lat2 - lat1);
        const dLng = toRad(lng2 - lng1);

        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) *
            Math.cos(toRad(lat2)) *
            Math.sin(dLng / 2) ** 2;

        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    }

    async buildMainFeed(input: BuildMainFeedInput): Promise<BuildMainFeedResponse> {

        const radiusKm = input.radiusKm ?? 20;
        const limit = input.limit ?? 20;

        const latDelta = radiusKm / 111;
        const lngDelta = radiusKm / (111 * Math.cos(toRad(input.latitude)));

        const candidates = await feedRepo.fetchCandidateMeetups({
            minLat: input.latitude - latDelta,
            maxLat: input.latitude + latDelta,
            minLng: input.longitude - lngDelta,
            maxLng: input.longitude + lngDelta
        });

        const now = new Date().getTime();

        const scoredFeed = candidates.map(m => {
            const dist = this.distanceKm(input.latitude, input.longitude, m.latitude, m.longitude);
            const hoursUntilStart = Math.max(1, (m.startTime.getTime() - now) / (1000 * 60 * 60));
            const participantCount = m._count.participants;

            // Feed rank Scoring Formula
            const score =
                (1 / (dist + 1)) * 0.6 +
                (1 / hoursUntilStart) * 0.3 +
                Math.log(participantCount + 1) * 0.1;

            return {
                ...m,
                distance: dist,
                score
            };

        }).filter(m => m.distance <= radiusKm)
            .sort((a, b) => b.score - a.score)
            .slice(0, limit)

        // Sort by score descending
        return scoredFeed.sort((a, b) => b.score - a.score);

    }

}

export const feedService = new FeedServiceImpl()