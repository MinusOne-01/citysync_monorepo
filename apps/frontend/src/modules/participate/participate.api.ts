import { apiRequest } from "../../shared/utils/apiClient";
import type {
  JoinMeetupResponse,
  LeaveMeetupResponse,
  Participant,
  ChangeParticipantStatusResponse,
  ParticipationStatusResponse,
  ParticipantHistoryResponse,
  ParticipationStatus,
} from "./participate.types";

export function joinMeetup(meetupId: string): Promise<JoinMeetupResponse> {
  return apiRequest<JoinMeetupResponse>(`/participate/${meetupId}/join`, {
    method: "POST"
  });
}

export function leaveMeetup(meetupId: string): Promise<LeaveMeetupResponse> {
  return apiRequest<LeaveMeetupResponse>(`/participate/${meetupId}/leave`, {
    method: "PUT"
  });
}

export function getParticipationStatus(
  meetupId: string
): Promise<ParticipationStatusResponse> {
  return apiRequest<ParticipationStatusResponse>(
    `/participate/${meetupId}/status`
  );
}

export function getMeetupParticipants(meetupId: string): Promise<Participant[]> {
  return apiRequest<Participant[]>(`/participate/${meetupId}/get-participants`
  );
}

export function changeParticipantStatus(
  meetupId: string,
  participantId: string,
  newStatus: ParticipationStatus
): Promise<ChangeParticipantStatusResponse> {
  return apiRequest<ChangeParticipantStatusResponse>(
    `/participate/${meetupId}/change-participant-status`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ participantId, newStatus }),
    }
  );
}

export function getParticipantHistory(): Promise<ParticipantHistoryResponse> {
  return apiRequest<ParticipantHistoryResponse>("/participate/get-user-history"
  );
}
