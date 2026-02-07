import { Router } from "express";
import { ChangeStatusSchema, MeetupSchema } from "./participate.schema";
import { participateService } from "./participate.service";
import { authMiddleware, AuthenticatedRequest } from "../auth"
import { defaultRateLimiter } from "../../shared/middleware/useRateLimiter";

export function registerParticipateRoutes(router: Router) {

  router.use(defaultRateLimiter)

  router.post("/participate/:id/join", authMiddleware, async (req: AuthenticatedRequest, res, next) => {

    try {

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

      const result = await participateService.joinMeetup({ userId, meetupId });

      if (!result) {
        return res.status(500).json({ error: "Could not join meetup" });
      }

      return res.status(200).json(result);
    }
    catch (err) {
      return next(err)
    }

  });

  router.put("/participate/:id/leave", authMiddleware, async (req: AuthenticatedRequest, res, next) => {

    try {

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

      const result = await participateService.leaveMeetup({ userId, meetupId });

      if (!result) {
        return res.status(500).json({ error: "Could not leave meetup" });
      }

      return res.status(200).json(result);
    }
    catch (err) {
      return next(err)
    }

  });

  router.get("/participate/:id/status", authMiddleware, async (req: AuthenticatedRequest, res, next) => {

    try {

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

      const result = await participateService.getParticipationStatus({ userId, meetupId });
      if (!result) {
        return res.status(404).json({ error: "Participation not found" });
      }

      return res.status(200).json(result);
    }
    catch (err) {
      return next(err)
    }

  });

  router.get("/participate/:id/get-participants", authMiddleware, async (req: AuthenticatedRequest, res, next) => {

    try {

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

      const result = await participateService.getMeetupParticipants({ userId, meetupId });

      return res.status(200).json(result);
    }
    catch (err) {
      return next(err)
    }

  });

  router.put("/participate/:id/change-participant-status", authMiddleware, async (req: AuthenticatedRequest, res, next) => {

    try {

      if (!req.user) {
        return res.status(401).json({ error: "User context missing" });
      }

      const parsedParam = MeetupSchema.safeParse(req.params);
      const parsedBody = ChangeStatusSchema.safeParse(req.body);

      if (!parsedParam.success) {
        return res.status(400).json({
          error: parsedParam.error.flatten()
        })
      };

      if (!parsedBody.success) {
        return res.status(400).json({
          error: parsedBody.error.flatten()
        })
      };

      const creatorId = req.user.userId;
      const meetupId = parsedParam.data.id as string;
      const participantId = parsedBody.data.participantId as string;
      const newStatus = parsedBody.data.newStatus;

      const result = await participateService.changeParticipantStatus({ creatorId, meetupId, participantId, newStatus });

      return res.status(200).json(result);

    }
    catch (err) {
      return next(err)
    }

  });

  router.get("/participate/get-user-history", authMiddleware, async (req: AuthenticatedRequest, res, next) => {

    try {

      if (!req.user) {
        return res.status(401).json({ error: "User context missing" });
      }

      const userId = req.user.userId;

      const result = await participateService.getParticipantHistory({ userId });

      return res.status(200).json(result);
    }
    catch (err) {
      return next(err)
    }

  });

}

