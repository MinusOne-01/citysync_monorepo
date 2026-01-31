import { FetchCandidateMeetupsInput, FetchCandidateMeetupsResponse, FetchMeetupbyIdInput, FetchMeetupbyIdResponse, FetchRegionHotMeetupInput, FetchRegionHotMeetupResponse } from "./feed.type";
import { prisma } from "../../shared/configs/db";


export interface FeedRepository {
   fetchCandidateMeetups(input: FetchCandidateMeetupsInput): Promise<FetchCandidateMeetupsResponse>
   fetchRegionHotMeetups(input: FetchRegionHotMeetupInput): Promise<FetchRegionHotMeetupResponse>
   fetchMeetupsByIds(input: FetchMeetupbyIdInput): Promise<FetchMeetupbyIdResponse>
}


class FeedRepositoryImpl implements FeedRepository {

    async fetchCandidateMeetups(input: FetchCandidateMeetupsInput): Promise<FetchCandidateMeetupsResponse> {

        return prisma.meetup.findMany({
            where: {
                status: "PUBLISHED",
                startTime: { gt: new Date() },
                ...(input.cursor && {
                    OR: [
                        {
                            startTime: { gt: input.cursor.startTime }
                        },
                        {
                            startTime: input.cursor.startTime,
                            id: { gt: input.cursor.meetupId }
                        }
                    ]
                }),
                latitude: { gte: input.minLat, lte: input.maxLat },
                longitude: { gte: input.minLng, lte: input.maxLng }
            },
            orderBy: [
                { startTime: "asc" },
                { id: "asc" }
            ],

            take: input.limit ? input.limit * 3 : 60,

            include: {
                _count: {
                    select: { participants: true }
                }
            }
        });

    }

    async fetchRegionHotMeetups(input: FetchRegionHotMeetupInput): Promise<FetchRegionHotMeetupResponse> {

        return prisma.regionHotMeetup.findMany({
            where: {
                regionKey: input.regionKey,

                ...(input.cursor && {
                    OR: [
                        {
                            startsAt: { gt: input.cursor.startTime }
                        },
                        {
                            startsAt: input.cursor.startTime,
                            meetupId: { gt: input.cursor.meetupId }
                        }
                    ]
                })
            },

            orderBy: [
                { startsAt: "asc" },
                { meetupId: "asc" }
            ],

            take: input.limit
        });

    }

    async fetchMeetupsByIds(input: FetchMeetupbyIdInput): Promise<FetchMeetupbyIdResponse> {

        if (input.ids.length === 0) return [];

        return prisma.meetup.findMany({
            where: {
                id: { in: input.ids },
                status: "PUBLISHED",
                startTime: { gt: new Date() }
            },
            include: {
                _count: {
                    select: { participants: true }
                }
            }
        });

    }

    


    
}

export const feedRepo = new FeedRepositoryImpl()