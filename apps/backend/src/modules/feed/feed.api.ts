import { Router } from "express";
import { getFeedSchema } from "./feed.schema";
import { feedService } from "./feed.service";

export function registerFeedRoutes(router: Router) {
   
    router.get("/feed", async (req, res) => {

        const parsed = getFeedSchema.safeParse(req.query);

        if (!parsed.success) {
            return res.status(400).json({
                error: parsed.error.flatten()
            })
        };

        const meetups = await feedService.buildMainFeed(parsed.data)

        return res.status(200).json(meetups);

    });
    
}