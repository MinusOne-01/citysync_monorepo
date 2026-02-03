import { Router } from "express"
import { CreateMeetupSchema, EditMeetupSchema, MeetupUploadUrlSchema, ValidateMeetupIdSchema } from "./meetup.schema"
import { meetupService } from "./meetup.service"
import { authMiddleware, AuthenticatedRequest } from "../auth"

export function registerMeetupRoutes(router: Router) {

  router.post("/meetups/create", authMiddleware, async (req: AuthenticatedRequest, res, next) => {

    try {

      if (!req.user) return res.status(401).json({ error: "User context missing" })

      const parsed = CreateMeetupSchema.safeParse(req.body)
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten() })
      }

      const meetupId = await meetupService.createMeetup(req.user.userId, parsed.data)
      return res.status(201).json({ meetupId })
    } 
    catch (err) {
      return next(err)
    }

  })

  router.post("/meetups/upload-url", authMiddleware, async (req: AuthenticatedRequest, res, next) => {

    try {

      if (!req.user) return res.status(401).json({ error: "User context missing" })

      const parsed = MeetupUploadUrlSchema.safeParse(req.body)
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten() })
      }

      const uploadData = await meetupService.getMeetupUploadUrl(req.user.userId, parsed.data.fileType)
      return res.status(200).json({ uploadData })
    }
    catch (err) {
      return next(err)
    }

  })

  router.get("/meetups/:meetupId", async (req, res, next) => {
    
     try {

      const parsed = ValidateMeetupIdSchema.safeParse(req.params)
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten() })
      }
      
      const meetup = await meetupService.findMeetup(parsed.data.meetupId)
      return res.status(200).json({ meetup })
    } 
    catch (err) {
      return next(err)
    }

  })

  router.get("/meetups/:meetupId/creator-view", authMiddleware, async (req: AuthenticatedRequest, res, next) => {

    try {

      if (!req.user) return res.status(401).json({ error: "User context missing" })

      const parsed = ValidateMeetupIdSchema.safeParse(req.params)
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten() })
      }

      const meetup = await meetupService.meetupCreatorView(parsed.data.meetupId, req.user.userId)
      return res.status(200).json({ meetup })
    }
    catch (err) {
      return next(err)
    }

  })

  router.put("/meetups/:meetupId/publish", authMiddleware, async (req: AuthenticatedRequest, res, next) => {

    try {

      if (!req.user) return res.status(401).json({ error: "User context missing" })

      const parsed = ValidateMeetupIdSchema.safeParse(req.params)
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten() })
      }

      await meetupService.publishMeetup(parsed.data.meetupId, req.user.userId)
      return res.status(200).json({ message: "Meetup published successfully" })
    } 
    catch (err) {
      return next(err)
    }

  })

  router.put("/meetups/:meetupId/edit", authMiddleware,  async (req: AuthenticatedRequest, res, next) => {

    try {

      if (!req.user) return res.status(401).json({ error: "User context missing" })

      const paramsParsed = ValidateMeetupIdSchema.safeParse(req.params)
      if (!paramsParsed.success) {
        return res.status(400).json({ error: paramsParsed.error.flatten() })
      }

      const bodyParsed = EditMeetupSchema.safeParse(req.body)
      if (!bodyParsed.success) {
        return res.status(400).json({ error: bodyParsed.error.flatten() })
      }

      await meetupService.editMeetup(paramsParsed.data.meetupId, req.user.userId, bodyParsed.data)
      return res.status(200).json({ message: "Meetup edited successfully" })
    } 
    catch (err) {
      return next(err)
    }

  })

  router.put("/meetups/:meetupId/cancel", authMiddleware,  async (req: AuthenticatedRequest, res, next) => {

    try {

      if (!req.user) return res.status(401).json({ error: "User context missing" })

      const parsed = ValidateMeetupIdSchema.safeParse(req.params)
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten() })
      }

      await meetupService.cancelMeetup(parsed.data.meetupId, req.user.userId)
      return res.status(200).json({ message: "Meetup cancelled successfully" })
    } 
    catch (err) {
      return next(err)
    }
    
  })

}
