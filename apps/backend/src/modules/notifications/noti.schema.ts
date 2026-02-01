import { z } from "zod"

export const updateNotiSchema = z.object({
  id: z.uuid()
})
