import { Router } from "express"
import { RegisterSchema, LoginSchema, RefreshSchema } from "./auth.schema"
import { authService } from "./auth.service"
import { setAuthCookies, clearAuthCookies, REFRESH_COOKIE } from "./auth.utils"

export function registerAuthRoutes(router: Router) {

  router.post("/auth/register", async (req, res, next) => {

    try {

      const parsed = RegisterSchema.safeParse(req.body)
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten() })
      }

      const tokens = await authService.register(parsed.data)
      setAuthCookies(res, tokens)
      return res.status(201).json({ ok: true })
    }
    catch (err) {
      return next(err)
    }

  })
  
  router.post("/auth/login", async (req, res, next) => {

    try {

      const parsed = LoginSchema.safeParse(req.body)
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten() })
      }

      const tokens = await authService.login(parsed.data)
      setAuthCookies(res, tokens)
      return res.json({ ok: true })
    } 
    catch (err) {
      return next(err)
    }

  })
  
  router.post("/auth/refresh", async (req, res, next) => {

  try {

      const refreshToken = req.cookies[REFRESH_COOKIE]
      if (!refreshToken) {
        clearAuthCookies(res)
        return res.status(401).json({ error: "Session expired" })
      }

      const tokens = await authService.refresh(refreshToken)
      setAuthCookies(res, tokens)
      return res.json({ ok: true })
    } 
    catch (err) {
      clearAuthCookies(res)
      return next(err)
    }

})

router.post("/auth/logout", async (req, res, next) => {

  try {

      const refreshToken = req.cookies[REFRESH_COOKIE]
      if (refreshToken) {
        await authService.logout(refreshToken)
      }
      clearAuthCookies(res)
      return res.status(204).send()
    } 
    catch (err) {
      return next(err)
    }

})

}


