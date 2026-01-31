import { z } from "zod"
import { ParticipationStatus } from "@prisma/client"

export const MeetupSchema = z.object({
  id: z.uuid()
})

export const ChangeStatusSchema = z.object({
  participantId: z.uuid(),
  newStatus: z.nativeEnum(ParticipationStatus)
})
