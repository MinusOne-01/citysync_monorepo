import {
  joinMeetup,
  leaveMeetup,
  getParticipationStatus,
  getMeetupParticipants,
  changeParticipantStatus,
  getParticipantHistory,
} from "./participate.api";

export function useParticipationActions() {
  return {
    joinMeetup,
    leaveMeetup,
    getParticipationStatus,
    getMeetupParticipants,
    changeParticipantStatus,
    getParticipantHistory,
  };
}
