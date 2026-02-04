import { Router } from "express"
import { authMiddleware, AuthenticatedRequest } from "../auth"
import { userService } from "./user.service";
import { createUserSchema, userUploadCompleteSchema, updateUserSchema, userParamsSchema, userUploadUrlSchema } from "./user.schema";
import { defaultRateLimiter } from "../../shared/middleware/userRateLimiter";

export function registeredUserRoutes(router: Router) {

  router.use(defaultRateLimiter)

  router.get("/user/me", authMiddleware, async (req: AuthenticatedRequest, res, next) => {
     
    try {

      if (!req.user) {
        return res.status(401).json({ error: "User context missing" })
      }

      const userId = req.user.userId
      const user = await userService.findUserbyId(userId)

      if (!user) {
        return res.status(404).json({ error: "User not found" })
      }

      return res.status(200).json({ user })
    } 
    catch (err) {
      return next(err)
    }

  });
  
  router.put("/user/update", authMiddleware, async (req: AuthenticatedRequest, res, next) => {

    try {

      if (!req.user) {
        return res.status(401).json({ error: "User context missing" })
      }

      const parsed = updateUserSchema.safeParse(req.body)
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten() })
      }

      const userId = req.user.userId
      const updatedUser = await userService.updateUser(userId, parsed.data)
      return res.status(200).json({ user: updatedUser })
    } 
    catch (err) {
      return next(err)
    }

  });

  router.post("/user/profile-upload-url", authMiddleware,  async (req: AuthenticatedRequest, res, next) => {

    try {

      if (!req.user) {
        return res.status(401).json({ error: "User context missing" })
      }

      const parsed = userUploadUrlSchema.safeParse(req.body)
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten() })
      }

      const userId = req.user.userId
      const uploadData = await userService.getProfileUploadUrl(userId, parsed.data.fileType)
      return res.status(200).json({ uploadData })
    } 
    catch (err) {
      return next(err)
    }

    });

  router.put("/user/profile-upload-complete", authMiddleware, async (req: AuthenticatedRequest, res, next) => {

    try {

      if (!req.user) {
        return res.status(401).json({ error: "User context missing" })
      }

      const parsed = userUploadCompleteSchema.safeParse(req.body)
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten() })
      }

      const userId = req.user.userId
      const updatedUser = await userService.updateUser(userId, parsed.data)
      return res.status(200).json({ user: updatedUser })
    } 
    catch (err) {
      return next(err)
    }

  });

  router.get("/user/:username", async (req, res, next) => {
    
    try {

      const parsed = userParamsSchema.safeParse(req.params)
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten() })
      }

      const userAcc = await userService.getUserByUsername(parsed.data.username)
      if (!userAcc) {
        return res.status(404).json({ error: "User not found" })
      }

      return res.status(200).json({ user: userAcc })
    } 
    catch (err) {
      return next(err)
    }

  }); 

}

