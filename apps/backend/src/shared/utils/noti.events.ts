
export type NotificationEvent =
  | {
      type: "JOIN_REQUEST";
      payload: {
        organizerId: string;
        meetupId: string;
        participantId: string;
        participantName: string;
      };
    }
  | {
      type: "PARTICIPANT_APPROVED";
      payload: {
        participantId: string;
        meetupId: string;
        meetupName: string;
      };
    };
