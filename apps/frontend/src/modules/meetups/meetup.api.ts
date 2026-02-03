import { apiRequest } from "../../shared/utils/apiClient"
import type {
  CreateMeetupInput,
  EditMeetupInput,
  UploadUrlResult,
  CreateMeetupResult,
  MeetupResult
} from "./meetup.types"

export const meetupApi = {
  create(input: CreateMeetupInput) {
    return apiRequest<CreateMeetupResult>("/meetups/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input)
    })
  },

  get(meetupId: string) {
    return apiRequest<MeetupResult>(`/meetups/${encodeURIComponent(meetupId)}`, {
      method: "GET"
    })
  },

  getCreatorView(meetupId: string) {
    return apiRequest<MeetupResult>(`/meetups/${encodeURIComponent(meetupId)}/creator-view`, {
      method: "GET"
    })
  },

  publish(meetupId: string) {
    return apiRequest<{ message: string }>(`/meetups/${encodeURIComponent(meetupId)}/publish`, {
      method: "PUT"
    })
  },

  edit(meetupId: string, input: EditMeetupInput) {
    return apiRequest<{ message: string }>(`/meetups/${encodeURIComponent(meetupId)}/edit`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input)
    })
  },

  cancel(meetupId: string) {
    return apiRequest<{ message: string }>(`/meetups/${encodeURIComponent(meetupId)}/cancel`, {
      method: "PUT"
    })
  },

  getUploadUrl(fileType: "image/jpeg" | "image/png" | "image/webp") {
    return apiRequest<UploadUrlResult>("/meetups/upload-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileType })
    })
  }
}

