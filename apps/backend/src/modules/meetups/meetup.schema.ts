import { z } from "zod"

export const CreateMeetupSchema = z.object({
  title: z.string().min(5),
  description: z.string().optional(),
  startTime: z.coerce.date(),
  capacity: z.number().int().positive().optional(),
  meetupImageKey: z.string(),
})

export const EditMeetupSchema = z.object({
  title: z.string().min(5).optional(),
  description: z.string().optional(),
  startTime: z.coerce.date().optional(),
  capacity: z.number().int().positive().optional(),
})

export const MeetupUploadUrlSchema = z.object({
  fileType: z.enum(["image/jpeg", "image/png", "image/webp"]),
})

export const FindMeetupSchema = z.object({
  meetupId: z.uuid()
})

export const PublishMeetupSchema = z.object({
  meetupId: z.uuid()
})
