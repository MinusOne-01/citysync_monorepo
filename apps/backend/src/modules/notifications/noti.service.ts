import { notiRepo } from "./noti.repo";
import { GetUserNotiInput, GetUserNotiResponse, MarkIsReadBulkInput, MarkIsReadBulkResponse, MarkIsReadInput, MarkIsReadResponse } from "./noti.type";


export interface NotificationService {
    getUserNoti(input: GetUserNotiInput): Promise<GetUserNotiResponse>
    markIsRead(input: MarkIsReadInput): Promise<MarkIsReadResponse>
    markIsReadBulk(input: MarkIsReadBulkInput): Promise<MarkIsReadBulkResponse>
}

class NotificationServiceImpl implements NotificationService {

    async getUserNoti(input: GetUserNotiInput): Promise<GetUserNotiResponse> {
        
        const records = await notiRepo.findNotiRecords({userId: input.userId, limit: input.limit ?? 20})
        
        const data = records.map((r) => ({
            notiId: r.id,
            type: r.type,
            data: r.data,
            isRead: r.isRead,
            createdAt: r.createdAt
        }));

        return data;
    }

    async markIsRead(input: MarkIsReadInput): Promise<MarkIsReadResponse> {
        
        await notiRepo.updateRead({userId: input.userId, notiId: input.recordId})

        return({
            status: "Success",
            message: "Notification marked as Read"
        })
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