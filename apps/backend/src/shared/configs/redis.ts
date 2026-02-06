import Redis from "ioredis";
import { env } from "./env";

const REDIS_URL = env.REDIS_URL

export const redis = new Redis(REDIS_URL!, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false
});