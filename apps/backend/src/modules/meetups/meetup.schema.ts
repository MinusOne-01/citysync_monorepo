import { z } from "zod"

export const CreateMeetupSchema = z.object({
  title: z.string().min(5),
  description: z.string().optional(),
  startTime: z.coerce.date(),
  capacity: z.number().int().positive().optional(),

  longitude: z.number().min(-180).max(180),
  latitude: z.number().min(-90).max(90),
  city: z.string().optional(),
  area: z.string().optional(),
  placeName: z.string().optional(),

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

export const ValidateMeetupIdSchema = z.object({
  meetupId: z.uuid()
})
