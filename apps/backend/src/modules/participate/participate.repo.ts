import { ParticipationStatus } from "@prisma/client";
import { prisma } from "../../shared/db";
import { CreateParticipationInput, CreateParticipationResponse, DeleteParticipationInput, DeleteParticipationResponse, FetchMeetupParticipantsInput, FetchMeetupParticipantsResponse, ParticipationRole, ApproveParticipantStatusInput, ApproveParticipantStatusResponse, CancelParticipantStatusInput, CancelParticipantStatusResponse, FetchParticipantStatusResponse, FetchParticipantStatusInput } from "./participate.type";


export interface ParticipateRepository {
    createParticipation(input: CreateParticipationInput): Promise<CreateParticipationResponse>;
    deleteParticipation(input: DeleteParticipationInput): Promise<DeleteParticipationResponse>;
    fetchMeetupParticipants(input: FetchMeetupParticipantsInput): Promise<FetchMeetupParticipantsResponse | null>;
    approveParticipantStatus(input: ApproveParticipantStatusInput): Promise<ApproveParticipantStatusResponse>;
    cancelParticipantStatus(input: CancelParticipantStatusInput): Promise<CancelParticipantStatusResponse>;
    fetchParticipantStatus(input: FetchParticipantStatusInput): Promise<FetchParticipantStatusResponse>;

}

class ParticipateRepositoryImpl implements ParticipateRepository {

    async createParticipation(input: CreateParticipationInput): Promise<CreateParticipationResponse> {

        await prisma.participation.upsert({
            where: {
                userId_meetupId: {
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

            await tx.participation.delete({
                where: {
                    userId_meetupId: {
                        userId: input.userId,
                        meetupId: input.meetupId,
                    }
                }
            })

            await tx.userMeetupHistory.delete({
                where: {
                    userId_meetupId: {
                        userId: input.userId,
                        meetupId: input.meetupId,
                    }
                }
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

            const participate = await tx.participation.updateMany({
                where: {
                    userId: input.userId,
                    meetupId: input.meetupId,
                    status: "REQUESTED"
                },
                data: { status: "CONFIRMED" }
            });

            if (participate.count !== 1) {
                throw new Error("Invalid participation state transition");
            }

            await tx.userMeetupHistory.create({
                data: {
                    userId: input.userId,
                    meetupId: input.meetupId,
                    role: input.role as ParticipationRole,
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

    async fetchParticipantStatus(input: FetchParticipantStatusInput): Promise<FetchParticipantStatusResponse> {

        const record = await prisma.participation.findMany({
            where: {
                userId_meetupId: {
                    userId: input.userId,
                    meetupId: input.meetupId,
                }
            }
        })

        return { status: record.status, createdAt: record.createdAt };

    }
    
}    

export const participateRepo = new ParticipateRepositoryImpl();