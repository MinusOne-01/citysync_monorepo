import { AppError } from "../../shared/errors"
import { getPresignedUploadUrl } from "../../shared/s3.service"
import { meetupRepo } from "./meetup.repo"
import { env } from "../../shared/env";
import ca from "zod/v4/locales/ca.js";

const BUCKET = env.AWS_S3_BUCKET!;
const REGION = env.AWS_REGION!;

export type MeetupId = string

export type MeetupStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "CANCELLED"
  | "ENDED"

export type CreateMeetupInput = {
  title: string
  description?: string
  startTime: Date
  capacity?: number
  meetupImageKey: string
}

export type EditMeetupInput = {
  title?: string
  description?: string
  startTime?: Date
  capacity?: number
}

export type SignedUrlResponse = {
  signedUrl: string;
  key: string;
  publicUrl: string;
}

export type FindMeetupResponse = {
  title: string
  description: string | null
  startTime: Date
  capacity: number | null
  status: MeetupStatus
  imageUrl: string
  createdAt: Date
}

export interface MeetupService {
  createMeetup(
    organizerId: string,
    input: CreateMeetupInput
  ): Promise<MeetupId>
  
  getMeetupUploadUrl(
    userId: string,
    fileType: string
  ): Promise<SignedUrlResponse>;

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

  private getPublicURL(key: string): string {
        const url = `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`;
        return url;
  }

  async getMeetupUploadUrl(userId: string, fileType: string): Promise<SignedUrlResponse> {
          
    if (!fileType.startsWith("image/")) {
      throw new AppError("Invalid file type. Only image files are allowed.");
    }

    const uploadData = await getPresignedUploadUrl(userId, 'meetups', fileType);
    return uploadData;
  }

  async createMeetup(
    organizerId: string,
    input: CreateMeetupInput
  ): Promise<MeetupId>
  {
    this.validateStartTime(input.startTime);
    return await meetupRepo.insert(organizerId, input)
  }

  async findMeetup(meetupId: MeetupId): Promise<FindMeetupResponse> {
    const meetup = await meetupRepo.findById(meetupId);
    if (!meetup) {
      throw new AppError("Meetup not found", 404);
    }

    const imageUrl = this.getPublicURL(meetup.meetupImageKey);
    
    const meetupData = {
      title: meetup.title,
      description: meetup.description,
      startTime: meetup.startTime,
      capacity: meetup.capacity,
      status: meetup.status,
      imageUrl,
      createdAt: meetup.createdAt
    }

    return meetupData;
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
    input: EditMeetupInput
  ) {
    if (input.startTime)
       this.validateStartTime(input.startTime);
    try{
       await meetupRepo.editMeetupDetails(meetupId, organizerId, input); 
    } 
    catch(err){
      throw new AppError("Meetup cannot be updated in its current status");
    } 
    
  }

  async cancelMeetup(meetupId: MeetupId, organizerId: string) {
    await meetupRepo.updateStatus(meetupId, organizerId, "CANCELLED", ["DRAFT", "PUBLISHED", "CANCELLED"]);
  }
}

export const meetupService = new MeetupServiceImpl();
