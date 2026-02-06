import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { env } from "../../shared/configs/env"
import { authService } from "./auth.service"
import { setAuthCookies } from "./auth.utils"

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string
  }
}

export async function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {

  const accessToken = req.cookies.access_token

  // If no access token, try refresh
  if (!accessToken) {
    const refreshToken = req.cookies.refresh_token
    if (!refreshToken) return res.status(401).json({ error: "Session expired" })

    try {
      const tokens = await authService.refresh(refreshToken)
      setAuthCookies(res, tokens)

      const payload = jwt.verify(tokens.accessToken, env.JWT_ACCESS_SECRET) as { sub: string }
      req.user = { userId: payload.sub }
      return next()
    } catch {
      return res.status(401).json({ error: "Session expired" })
    }
  }

  try {
    const payload = jwt.verify(accessToken, env.JWT_ACCESS_SECRET) as { sub: string }
    req.user = { userId: payload.sub }
    return next()
  } catch {
    // access token expired -> try refresh
    const refreshToken = req.cookies.refresh_token
    if (!refreshToken) return res.status(401).json({ error: "Session expired" })

    try {
      const tokens = await authService.refresh(refreshToken)
      setAuthCookies(res, tokens)

      const payload = jwt.verify(tokens.accessToken, env.JWT_ACCESS_SECRET) as { sub: string }
      req.user = { userId: payload.sub }
      return next()
    } catch {
      return res.status(401).json({ error: "Session expired" })
    }
  }
}

