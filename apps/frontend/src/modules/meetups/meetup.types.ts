export type MeetupStatus = "DRAFT" | "PUBLISHED" | "CANCELLED" | "ENDED"

export type Meetup = {
  id: string
  organizerId: string
  title: string
  description: string | null
  startTime: string
  capacity: number | null
  status: MeetupStatus
  longitude: number
  latitude: number
  city: string | null
  area: string | null
  placeName: string | null
  imageUrl: string
  createdAt: string
}

export type CreateMeetupInput = {
  title: string
  description?: string
  startTime: string | Date
  capacity?: number
  longitude: number
  latitude: number
  city?: string
  area?: string
  placeName?: string
  meetupImageKey: string
}

export type EditMeetupInput = {
  title?: string
  description?: string
  startTime?: string | Date
  capacity?: number
}

export type UploadUrlResult = {
  uploadData: {
    signedUrl: string
    key: string
    publicUrl: string
  }
}

export type CreateMeetupResult = { meetupId: string }
export type MeetupResult = { meetup: Meetup }
