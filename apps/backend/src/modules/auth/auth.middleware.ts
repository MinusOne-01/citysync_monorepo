import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { JWT_ACCESS_SECRET } from "../../shared/configs/auth"

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string
  }
}

export function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  try {
    const payload = jwt.verify( token, JWT_ACCESS_SECRET ) as { sub: string }
    req.user = { userId: payload.sub }
    next()
  }
  catch {
    return res.status(401).json({ error: "Invalid or expired token" })
  }
}
