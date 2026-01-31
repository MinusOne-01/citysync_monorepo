import { Prisma, MeetupStatus } from "@prisma/client";

export type FeedRepoResponse = Prisma.MeetupGetPayload<{
  include: {
    _count: {
      select: {
        participants: true;
      };
    };
  };
}>;

export type HotRepoResponse = Prisma.RegionHotMeetupGetPayload<{}>;

export type MeetupDetails = Prisma.MeetupGetPayload<{
    include: {
    _count: {
      select: {
        participants: true;
      };
    };
  };
}>;

export type MeetupShape = {
    distance: number;
    score: number;
    _count: {
        participants: number;
    };
    id: string;
    organizerId: string;
    title: string;
    description: string | null;
    startTime: Date;
    capacity: number | null;
    status: MeetupStatus;
    latitude: number;
    longitude: number;
    city: string | null;
    area: string | null;
    placeName: string | null;
    meetupImageKey: string;
    createdAt: Date;
}

export type FeedCursor = {
  startTime: Date;
  meetupId: string;
};



/////////////////////
/// service types
/////////////////////

export type BuildMainFeedInput = {
   longitude: number
   latitude: number
   radiusKm?: number        // default: 20
   limit?: number           // default: 20
   cursor?: FeedCursor;
}

export type BuildMainFeedResponse = {
    items: MeetupShape[]
    nextCursor: FeedCursor | null
}


/////////////////////
/// repo types
/////////////////////

export type FetchCandidateMeetupsInput = {
    minLat: number
    maxLat: number
    minLng: number
    maxLng: number
    cursor?: FeedCursor;
    limit: number
}

export type FetchCandidateMeetupsResponse = FeedRepoResponse[]

export type FetchRegionHotMeetupInput = {
    regionKey: string;
    cursor?: FeedCursor;
    limit: number;
}

export type FetchRegionHotMeetupResponse = HotRepoResponse[]

export type FetchMeetupbyIdInput = {
    ids: string[]
}

export type FetchMeetupbyIdResponse = MeetupDetails[]



}