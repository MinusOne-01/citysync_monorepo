import { notiRepo } from "./noti.repo";
import { GetUserNotiInput, GetUserNotiResponse, MarkIsReadBulkInput, MarkIsReadBulkResponse, MarkIsReadInput, MarkIsReadResponse } from "./noti.type";


export interface NotificationService {
    getUserNoti(input: GetUserNotiInput): Promise<GetUserNotiResponse>
    markIsRead(input: MarkIsReadInput): Promise<MarkIsReadResponse>
    markIsReadBulk(input: MarkIsReadBulkInput): Promise<MarkIsReadBulkResponse>
}

class NotificationServiceImpl implements NotificationService {

    async getUserNoti(input: GetUserNotiInput): Promise<GetUserNotiResponse> {
        
        const { items, nextCursor } = await notiRepo.findNotiRecords({
          userId: input.userId,
          limit: input.limit ?? 20,
          cursor: input.cursor
        });

        const data = items.map((r) => ({
            notiId: r.id,
            type: r.type,
            data: r.data,
            isRead: r.isRead,
            createdAt: r.createdAt
        }));

        return { items: data, nextCursor };

    }

    async markIsRead(input: MarkIsReadInput): Promise<MarkIsReadResponse> {
        
        const count = await notiRepo.updateRead({ userId: input.userId, notiId: input.recordId })

        if (count === 0) {
          return { status: "success", message: "Notification already read or not found" }
        }

        return { status: "success", message: "Notification marked as read" }
    }

    async markIsReadBulk(input: MarkIsReadBulkInput): Promise<MarkIsReadBulkResponse> {

        await notiRepo.updateBulkRead({userId: input.userId})

        return({
            status: "Success",
            message: "Notification bulk update complete"
        })
    }

}

export const notiService = new NotificationServiceImpl()