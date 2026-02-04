import { Request, Response, NextFunction } from "express"
import { redis } from "../configs/redis"

type RateLimitOptions = {
  keyPrefix?: string
  limit?: number
  windowSec?: number
}

function getClientIp(req: Request): string {
  const xf = req.headers["x-forwarded-for"]
  if (typeof xf === "string" && xf.length > 0) {
    return xf.split(",")[0].trim()
  }
  return req.ip || req.socket.remoteAddress || "unknown"
}

export function createRateLimiter(opts: RateLimitOptions = {}) {
  const {
    keyPrefix = "rl",
    limit = 100,
    windowSec = 10 * 60, // 10 minutes
  } = opts

  return async function rateLimiter(req: Request, res: Response, next: NextFunction) {
    try {
      const ip = getClientIp(req)
      const key = `${keyPrefix}:${ip}`

      const count = await redis.incr(key)
      console.log("Count-> ", count)
      if (count === 1) {
        await redis.expire(key, windowSec)
      }

      if (count > limit) {
        return res
          .status(429)
          .json({ error: "Retry after a few minutes, too many requests." })
      }

      return next()
    } catch (err) {
      // If Redis is down, fail open (do not block requests)
      return next()
    }
  }
}
