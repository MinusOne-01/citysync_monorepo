import Redis from "ioredis";
import { env } from "./env";

const REDIS_URL = env.REDIS_URL

export const redis = new Redis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false
});