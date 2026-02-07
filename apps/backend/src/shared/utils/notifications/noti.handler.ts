import { prisma } from "../../configs/db";

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

    case "PARTICIPANT_STATUS_UPDATE":
      await prisma.notification.create({
        data: {
          userId: payload.participantId,
          type: "PARTICIPANT_STATUS_UPDATE",
          data: payload
        }
      });
      break;

    case "MEETUP_UPDATED":
      const participants = await prisma.participation.findMany({
        where: { meetupId: payload.meetupId },
        select: { userId: true },
      });

      const notificationsData = participants.map((p) => ({
        userId: p.userId,
        type: "MEETUP_UPDATED" as const,
        data: payload,
      }));

      await prisma.notification.createMany({
        data: notificationsData,
        skipDuplicates: true,
      });

      break;
  }
}
