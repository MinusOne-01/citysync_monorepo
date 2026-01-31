import "dotenv/config"
import express from "express"
import cors from "cors"
import { globalErrorHandler } from "./shared/middleware/error.middleware"
import { registerAuthRoutes } from "./modules/auth"
import { registeredUserRoutes } from "./modules/user"
import { registerMeetupRoutes } from "./modules/meetups"
import { registerParticipateRoutes } from "./modules/participate"

const app = express()
const router = express.Router()

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true
  })
)

app.use(express.json())



registerAuthRoutes(router)
registeredUserRoutes(router)
registerMeetupRoutes(router)
registerParticipateRoutes(router)

app.use("/api", router)

app.use(globalErrorHandler)






app.get("/health", (_req, res) => {
  res.json({ status: "ok" })
})

app.listen(3001, () => {
  console.log("Backend running on :3001")
})
