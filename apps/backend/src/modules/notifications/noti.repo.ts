import { FindNotiRecordsInput, FindNotiRecordsResponse, UpdateBulkReadInput, UpdateReadInput } from "./noti.type";
import { prisma } from "../../shared/configs/db";



export interface NotificationRepository {
   findNotiRecords(input: FindNotiRecordsInput): Promise<FindNotiRecordsResponse>
   updateRead(input: UpdateReadInput): Promise<void>
   updateBulkRead(input: UpdateBulkReadInput): Promise<void>
}

class NotificationRepositoryImpl implements NotificationRepository {

    async findNotiRecords(input: FindNotiRecordsInput): Promise<FindNotiRecordsResponse> {

        return await prisma.notification.findMany({
            where: {
                userId: input.userId
            },
            orderBy: { createdAt: "desc" },
            take: input.limit
        });

    }

    async updateRead(input: UpdateReadInput): Promise<void> {

        await prisma.notification.updateMany({
            where: {
                userId: input.userId,
                id: input.notiId,
                isRead: false 
            },
            data: {
                isRead: true
            }
        });

    }

    async updateBulkRead(input: UpdateBulkReadInput): Promise<void> {

        await prisma.notification.updateMany({
            where: {
                userId: input.userId,
                isRead: false
            },
            data: {
                isRead: true
            }
        });

    }

}

export const notiRepo = new NotificationRepositoryImpl()