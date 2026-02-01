
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
      type: "PARTICIPANT_STATUS_UPDATE";
      payload: {
        participantId: string;
        meetupId: string;
        meetupName: string;
        status: string
      };
    }
  | {
      type: "MEETUP_UPDATED";
      payload: {
        meetupId: string;
        meetupName: string;
        startTime: Date
      };
    };  
