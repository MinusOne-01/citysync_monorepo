import { z } from "zod"

export const RegisterSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
  username: z.string().min(3)
})

export const LoginSchema = z.object({
  email: z.email(),
  password: z.string()
})

export const RefreshSchema = z.object({
  refreshToken: z.string()
})
