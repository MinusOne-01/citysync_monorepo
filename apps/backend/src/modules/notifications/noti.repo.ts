import { FindNotiRecordsInput, FindNotiRecordsResponse, UpdateBulkReadInput, UpdateReadInput } from "./noti.type";
import { prisma } from "../../shared/configs/db";



export interface NotificationRepository {
   findNotiRecords(input: FindNotiRecordsInput): Promise<FindNotiRecordsResponse>
   updateRead(input: UpdateReadInput): Promise<number>
   updateBulkRead(input: UpdateBulkReadInput): Promise<number>
}

class NotificationRepositoryImpl implements NotificationRepository {

    async findNotiRecords(input: FindNotiRecordsInput): Promise<FindNotiRecordsResponse> {

        const items = await prisma.notification.findMany({
            where: {
                userId: input.userId
            },
            orderBy: { createdAt: "desc" },
            take: input.limit,
            ...(input.cursor
              ? { skip: 1, cursor: { id: input.cursor } }
              : {})
        });

        const nextCursor = items.length === input.limit ? items[items.length - 1]?.id ?? null : null;

        return { items, nextCursor };

    }

    async updateRead(input: UpdateReadInput): Promise<number> {

        const result = await prisma.notification.updateMany({
            where: {
                userId: input.userId,
                id: input.notiId,
                isRead: false
            },
            data: { isRead: true }
        });

        return result.count;

    }

    async updateBulkRead(input: UpdateBulkReadInput): Promise<number> {

        const result = await prisma.notification.updateMany({
            where: {
                userId: input.userId,
                isRead: false
            },
            data: { isRead: true }
        });

        return result.count;

    }

}

export const notiRepo = new NotificationRepositoryImpl()