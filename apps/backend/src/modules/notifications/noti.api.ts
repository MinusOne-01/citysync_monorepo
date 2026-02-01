import { Router } from "express";
import { authMiddleware, AuthenticatedRequest } from "../auth"
import { notiService } from "./noti.service";
import { updateNotiSchema } from "./noti.schema";

export function registerNotificationsRoutes(router: Router) {

    router.get("/notifications", authMiddleware, async (req: AuthenticatedRequest, res) => {

        if (!req.user) {
            return res.status(401).json({ error: "User context missing" });
        }
        
        const userId = req.user.userId;

        const result = await notiService.getUserNoti({userId})

        if (!result) {
            return res.status(500).json({ error: "Could not fetch user notifications" });
        }

        return res.status(200).json(result);

    });

    router.patch("/notifications/:id/read", authMiddleware, async (req: AuthenticatedRequest, res) => {

        if (!req.user) {
            return res.status(401).json({ error: "User context missing" });
        }

        const parsed = updateNotiSchema.safeParse(req.params);
        if (!parsed.success) {
            return res.status(400).json({
                error: parsed.error.flatten()
            })
        };
        
        const userId = req.user.userId;
        const recordId = parsed.data.id;

        const result = await notiService.markIsRead({userId, recordId})

        if (!result) {
            return res.status(500).json({ error: "Could not update notification" });
        }

        return res.status(200).json(result);

    });

    router.patch("/notifications/read-all", authMiddleware, async (req: AuthenticatedRequest, res) => {

        if (!req.user) {
            return res.status(401).json({ error: "User context missing" });
        }
        
        const userId = req.user.userId;

        const result = await notiService.markIsReadBulk({userId})

        if (!result) {
            return res.status(500).json({ error: "bulk update failed" });
        }

        return res.status(200).json(result);

    });
   
}

