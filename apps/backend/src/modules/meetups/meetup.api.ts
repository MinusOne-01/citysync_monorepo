import { Router } from "express"
import { CreateMeetupSchema, EditMeetupSchema, MeetupUploadUrlSchema, PublishMeetupSchema } from "./meetup.schema"
import { meetupService } from "./meetup.service"
import { authMiddleware, AuthenticatedRequest } from "../auth"

export function registerMeetupRoutes(router: Router) {

  router.post("/meetups/create", authMiddleware, async (req: AuthenticatedRequest, res) => {

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

  router.post("/meetups/upload-url", authMiddleware, async (req: AuthenticatedRequest, res) => {

    if (!req.user) {
      return res.status(401).json({ error: "User context missing" });
    }

    const parsed = MeetupUploadUrlSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: parsed.error.flatten()
      })
    };
    const userId = req.user.userId;
    const fileType = parsed.data.fileType;
    const uploadData = await meetupService.getMeetupUploadUrl(userId, fileType);

    res.status(200).json(uploadData);
  })

  router.get("/meetups/:meetupId", async (req, res) => {
    
    const parsed = PublishMeetupSchema.safeParse(req.params);

    if (!parsed.success) {
      return res.status(400).json({
        error: parsed.error.flatten()
      })
    };
    
    const meetupId = req.params.meetupId as string;
    const meetup = await meetupService.findMeetup(meetupId);
    res.status(200).json({ meetup });
  })

  router.get("/meetups/:meetupId/creator-view", authMiddleware, async (req: AuthenticatedRequest, res) => {

    if (!req.user) {
      return res.status(401).json({ error: "User context missing" });
    }

    const parsed = PublishMeetupSchema.safeParse(req.params);

    if (!parsed.success) {
      return res.status(400).json({
        error: parsed.error.flatten()
      })
    };

    const creatorId = req.user.userId;
    const meetupId = req.params.meetupId as string;
    const meetup = await meetupService.meetupCreatorView(meetupId, creatorId);

    res.status(200).json({ meetup });
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

    const parsedParams = EditMeetupSchema.safeParse(req.body);

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
