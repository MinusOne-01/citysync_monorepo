import { apiRequest } from "../../shared/utils/apiClient"
import type { NotificationsPage, StatusResponse } from "./noti.types"

export const notiApi = {
  list(params?: { limit?: number; cursor?: string }) {
    const query = new URLSearchParams()
    if (params?.limit) query.set("limit", String(params.limit))
    if (params?.cursor) query.set("cursor", params.cursor)

    const qs = query.toString()
    return apiRequest<NotificationsPage>(`/notifications${qs ? `?${qs}` : ""}`, {
      method: "GET"
    })
  },

  markRead(id: string) {
    return apiRequest<StatusResponse>(`/notifications/${encodeURIComponent(id)}/read`, {
      method: "PATCH"
    })
  },

  markAllRead() {
    return apiRequest<StatusResponse>("/notifications/read-all", {
      method: "PATCH"
    })
  }
}
