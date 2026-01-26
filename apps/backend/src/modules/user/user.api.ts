import { Router } from "express"
import { authMiddleware, AuthenticatedRequest } from "../auth"
import { userService } from "./user.service";
import { createUserSchema, profileUploadCompleteSchema, updateUserSchema, userParamsSchema, userProfileUploadSchema } from "./user.schema";

export function registeredUserRoutes(router: Router) {

  router.get("/user/:username", async (req, res) => {

    const parsed = userParamsSchema.safeParse(req.params);

    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() })
    };

    const username = req.params.username as string;
    const userAcc =  await userService.getUserByUsername(username);
    
    if (!userAcc) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json({ user: userAcc });

  }); 
  

  router.put("/user/update", authMiddleware, async (req: AuthenticatedRequest, res) => {

    if (!req.user) {
      return res.status(401).json({ error: "User context missing" });
    }

    const parsed = updateUserSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() })
    };

    const userId = req.user.userId;

    const updatedUser = await userService.updateUser(userId, parsed.data);
    return res.status(200).json({ user: updatedUser });

  });

  router.post("/user/profile-upload-url", authMiddleware,  async (req: AuthenticatedRequest, res) => {

    if (!req.user) {
      return res.status(401).json({ error: "User context missing" });
    }

    const parsed = userProfileUploadSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() })
    }

    const fileType = parsed.data.fileType;
    const uploadData = await userService.getProfileUploadUrl(fileType);

    return  res.status(200).json({ uploadData });
  });

  router.put("/user/profile-upload-complete", authMiddleware, async (req: AuthenticatedRequest, res) => {

    if (!req.user) {
      return res.status(401).json({ error: "User context missing" });
    }

    const parsed = profileUploadCompleteSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() })
    }
    
    const userId = req.user.userId;

    const updatedUser = await userService.updateUser(userId, parsed.data);
    return res.status(200).json({ user: updatedUser });

  });

}

