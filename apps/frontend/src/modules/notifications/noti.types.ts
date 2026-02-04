export type NotificationRecord = {
  notiId: string
  type: string
  data: unknown
  isRead: boolean
  createdAt: string
}

export type NotificationsPage = {
  items: NotificationRecord[]
  nextCursor: string | null
}

export type StatusResponse = {
  status: "success"
  message: string
}
