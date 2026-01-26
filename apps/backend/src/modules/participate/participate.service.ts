import { participateRepo } from "./participate.repo";

export type ParticipationStatus = | "REQUESTED" | "CONFIRMED" | "WAITLISTED" | "CANCELLED";

export interface ParticipateRecord {
    id: string;
    userId: string;
    meetupId: string;
    status: ParticipationStatus;
    createdAt: Date;
}

export interface ParticipateService {
    joinMeetup(userId: string, meetupId: string): Promise<ParticipateRecord | null>;
    findParticipation(userId: string, meetupId: string): Promise<ParticipateRecord | null>;
    leaveMeetup(userId: string, meetupId: string): Promise<void>;
}

class ParticipateServiceImpl implements ParticipateService {

    async joinMeetup(userId: string, meetupId: string): Promise<ParticipateRecord | null> {
        return await participateRepo.joinMeetup(userId, meetupId);
    }

    async findParticipation(userId: string, meetupId: string): Promise<ParticipateRecord | null> {
        const participation = await participateRepo.findParticipation(userId, meetupId);
        if (participation) {
            return participation;
        }
        return null;
    }

    async leaveMeetup(userId: string, meetupId: string): Promise<void> {
        return await participateRepo.leaveMeetup(userId, meetupId);
    }

}

export const participateService = new ParticipateServiceImpl();