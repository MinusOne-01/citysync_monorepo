import { AppError } from "../../shared/errors"
import { meetupRepo } from "./meetup.repo"

export type MeetupId = string

export type MeetupStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "CANCELLED"
  | "ENDED"

export interface CreateMeetupInput {
  title: string
  description?: string
  startTime: Date
  capacity?: number
}

export interface MeetupService {
  createMeetup(
    organizerId: string,
    input: CreateMeetupInput
  ): Promise<MeetupId>

  publishMeetup(
    meetupId: MeetupId,
    organizerId: string
  ): Promise<void>

  editMeetup(
    meetupId: MeetupId,
    organizerId: string,
    input: CreateMeetupInput
  ): Promise<void>

  cancelMeetup(
    meetupId: MeetupId,
    organizerId: string
  ): Promise<void>
}

/**
 * Temporary stub implementation.
 * Logic comes next.
 */

class MeetupServiceImpl implements MeetupService {

  private validateStartTime(startTime: Date) {
    if (startTime <= new Date()) {
      throw new AppError("Meetup must be scheduled in the future", 400);
    }
  }

  async createMeetup(
    organizerId: string,
    input: CreateMeetupInput
  ): Promise<MeetupId>
  {
    this.validateStartTime(input.startTime);
    return await meetupRepo.insert(organizerId, input)
  }

  async publishMeetup(
    meetupId: MeetupId,
    organizerId: string)
  {
    await meetupRepo.updateStatus(meetupId, organizerId, "PUBLISHED", ["DRAFT", "PUBLISHED"]);
  }

  async editMeetup(
    meetupId: MeetupId,
    organizerId: string,
    input: CreateMeetupInput
  ) {
    this.validateStartTime(input.startTime);
    await meetupRepo.editMeetupDetails(meetupId, organizerId, input); 
  }

  async cancelMeetup(meetupId: MeetupId, organizerId: string) {
    await meetupRepo.updateStatus(meetupId, organizerId, "CANCELLED", ["DRAFT", "PUBLISHED", "CANCELLED"]);
  }
}

export const meetupService = new MeetupServiceImpl();
