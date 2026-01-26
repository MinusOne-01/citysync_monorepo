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
  const parsed = RefreshSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() })
  }

  await authService.logout(parsed.data.refreshToken)
  res.status(204).send()
})


}
