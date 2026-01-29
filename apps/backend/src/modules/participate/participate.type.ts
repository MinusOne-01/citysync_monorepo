
////////////////////////
//Service types
////////////////////////

export type ParticipationRole = | "CREATOR" | "PARTICIPANT";
export type ParticipationStatus = | "REQUESTED" | "CONFIRMED" | "CANCELLED";

export type Participant = {
    userId: string;
    username: string;
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
    status: string
    createdAt: string
}