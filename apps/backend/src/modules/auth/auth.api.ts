import { Router } from "express"
import { RegisterSchema, LoginSchema, RefreshSchema } from "./auth.schema"
import { authService } from "./auth.service"

export function registerAuthRoutes(router: Router) {

  // user registration
  router.post("/auth/register", async (req, res) => {
    const parsed = RegisterSchema.safeParse(req.body)

    if (!parsed.success) {
      return res.status(400).json({
        error: parsed.error.flatten()
      })
    }

    const tokens = await authService.register(parsed.data)
    res.status(201).json(tokens)
  })
  
  // user login
  router.post("/auth/login", async (req, res) => {
    const parsed = LoginSchema.safeParse(req.body)

    if (!parsed.success) {
      return res.status(400).json({
        error: parsed.error.flatten()
      })
    }

    const tokens = await authService.login(parsed.data)

    if(!tokens){
      return res.status(401).json({ error: "User context missing" });
    }

    res.cookie("access_token", tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000, // 15 min
    });

    res.cookie("refresh_token", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json(tokens)
  })
  
  // user session token refresh
  router.post("/auth/refresh", async (req, res) => {
  const parsed = RefreshSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() })
  }

  const tokens = await authService.refresh(parsed.data.refreshToken)
  res.json(tokens)
})

// user session logout
router.post("/auth/logout", async (req, res) => {

  const parsed = req.cookies.refresh_token

  await authService.logout(parsed)
  res.status(204).send()
})


}
