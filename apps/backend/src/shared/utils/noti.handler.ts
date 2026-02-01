import { prisma } from "../configs/db";

export async function handleNotification(type: string, payload: any) {
  switch (type) {
    case "JOIN_REQUEST":
      await prisma.notification.create({
        data: {
          userId: payload.organizerId,
          type: "JOIN_REQUEST",
          data: payload
        }
      });
      break;

    case "PARTICIPANT_APPROVED":
      await prisma.notification.create({
        data: {
          userId: payload.participantId,
          type: "PARTICIPANT_APPROVED",
          data: payload
        }
      });
      break;
  }
}
