import { prisma } from "../../shared/db";
import { ParticipateRecord } from "./participate.service";

export interface ParticipateRepository {
    joinMeetup(userId: string, meetupId: string): Promise<ParticipateRecord |  null>;
    findParticipation(userId: string, meetupId: string): Promise<ParticipateRecord | null>;
    leaveMeetup(userId: string, meetupId: string): Promise<void>;
}

class ParticipateRepositoryImpl implements ParticipateRepository {

    async joinMeetup(userId: string, meetupId: string): Promise<ParticipateRecord |  null> {
        const record = await prisma.participation.create({
            data: {
                userId,
                meetupId,
                status: "CONFIRMED"
            },
        });

        if(!record) return null;

        return record
    }

    async findParticipation(userId: string, meetupId: string): Promise<ParticipateRecord | null> {
        const participation = await prisma.participation.findUnique({
            where: {
                meetupId_userId: {
                    meetupId,
                    userId
                }
            }
        });   

        if (!participation) return null; 

        return participation
    }

    async leaveMeetup(userId: string, meetupId: string): Promise<void> {
        await prisma.participation.update({
            where: {
                meetupId_userId: {
                    meetupId,
                    userId
                }
            },
            data: {
                status: "CANCELLED"
            }
        });
    }    

}

export const participateRepo = new ParticipateRepositoryImpl();