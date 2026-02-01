import { Prisma } from "@prisma/client";
import { JsonValue } from "@prisma/client/runtime/library";

////////////////////////
//Service types
////////////////////////

export type NotiRecord = {
    notiId: string
    type: string
    data: JsonValue
    isRead: boolean
    createdAt: Date
}

export type GetUserNotiInput = {
    userId: string
    limit?: number
}

export type GetUserNotiResponse = NotiRecord[]


export type MarkIsReadInput = {
    userId: string
    recordId: string
}

export type MarkIsReadResponse = {
    status: string
    message: string
}

export type MarkIsReadBulkInput = {
    userId: string
}

export type MarkIsReadBulkResponse = {
    status: string
    message: string
}







////////////////////////
//Repo types
////////////////////////

export type NotiDbShape = Prisma.NotificationGetPayload<{}>

export type FindNotiRecordsInput = {
    userId: string
    limit: number
}

export type FindNotiRecordsResponse = NotiDbShape[]

export type UpdateReadInput = {
    userId: string
    notiId: string
}

export type UpdateBulkReadInput = {
    userId: string
}
