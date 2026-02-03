import { meetupApi } from "./meetup.api"

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"] as const
type AllowedType = typeof ALLOWED_TYPES[number]

export async function uploadMeetupImage(file: File) {
  if (!ALLOWED_TYPES.includes(file.type as AllowedType)) {
    throw new Error("Invalid file type. Use jpeg, png, or webp.")
  }

  const { uploadData } = await meetupApi.getUploadUrl(file.type as AllowedType)

  const putRes = await fetch(uploadData.signedUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file
  })

  if (!putRes.ok) {
    throw new Error("Upload failed")
  }

  return uploadData
}
