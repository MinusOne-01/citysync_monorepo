import { number, z } from "zod" 

export const getFeedSchema = z.object({
  longitude: z.number().min(-180).max(180),
  latitude: z.number().min(-90).max(90),
  radiusKm: z.number().optional(),
  limit: z.number().optional()
})