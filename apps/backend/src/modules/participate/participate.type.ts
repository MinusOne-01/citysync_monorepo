
////////////////////////
//Service types
////////////////////////

export type ParticipationRole = | "CREATOR" | "PARTICIPANT";
export type ParticipationStatus = | "REQUESTED" | "CONFIRMED" | "CANCELLED";

export type Participant = {
    userId: string;
    usernameSnapshot: string;
    status: ParticipationStatus;
};

export type JoinMeetupInput = {
    userId: string
    meetupId: string
}

export type JoinMeetupResponse = {
    success: boolean
    message: string
}

export type LeaveMeetupInput = {
    userId: string
    meetupId: string
}

export type LeaveMeetupResponse = {
    success: boolean
    message: string
}

export type GetMeetupParticipantsInput = {
    userId: string
    meetupId: string
}

export type GetMeetupParticipantsResponse = Participant[];

export type ChangeParticipantStatusInput = {
    creatorId: string
    participantId: string
    meetupId: string
    newStatus: ParticipationStatus
}

export type ChangeParticipantStatusResponse = {
    success: boolean
    message: string
}

export type GetParticipationStatusInput = {
    userId: string
    meetupId: string
}

export type GetParticipationStatusResponse = {
    status: ParticipationStatus
    createdAt: Date
}

export type GetParticipantHistoryInput = {
    userId: string
}

export type GetParticipantHistoryResponse = {
    userId: string
    meetupId: string
    role: string
    joinedAt: Date
    meetupDate: Date
    longitude: number
    latitude: number
    city: string | null
    area: string | null
    placeName: string | null
    meetupImageUrl: string
}[]






////////////////////////
//Repo types
////////////////////////

export type CreateParticipationInput = {
    userId: string
    username: string
    meetupId: string
}

export type CreateParticipationResponse = void;

export type DeleteParticipationInput = {
    userId: string
    meetupId: string
}

export type DeleteParticipationResponse = void;

export type FetchMeetupParticipantsInput = {
    meetupId: string
}

export type FetchMeetupParticipantsResponse = Participant[];

export type ApproveParticipantStatusInput = {
    userId: string
    username: string
    role: string
    meetupId: string
    meetupDate: Date
    longitude: number
    latitude: number
    meetupImageUrl: string
}

export type ApproveParticipantStatusResponse = void;

export type CancelParticipantStatusInput = {
    userId: string
    meetupId: string
}

export type CancelParticipantStatusResponse = void;

export type FetchParticipantStatusInput = {
    userId: string
    meetupId: string
}

export type FetchParticipantStatusResponse = {
    status: ParticipationStatus
    createdAt: Date
}

export type FetchParticipantHistoryInput = {
    userId: string
}

export type FetchParticipantHistoryResponse = {
    userId: string
    meetupId: string
    role: string
    joinedAt: Date
    meetupDate: Date
    longitude: number
    latitude: number
    city: string | null
    area: string | null
    placeName: string | null
    meetupImageUrl: string
}[]

