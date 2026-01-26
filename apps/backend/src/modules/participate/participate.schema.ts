import { z } from "zod"

export const MeetupSchema = z.object({
  meetupId: z.uuid()
})

