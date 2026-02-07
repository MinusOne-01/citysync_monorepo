import "dotenv/config"
import express from "express"
import cors from "cors"
import { globalErrorHandler } from "./shared/middleware/error.middleware"
import cookieParser from "cookie-parser"
import { env } from "./shared/configs/env"

import { registerAuthRoutes } from "./modules/auth"
import { registeredUserRoutes } from "./modules/user"
import { registerMeetupRoutes } from "./modules/meetups"
import { registerParticipateRoutes } from "./modules/participate"
import { registerFeedRoutes } from "./modules/feed"
import { registerNotificationsRoutes } from "./modules/notifications"

const PORT = env.PORT
const ORIGIN_URL = env.ORIGIN_URL

const app = express()
const router = express.Router()

app.use(
  cors({
    origin: ORIGIN_URL,
    credentials: true
  })
)

app.use(express.json())
app.use(cookieParser());


registerAuthRoutes(router)
registeredUserRoutes(router)
registerMeetupRoutes(router)
registerParticipateRoutes(router)
registerFeedRoutes(router)
registerNotificationsRoutes(router)

app.use("/api", router)

app.use(globalErrorHandler)



app.get("/health", (_req, res) => {
  res.json({ status: "ok" })
})

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

