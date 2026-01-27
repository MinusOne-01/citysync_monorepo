import { z } from "zod"

export const createUserSchema = z.object({
  authAccountId: z.uuid(),
  username: z.string().min(5),
  email: z.email(),
})

export const updateUserSchema = z.object({
  displayName: z.string().min(5).optional(),
  email: z.email().optional(),

})

export const userParamsSchema = z.object({
  username: z.string().min(5),
})

export const userUploadUrlSchema = z.object({
  fileType: z.enum(["image/jpeg", "image/png", "image/webp"]),
})

export const userUploadCompleteSchema = z.object({
  profileImageKey: z.string()
})

