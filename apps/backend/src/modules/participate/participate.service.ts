import { participateRepo } from "./participate.repo";
import { ChangeParticipantStatusInput, ChangeParticipantStatusResponse, GetMeetupParticipantsInput, GetMeetupParticipantsResponse, GetParticipationStatusInput, GetParticipationStatusResponse, JoinMeetupInput, JoinMeetupResponse, LeaveMeetupInput, LeaveMeetupResponse, GetParticipantHistoryInput, GetParticipantHistoryResponse } from "./participate.type";
import { meetupService } from "../meetups/meetup.service";
import { userService } from "../user";
import { AppError } from "../../shared/configs/errors";
import { publishNotificationEvent } from "../../shared/utils/noti.producer";


export interface ParticipateService {
    joinMeetup(input: JoinMeetupInput): Promise<JoinMeetupResponse>;
    leaveMeetup(input: LeaveMeetupInput): Promise<LeaveMeetupResponse>;
    getMeetupParticipants(input: GetMeetupParticipantsInput): Promise<GetMeetupParticipantsResponse>;
    changeParticipantStatus(input: ChangeParticipantStatusInput): Promise<ChangeParticipantStatusResponse>;
    getParticipationStatus(input: GetParticipationStatusInput): Promise<GetParticipationStatusResponse>;
    getParticipantHistory(input: GetParticipantHistoryInput): Promise<GetParticipantHistoryResponse>;
}

class ParticipateServiceImpl implements ParticipateService {

    private async fetchMeetupDetails(meetupId: string) {
        return await meetupService.findMeetup(meetupId);
    }

    private async fetchUserDetails(userId: string) {
        return await userService.findUserbyId(userId);
    }

    async joinMeetup(input: JoinMeetupInput): Promise<JoinMeetupResponse> {
        
        const meetupRecord = await this.fetchMeetupDetails(input.meetupId);
        if (!meetupRecord) {
            throw new AppError("Meetup not found");
        }

        const participantRecord = await this.fetchUserDetails(input.userId);
        if (!participantRecord) {
            throw new AppError("User not found: ");
        }

        const dbInput = {
            userId: input.userId,
            username: participantRecord.username,
            meetupId: input.meetupId,
        }

        await participateRepo.createParticipation(dbInput);

        await publishNotificationEvent({
            type: "JOIN_REQUEST",
            payload: {
                organizerId: meetupRecord.organizerId,
                meetupId: meetupRecord.id,
                participantId: participantRecord.id,
                participantName:
                    participantRecord.displayName ??
                    participantRecord.username
            }
        });

        return {
            success: true,
            message: "Successfully sent join meetup request"
        };

    }

    async leaveMeetup(input: LeaveMeetupInput): Promise<LeaveMeetupResponse> {
        
        const dbInput = {
            userId: input.userId,
            meetupId: input.meetupId
        }

        await participateRepo.deleteParticipation(dbInput)

        return {
            success: true,
            message: "Successfully left the meetup"
        };
    }

    async getParticipationStatus(input: GetParticipationStatusInput): Promise<GetParticipationStatusResponse> {

        const meetupRecord = await this.fetchMeetupDetails(input.meetupId);
        if (!meetupRecord) {
            throw new AppError("Meetup not found");
        }

        const dbInput = {
            userId: input.userId,
            meetupId: input.meetupId
        }

        const data = await participateRepo.fetchParticipantStatus(dbInput);

        if(!data){
            throw new AppError("Partiticipation not found");
        }

        return data;
        
    }

    async getMeetupParticipants(input: GetMeetupParticipantsInput): Promise<GetMeetupParticipantsResponse> {
        
        const meetupRecord = await this.fetchMeetupDetails(input.meetupId);

        if (!meetupRecord) {
            throw new AppError("Meetup not found");
        }

        if(input.userId !== meetupRecord.organizerId){
            throw new AppError("User is not the Meetup organiser")
        }

        const dbInput = {
            userId: input.userId,
            meetupId: input.meetupId
        }

        const allParticipants = await participateRepo.fetchMeetupParticipants(dbInput);

        return allParticipants;
    }

    async changeParticipantStatus(input: ChangeParticipantStatusInput): Promise<ChangeParticipantStatusResponse> {
        
        const meetupRecord = await this.fetchMeetupDetails(input.meetupId);

        if (!meetupRecord) {
            throw new AppError("Meetup not found");
        }

        if(input.creatorId !== meetupRecord.organizerId){
            throw new AppError("User dont own this Meetup")
        }
        
        if(meetupRecord.status !== "PUBLISHED"){
            throw new AppError("Only published Meetup participant status can be changed")
        }

        if(input.newStatus === "CONFIRMED"){

            const participantRecord = await this.fetchUserDetails(input.participantId);
            if (!participantRecord) {
                throw new AppError("User not found");
            }

            let role = "PARTICIPANT";
            if (participantRecord.id === meetupRecord.organizerId) {
                role = "CREATOR";
            }

            const dbInput = {
                userId: input.participantId,
                username: participantRecord.username,
                role,
                meetupId: input.meetupId,
                meetupDate: meetupRecord.startTime,
                longitude: meetupRecord.longitude,
                latitude: meetupRecord.latitude,
                meetupImageUrl: meetupRecord.imageUrl,
            }

            await participateRepo.approveParticipantStatus(dbInput)

        }
        else if(input.newStatus === "CANCELLED"){

            const dbInput = {
                userId: input.participantId,
                meetupId: input.meetupId,
                status: input.newStatus
            }

            await participateRepo.cancelParticipantStatus(dbInput)
        }
        else{
            throw new AppError("Invalid participation state transition");
        }

        await publishNotificationEvent({
            type: "PARTICIPANT_STATUS_UPDATE",
            payload: {
                participantId: input.participantId,
                meetupId: meetupRecord.id,
                meetupName: meetupRecord.title,
                status: input.newStatus
            }
        });

        return {
            success: true,
            message: "Successfully updated Participant Status"
        };

    }

    async getParticipantHistory(input: GetParticipantHistoryInput): Promise<GetParticipantHistoryResponse> {
        return await participateRepo.fetchParticipantHistory({userId: input.userId});
    }

}

export const participateService = new ParticipateServiceImpl();