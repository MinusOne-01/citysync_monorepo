import { participateRepo } from "./participate.repo";
import { ChangeParticipantStatusInput, ChangeParticipantStatusResponse, GetMeetupParticipantsInput, GetMeetupParticipantsResponse, GetParticipationStatusInput, GetParticipationStatusResponse, JoinMeetupInput, JoinMeetupResponse, LeaveMeetupInput, LeaveMeetupResponse } from "./participate.type";
import { meetupService } from "../meetups/meetup.service";
import { userService } from "../user";
import { AppError } from "../../shared/errors";


export interface ParticipateService {
    joinMeetup(input: JoinMeetupInput): Promise<JoinMeetupResponse>;
    leaveMeetup(input: LeaveMeetupInput): Promise<LeaveMeetupResponse>;
    getMeetupParticipants(input: GetMeetupParticipantsInput): Promise<GetMeetupParticipantsResponse | null>;
    changeParticipantStatus(input: ChangeParticipantStatusInput): Promise<ChangeParticipantStatusResponse>;
    getParticipationStatus(input: GetParticipationStatusInput): Promise<GetParticipationStatusResponse>;

}

class ParticipateServiceImpl implements ParticipateService {

    private async fetchMeetupDetails(meetupId: string) {
        return await meetupService.findMeetup(meetupId);
    }

    private async fetchUserDetails(userId: string) {
        return await userService.findUserbyAuthId(userId);
    }

    async joinMeetup(input: JoinMeetupInput): Promise<JoinMeetupResponse> {
        
        const meetupRecord = await this.fetchMeetupDetails(input.meetupId);
        if (!meetupRecord) {
            throw new Error("Meetup not found");
        }

        const participantRecord = await this.fetchUserDetails(input.userId);
        if (!participantRecord) {
            throw new Error("User not found");
        }

        const dbInput = {
            userId: input.userId,
            username: participantRecord.username,
            meetupId: input.meetupId,
        }

        await participateRepo.createParticipation(dbInput);

        return {
            success: true,
            message: "Successfully joined the meetup"
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

    async getMeetupParticipants(input: GetMeetupParticipantsInput): Promise<GetMeetupParticipantsResponse | null> {
        
        const meetupRecord = await this.fetchMeetupDetails(input.meetupId);

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

        if(input.creatorId !== meetupRecord.organizerId){
            throw new AppError("User is not the Meetup organiser")
        }
        
        if(meetupRecord.status !== "PUBLISHED"){
            throw new AppError("Only published Meetup participant status can be changed")
        }

        if(input.newStatus === "CONFIRMED"){

            const participantRecord = await this.fetchUserDetails(input.participantId);
            if (!participantRecord) {
                throw new Error("User not found");
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

        return {
            success: true,
            message: "Successfully updated Participant Status"
        };

    }
    
    async getParticipationStatus(input: GetParticipationStatusInput): Promise<GetParticipationStatusResponse> {

        const meetupRecord = await this.fetchMeetupDetails(input.meetupId);
        if (!meetupRecord) {
            throw new Error("Meetup not found");
        }

        const dbInput = {
            userId: input.userId,
            meetupId: input.meetupId
        }

        const data = await participateRepo.fetchParticipantStatus(dbInput);

        return data;
        
    }



}

export const participateService = new ParticipateServiceImpl();