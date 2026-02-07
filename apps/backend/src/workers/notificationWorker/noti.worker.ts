import { redis } from "../../shared/configs/redis";
import { handleNotification } from "../../shared/utils/notifications/noti.handler";

const STREAM = "notifications:events";
const GROUP = "notification-workers";
const CONSUMER = `worker-${process.pid}`;


async function ensureGroup() {
    try {
        await redis.xgroup(
            "CREATE",
            STREAM,
            GROUP,
            "$",
            "MKSTREAM"
        );
        console.log("[notification-worker] consumer group created");
    } catch (err: any) {
        if (!err.message.includes("BUSYGROUP")) {
            throw err;
        }
    }
}


async function processPending() {
    const res = await redis.xreadgroup(
        "GROUP",
        GROUP,
        CONSUMER,
        "COUNT",
        10,
        "STREAMS",
        STREAM,
        "0" // 👈 read pending
    );

    if (!res) return;

    await processMessages(res);
}


async function processMessages(res: any) {
    for (const [, messages] of res) {
        for (const [id, fields] of messages) {
            try {
                const type = fields[fields.indexOf("type") + 1];
                const payload = JSON.parse(
                    fields[fields.indexOf("payload") + 1]
                );

                await handleNotification(type, payload);
                await redis.xack(STREAM, GROUP, id);
            } catch (err) {
                console.error("[notification-worker] failed", err);
            }
        }
    }
}


export async function runNotificationWorker() {

    console.error("notification-worker booting...")

    await ensureGroup();

    await processPending();

    while (true) {
        const res = await redis.xreadgroup(
            "GROUP",
            GROUP,
            CONSUMER,
            "COUNT",
            10,
            "BLOCK",
            5000,
            "STREAMS",
            STREAM,
            ">"
        );

        if (!res) continue;

        await processMessages(res);

    }

}

runNotificationWorker()
