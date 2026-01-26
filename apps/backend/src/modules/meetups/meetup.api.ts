import { Router } from "express"
import { CreateMeetupSchema, PublishMeetupSchema } from "./meetup.schema"
import { meetupService } from "./meetup.service"
import { authMiddleware, AuthenticatedRequest } from "../auth"

export function registerMeetupRoutes(router: Router) {

  router.post("/meetups", authMiddleware, async (req: AuthenticatedRequest, res) => {

    if (!req.user) {
      return res.status(401).json({ error: "User context missing" });
    }

    const organizerId = req.user.userId;

    const parsed = CreateMeetupSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: parsed.error.flatten()
      })
    };

    const meetupId = await meetupService.createMeetup(
      organizerId,
      parsed.data
    );

    res.status(201).json({ meetupId });
  })

  router.put("/meetups/:meetupId/publish", authMiddleware, async (req: AuthenticatedRequest, res) => {

    if (!req.user) {
      return res.status(401).json({ error: "User context missing" });
    }

    const parsed = PublishMeetupSchema.safeParse(req.params);

    if (!parsed.success) {
      return res.status(400).json({
        error: parsed.error.flatten()
      })
    };

    const organizerId = req.user.userId;
    const meetupId = req.params.meetupId as string;
    await meetupService.publishMeetup(meetupId, organizerId);

    res.status(200).json({ message: "Meetup published successfully" });
  })

  router.put("/meetups/:meetupId/edit", authMiddleware,  async (req: AuthenticatedRequest, res) => {

    if (!req.user) {
      return res.status(401).json({ error: "User context missing" });
    }

    const parsedParams = CreateMeetupSchema.safeParse(req.body);

    if (!parsedParams.success) {
      return res.status(400).json({
        error: parsedParams.error.flatten()
      })
    };

    const organizerId = req.user.userId;
    const meetupId = req.params.meetupId as string;
    await meetupService.editMeetup(meetupId, organizerId, parsedParams.data);

    res.status(200).json({ message: "Meetup edited successfully" });
  })

  router.put("/meetups/:meetupId/cancel", authMiddleware,  async (req: AuthenticatedRequest, res) => {

    if (!req.user) {
      return res.status(401).json({ error: "User context missing" });
    }
    const organizerId = req.user.userId;
    const meetupId = req.params.meetupId as string;
    await meetupService.cancelMeetup(meetupId, organizerId);
    res.status(200).json({ message: "Meetup cancelled successfully" });
    
  })

}
