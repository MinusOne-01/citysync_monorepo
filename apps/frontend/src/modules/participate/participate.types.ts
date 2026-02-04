export type ParticipationStatus = "REQUESTED" | "CONFIRMED" | "CANCELLED";

export type Participant = {
  userId: string;
  usernameSnapshot: string;
  status: ParticipationStatus;
};

export type JoinMeetupResponse = {
  success: boolean;
  message: string;
};

export type LeaveMeetupResponse = {
  success: boolean;
  message: string;
};

export type ChangeParticipantStatusResponse = {
  success: boolean;
  message: string;
};

export type ParticipationStatusResponse = {
  status: ParticipationStatus;
  createdAt: string;
};

export type ParticipantHistoryItem = {
  userId: string;
  meetupId: string;
  role: string;
  joinedAt: string;
  meetupDate: string;
  longitude: number;
  latitude: number;
  city: string | null;
  area: string | null;
  placeName: string | null;
  meetupImageUrl: string;
};

export type ParticipantHistoryResponse = ParticipantHistoryItem[];
