import { userApi } from "./user.api"

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"] as const
type AllowedType = typeof ALLOWED_TYPES[number]

export async function uploadUserProfileImage(file: File) {
  if (!ALLOWED_TYPES.includes(file.type as AllowedType)) {
    throw new Error("Invalid file type. Use jpeg, png, or webp.")
  }

  // 1) ask backend for presigned URL
  const { uploadData } = await userApi.getProfileUploadUrl(file.type as AllowedType)

  // 2) upload file directly to S3
  const putRes = await fetch(uploadData.signedUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file
  })

  if (!putRes.ok) {
    throw new Error("Upload failed")
  }

  // 3) notify backend
  const result = await userApi.completeProfileUpload({ profileImageKey: uploadData.key })
  return result.user
}
