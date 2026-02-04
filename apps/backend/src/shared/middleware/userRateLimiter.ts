import { createRateLimiter } from "./rate.limiter"

export const defaultRateLimiter = createRateLimiter({
  keyPrefix: "rl:default",
  limit: 100,
  windowSec: 10 * 60
})
