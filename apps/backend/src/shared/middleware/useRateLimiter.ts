import { createRateLimiter } from "./rate.limiter"

export const defaultRateLimiter = createRateLimiter({
  keyPrefix: "rl:default",
  limit: 10000000,
  windowSec: 10 * 60
})
