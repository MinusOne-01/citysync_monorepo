import Redis from "ioredis";
import { env } from "./env";

const REDIS_HOST = env.REDIS_HOST
const REDIS_PORT = env.REDIS_PORT

export const redis = new Redis({
  host: REDIS_HOST,
  port: REDIS_PORT,
  maxRetriesPerRequest: null
});
