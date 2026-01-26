import { Router } from "express";
import { MeetupSchema } from "./participate.schema";
import { participateService } from "./participate.service";
import { authMiddleware, AuthenticatedRequest } from "../auth"

export function registerParticipateRoutes(router: Router) {

  router.post("/participate/:id/join", authMiddleware, async (req: AuthenticatedRequest, res) => {

    if (!req.user) {
      return res.status(401).json({ error: "User context missing" });
    }

    const userId = req.user.userId;
    const parsed = MeetupSchema.safeParse(req.params);

    if (!parsed.success) {
      return res.status(400).json({
        error: parsed.error.flatten()
      })
    };
    const meetupId = req.params.id as string;

    const result = await participateService.joinMeetup(userId, meetupId);

    if (!result) {
      return res.status(500).json({ error: "Could not join meetup" });
    }

    return res.status(200).json(result);

  });

  router.put("/participate/:id/leave", authMiddleware, async (req: AuthenticatedRequest, res) => {

    if (!req.user) {
      return res.status(401).json({ error: "User context missing" });
    }   

    const userId = req.user.userId;
    const parsed = MeetupSchema.safeParse(req.params);

    if (!parsed.success) {
      return res.status(400).json({
        error: parsed.error.flatten()
      })
    };

    const meetupId = req.params.id as string;   

    await participateService.leaveMeetup(userId, meetupId);

    return res.status(200).json({ message: "Left meetup successfully" });
  });

  router.get("/participate/:id/status", authMiddleware,  async (req: AuthenticatedRequest, res) => {

    if (!req.user) {
      return res.status(401).json({ error: "User context missing" });
    }

    const userId = req.user.userId;
    const parsed = MeetupSchema.safeParse(req.params);

    if (!parsed.success) {
      return res.status(400).json({
        error: parsed.error.flatten()
      })
    };

    const meetupId = req.params.id as string;

    const result = await participateService.findParticipation(userId, meetupId);

    if (!result) {
      return res.status(404).json({ error: "Participation not found" });
    }

    return res.status(200).json(result);
  });

}

