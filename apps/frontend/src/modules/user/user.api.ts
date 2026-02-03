import { apiRequest } from "../../shared/utils/apiClient"
import type { UserProfile, UserMeResult, UserUpdateInput, UserUpdateResult, UserUploadUrlResult, UserProfileUploadCompleteInput } from "./user.types"

export const userApi = {
  me() {
    return apiRequest<UserMeResult>("/user/me", { method: "GET" })
  },

  update(input: UserUpdateInput) {
    return apiRequest<UserUpdateResult>("/user/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input)
    })
  },

  getProfileUploadUrl(fileType: "image/jpeg" | "image/png" | "image/webp") {
    return apiRequest<UserUploadUrlResult>("/user/profile-upload-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileType })
    })
  },

  completeProfileUpload(input: UserProfileUploadCompleteInput) {
    return apiRequest<UserUpdateResult>("/user/profile-upload-complete", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input)
    })
  },

  getByUsername(username: string) {
    return apiRequest<{ user: UserProfile }>(`/user/${encodeURIComponent(username)}`, {
      method: "GET"
    })
  }
}
