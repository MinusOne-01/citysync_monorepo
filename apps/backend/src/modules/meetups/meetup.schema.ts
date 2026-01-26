import { z } from "zod"

export const CreateMeetupSchema = z.object({
  title: z.string().min(5),
  description: z.string().optional(),
  startTime: z.coerce.date(),
  capacity: z.number().int().positive().optional()
})

export const PublishMeetupSchema = z.object({
  meetupId: z.uuid()
})