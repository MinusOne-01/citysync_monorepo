export type NotificationData = {
  meetupId: string
  organizerId: string
  participantId: string
  participantName: string
}

export type NotificationRecord = {
  notiId: string
  type: string
  data: NotificationData
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
