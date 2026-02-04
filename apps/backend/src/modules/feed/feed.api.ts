import { Router } from "express";
import { getFeedSchema } from "./feed.schema";
import { feedService } from "./feed.service";
import { defaultRateLimiter } from "../../shared/middleware/userRateLimiter";


export function registerFeedRoutes(router: Router) {
   
    router.get("/feed", defaultRateLimiter, async (req, res, next) => {

        try {
            const parsed = getFeedSchema.safeParse(req.query);

            if (!parsed.success) {
                return res.status(400).json({
                    error: parsed.error.flatten()
                })
            };

            const meetups = await feedService.buildMainFeed(parsed.data)

            return res.status(200).json(meetups);
        }
        catch (err) {
            next(err)
        }

    });
    
}

