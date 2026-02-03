import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, ACCESS_TOKEN_TTL } from "../../shared/configs/auth"
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

  const accessToken = req.cookies.access_token;
  if(!accessToken) return res.status(401).json({ error: "Unauthorized" });

  try{

    const payload = jwt.verify( accessToken, JWT_ACCESS_SECRET ) as { sub: string };
    req.user = { userId: payload.sub };
    return next();

  } 
  catch (err) {

    // access token expired → try refresh
    const refreshToken = req.cookies.refresh_token;
    if(!refreshToken) return res.status(401).json({ error: "Session expired" });

    try{

      const tokens = await authService.refresh(refreshToken)
      setAuthCookies(res, tokens)

      const refreshPayload = jwt.verify( refreshToken, JWT_REFRESH_SECRET ) as { sub: string };
      req.user = { userId: refreshPayload.sub };

      return next();
    } 
    catch {
      return res.status(401).json({ error: "Session expired" });
    }

  }

}

