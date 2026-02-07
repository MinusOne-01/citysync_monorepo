import "dotenv/config"
import { runFeedWorker } from "./feed.worker";

async function start() {
  console.log("[feed-worker] booting...");

  await runFeedWorker();             
  setInterval(runFeedWorker, 60_000); 
}

start().catch((err) => {
  console.error("[feed-worker] fatal error", err);
  process.exit(1);
});
