import "dotenv/config"
import express from "express"
import cors from "cors"
import { globalErrorHandler } from "./shared/middleware/error.middleware"
import cookieParser from "cookie-parser"

import { registerAuthRoutes } from "./modules/auth"
import { registeredUserRoutes } from "./modules/user"
import { registerMeetupRoutes } from "./modules/meetups"
import { registerParticipateRoutes } from "./modules/participate"
import { registerFeedRoutes } from "./modules/feed"
import { registerNotificationsRoutes } from "./modules/notifications"

const PORT = process.env.PORT || 3000;

const app = express()
const router = express.Router()

app.use(
  cors({
    origin: "http://localhost:3000",
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

