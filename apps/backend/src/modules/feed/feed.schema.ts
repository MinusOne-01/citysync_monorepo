import { z } from "zod";

export const getFeedSchema = z.object({
  longitude: z.coerce.number().min(-180).max(180),
  latitude: z.coerce.number().min(-90).max(90),
  radiusKm: z.coerce.number().min(1).max(200).optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
  cursor: z
    .object({
      startTime: z.coerce.date(),
      meetupId: z.string(),
    })
    .optional(),
});
