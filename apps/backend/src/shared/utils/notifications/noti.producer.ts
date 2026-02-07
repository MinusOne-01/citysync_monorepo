import { redis } from "../../configs/redis";
import { NotificationEvent } from "./noti.events";

export async function publishNotificationEvent(
  event: NotificationEvent
) {
  await redis.xadd(
    "notifications:events",
    "*",
    "type",
    event.type,
    "payload",
    JSON.stringify(event.payload)
  );
}
