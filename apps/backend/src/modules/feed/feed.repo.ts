import { FetchCandidateMeetupsInput, FetchCandidateMeetupsResponse } from "./feed.type";
import { prisma } from "../../shared/db";


export interface FeedRepository {
   fetchCandidateMeetups(input: FetchCandidateMeetupsInput): Promise<FetchCandidateMeetupsResponse>
}


class FeedRepositoryImpl implements FeedRepository {

    fetchCandidateMeetups(input: FetchCandidateMeetupsInput): Promise<FetchCandidateMeetupsResponse> {

        return prisma.meetup.findMany({
            where: {
                status: "PUBLISHED",
                startTime: { gt: new Date() },
                latitude: { gte: input.minLat, lte: input.maxLat },
                longitude: { gte: input.minLng, lte: input.maxLng }
            },
            include: {
                _count: {
                    select: { participants: true }
                }
            },    
            take: 100
        });

    }
    
}

export const feedRepo = new FeedRepositoryImpl()