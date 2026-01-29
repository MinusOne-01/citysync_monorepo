import { MeetupId, MeetupStatus, CreateMeetupInput } from "./meetup.service"
import { prisma } from "../../shared/db"


export interface MeetupRecord {
  id: MeetupId
  organizerId: string
  title: string
  description: string | null
  startTime: Date
  capacity: number | null
  status: MeetupStatus
  createdAt: Date
  meetupImageKey: string
  longitude: number
  latitude: number
  city: string | null
  area: string | null
  placeName: string | null
}



export interface MeetupRepository {
  insert(
    organizerId: string,
    input: CreateMeetupInput
  ): Promise<MeetupId>

  findById(meetupId: MeetupId): Promise<MeetupRecord | null>

  updateStatus(
    meetupId: MeetupId,
    organizerId: string,
    status: MeetupStatus,
    allowedCurrentStatuses: MeetupStatus[]
  ): Promise<void>

  editMeetupDetails(
    meetupId: MeetupId,
    organizerId: string,
    data: Partial<CreateMeetupInput>
  ): Promise<void>

}

/**
 * ...
 */

export class meetupRepoImpl implements MeetupRepository {

  async insert(
    organizerId: string,
    input: CreateMeetupInput
  ): Promise<MeetupId>
  {
    const record = await prisma.meetup.create({
      data: {
        organizerId,
        title: input.title,
        description: input.description,
        startTime: input.startTime,
        capacity: input.capacity,
        status: "DRAFT",
        longitude: input.longitude,
        latitude: input.latitude,
        city: input.city || null,
        area: input.area || null,
        placeName: input.placeName || null,
        meetupImageKey: input.meetupImageKey
      }
    })
    return record.id
  }

  async findById(
    meetupId: MeetupId
  ): Promise<MeetupRecord | null>
  {
    const record = await prisma.meetup.findUnique({
      where: { id: meetupId, status: "PUBLISHED" }
    })
    if(!record) {
      return null
    }
    return record
  }

  async updateStatus(
    meetupId: MeetupId, 
    organizerId: string, 
    status: MeetupStatus,
    allowedCurrentStatuses: MeetupStatus[]
  ): Promise<void> {
    
    const result = await prisma.meetup.updateMany({
      where: { 
        id: meetupId, 
        organizerId,
        status: { in: allowedCurrentStatuses }
      },
      data: { status }
    })

    if (result.count === 0) {
      throw new Error("Update failed: Meetup not found or invalid status transition")
    }
  }

  async editMeetupDetails(
    meetupId: MeetupId,
    organizerId: string,
    data: Partial<CreateMeetupInput>
  ): Promise<void>
  {
    await prisma.meetup.update({
      where: {
        id: meetupId,
        organizerId,
        status: { in: ["DRAFT", "PUBLISHED"] }
      },
      data
    })


  }

}

export const meetupRepo = new meetupRepoImpl()
