import { Router } from "express";
import { authMiddleware, AuthenticatedRequest } from "../auth"
import { notiService } from "./noti.service";
import { updateNotiSchema } from "./noti.schema";
import { defaultRateLimiter } from "../../shared/middleware/useRateLimiter";

export function registerNotificationsRoutes(router: Router) {

    router.use(defaultRateLimiter)

    router.get("/notifications", authMiddleware, async (req: AuthenticatedRequest, res, next) => {

        try {

            if (!req.user) return res.status(401).json({ error: "User context missing" });

            const userId = req.user.userId;
            const limit = req.query.limit ? Number(req.query.limit) : 20;
            const cursor = typeof req.query.cursor === "string" ? req.query.cursor : undefined;

            const result = await notiService.getUserNoti({ userId, limit, cursor });
            return res.status(200).json(result);
        }
        catch (err) {
            return next(err);
        }

    });

    router.patch("/notifications/:id/read", authMiddleware, async (req: AuthenticatedRequest, res, next) => {

        try {

            if (!req.user) return res.status(401).json({ error: "User context missing" });

            const parsed = updateNotiSchema.safeParse(req.params);
            if (!parsed.success) {
                return res.status(400).json({ error: parsed.error.flatten() })
            }

            const userId = req.user.userId;
            const recordId = parsed.data.id;

            const result = await notiService.markIsRead({ userId, recordId })
            return res.status(200).json(result);
        }
        catch (err) {
            return next(err);
        }

    });

    router.patch("/notifications/read-all", authMiddleware, async (req: AuthenticatedRequest, res, next) => {

        try {

            if (!req.user) return res.status(401).json({ error: "User context missing" });

            const userId = req.user.userId;
            const result = await notiService.markIsReadBulk({ userId })
            return res.status(200).json(result);
        }
        catch (err) {
            return next(err);
        }

    });

}

