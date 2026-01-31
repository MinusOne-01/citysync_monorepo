import { prisma } from "../../shared/configs/db";
import { CreateParticipationInput, CreateParticipationResponse, DeleteParticipationInput, DeleteParticipationResponse, FetchMeetupParticipantsInput, FetchMeetupParticipantsResponse, ParticipationRole, ApproveParticipantStatusInput, ApproveParticipantStatusResponse, CancelParticipantStatusInput, CancelParticipantStatusResponse, FetchParticipantStatusResponse, FetchParticipantStatusInput, FetchParticipantHistoryInput, FetchParticipantHistoryResponse } from "./participate.type";
import { AppError } from "../../shared/configs/errors";


export interface ParticipateRepository {
    createParticipation(input: CreateParticipationInput): Promise<CreateParticipationResponse>;
    deleteParticipation(input: DeleteParticipationInput): Promise<DeleteParticipationResponse>;
    fetchMeetupParticipants(input: FetchMeetupParticipantsInput): Promise<FetchMeetupParticipantsResponse | null>;
    approveParticipantStatus(input: ApproveParticipantStatusInput): Promise<ApproveParticipantStatusResponse>;
    cancelParticipantStatus(input: CancelParticipantStatusInput): Promise<CancelParticipantStatusResponse>;
    fetchParticipantStatus(input: FetchParticipantStatusInput): Promise<FetchParticipantStatusResponse | null>;
    fetchParticipantHistory(input: FetchParticipantHistoryInput): Promise<FetchParticipantHistoryResponse | null>;

}

class ParticipateRepositoryImpl implements ParticipateRepository {

    async createParticipation(input: CreateParticipationInput): Promise<CreateParticipationResponse> {

        await prisma.participation.upsert({
            where: {
                meetupId_userId: {
                    userId: input.userId,
                    meetupId: input.meetupId
                }
            },
            update: {},
            create: {
                userId: input.userId,
                meetupId: input.meetupId,
                usernameSnapshot: input.username,
                status: "REQUESTED"
            }
        });

    }

    async deleteParticipation(input: DeleteParticipationInput): Promise<DeleteParticipationResponse> {

        await prisma.$transaction(async (tx) => {

            await tx.participation.deleteMany({
                where: {
                    userId: input.userId,
                    meetupId: input.meetupId,
                },
            });

            await tx.userMeetupHistory.deleteMany({
                where: {
                    userId: input.userId,
                    meetupId: input.meetupId,
                },
            });
        });

    }

    async fetchMeetupParticipants(input: FetchMeetupParticipantsInput): Promise<FetchMeetupParticipantsResponse | null> {
        
        const records = await prisma.participation.findMany({
            where: {
                meetupId: input.meetupId,
            },
            select: {
                userId: true,
                usernameSnapshot: true,
                status: true
            },
        });

        if(!records) return null;

        return records;
    }

    async approveParticipantStatus(input: ApproveParticipantStatusInput): Promise<ApproveParticipantStatusResponse> {
        
        await prisma.$transaction(async (tx) => {

            const record = await tx.participation.findUnique({
                where: {
                    meetupId_userId: {
                        userId: input.userId,
                        meetupId: input.meetupId,
                    }
                }
            });

            if (!record || record.status !== "REQUESTED") {
                throw new AppError("Invalid participation state transition");
            }

            await tx.participation.update({
                where: {
                    meetupId_userId: {
                        userId: input.userId,
                        meetupId: input.meetupId,
                    }
                },
                data: { status: "CONFIRMED" }
            });

            await tx.userMeetupHistory.create({
                data: {
                    userId: input.userId,
                    meetupId: input.meetupId,
                    role: input.role as ParticipationRole,
                    joinedAt: record.createdAt,
                    meetupDate: input.meetupDate,
                    longitude: input.longitude,
                    latitude: input.latitude,
                    meetupImageUrl: input.meetupImageUrl,
                },
            });
        });

    }

    async cancelParticipantStatus(input: CancelParticipantStatusInput): Promise<CancelParticipantStatusResponse> {
        
        await prisma.$transaction(async (tx) => {

            await tx.participation.updateMany({
                where: {
                    userId: input.userId,
                    meetupId: input.meetupId,
                    status: {
                        in: ["REQUESTED", "CONFIRMED"]
                    }
                },
                data: {
                    status: "CANCELLED",
                },
            });

            await tx.userMeetupHistory.deleteMany({
                where: {
                    userId: input.userId,
                    meetupId: input.meetupId,
                }
            });
        });

    }

    async fetchParticipantStatus(input: FetchParticipantStatusInput): Promise<FetchParticipantStatusResponse | null> {

        const records = await prisma.participation.findMany({
            where: {
 
                    userId: input.userId,
                    meetupId: input.meetupId,
 
            },
        });

        if(records.length === 0) return null;
        const record = records[0];

        return { status: record.status, createdAt: record.createdAt };

    }

    async fetchParticipantHistory(input: FetchParticipantHistoryInput): Promise<FetchParticipantHistoryResponse> {

        const records = await prisma.userMeetupHistory.findMany({
            where: {
                userId: input.userId,
            },
            orderBy: {
                meetupDate: 'desc', 
            },
        });

        return records;
        
    }
    
}    

export const participateRepo = new ParticipateRepositoryImpl();