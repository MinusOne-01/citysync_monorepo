import { feedRepo } from "./feed.repo";
import { BuildMainFeedInput, BuildMainFeedResponse } from "./feed.type";
import { redis } from "../../shared/configs/redis";
import { regionKey } from "../../shared/utils/geobucket";
import { env } from "../../shared/configs/env";

const BUCKET = env.AWS_S3_BUCKET!;
const REGION = env.AWS_REGION!;



export interface FeedService {
    buildMainFeed(input: BuildMainFeedInput): Promise<BuildMainFeedResponse>
}


const toRad = (value: number) => (value * Math.PI) / 180;


class FeedServiceImpl implements FeedService {

    private getPublicURL(key: string): string {
        return `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`;
    }

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

    private async computeFeed(input: BuildMainFeedInput): Promise<BuildMainFeedResponse> {

        const radiusKm = input.radiusKm ?? 20;
        const limit = input.limit ?? 20;
        const region = regionKey(input.latitude, input.longitude);

        const hotRows = await feedRepo.fetchRegionHotMeetups({
            regionKey: region,
            cursor: input.cursor,
            limit: limit * 3
        });

        let candidates;

        if (hotRows.length > 0) {
            const meetupIds = hotRows.map(r => r.meetupId);
            candidates = await feedRepo.fetchMeetupsByIds({ids: meetupIds});
        }

        if (!candidates || candidates.length === 0) {
            const latDelta = radiusKm / 111;
            const lngDelta = radiusKm / (111 * Math.cos(toRad(input.latitude)));

            candidates = await feedRepo.fetchCandidateMeetups({
                minLat: input.latitude - latDelta,
                maxLat: input.latitude + latDelta,
                minLng: input.longitude - lngDelta,
                maxLng: input.longitude + lngDelta,
                limit
            });

        }

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
                imageUrl: this.getPublicURL(m.meetupImageKey),
                distance: dist,
                score
            };

        }).filter(m => m.distance <= radiusKm)
            .sort((a, b) => b.score - a.score)


        const page = scoredFeed.slice(0, limit);
        const last = page[page.length - 1]

        return {
            items: page,
            nextCursor: last
                ? { startTime: last.startTime, meetupId: last.id }
                : null
        };

    }


    async buildMainFeed(input: BuildMainFeedInput): Promise<BuildMainFeedResponse> {

        const radiusKm = input.radiusKm ?? 20;
        const limit = input.limit ?? 20;

        const isFirstPage = !input.cursor;

        const cacheKey = isFirstPage
            ? `feed:v1:${regionKey(input.latitude, input.longitude)}:r=${radiusKm}`
            : null;

        if (isFirstPage && cacheKey) {
            const cached = await redis.get(cacheKey);
            if (cached) {
                return JSON.parse(cached);
            }
        }

        const result = await this.computeFeed(input);

        if (isFirstPage && cacheKey) {
            await redis.setex(cacheKey, 45, JSON.stringify(result));
        }

        return result;

    }

}

export const feedService = new FeedServiceImpl()