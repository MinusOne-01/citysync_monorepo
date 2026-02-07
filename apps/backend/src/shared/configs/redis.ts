import Redis from "ioredis";
import { env } from "./env";

const REDIS_URL = env.REDIS_URL

export const redis = new Redis(REDIS_URL!, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false
});

redis?.on("connect", () => {
  console.log("Redis connected");
  console.log("URL-> ", REDIS_URL)
});

redis.on("error", (err) => {
  console.error("Redis error:", err.message);
  console.log("URL-> ", REDIS_URL)
});

