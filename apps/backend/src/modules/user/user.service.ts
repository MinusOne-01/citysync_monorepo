import { Prisma } from "@prisma/client"
import { userRepo } from "./user.repo";
import { AppError } from "../../shared/configs/errors";
import { getPresignedUploadUrl } from "../../shared/configs/s3.service";
import { env } from "../../shared/configs/env";
import { UserProfile } from "./user.type";
import { NewUserInput, UserUpdateInput, UserDbRecord, SignedUrlResponse } from "./user.type";

const BUCKET = env.AWS_S3_BUCKET!;
const REGION = env.AWS_REGION!;


export interface UserService {
    createUser(data: NewUserInput, tx: Prisma.TransactionClient): Promise<UserDbRecord>;
    findUserbyId(id: string): Promise<UserProfile | null>;
    findUserbyAuthId(authId: string): Promise<UserDbRecord | null>;
    getUserByUsername(username: string): Promise<Partial<UserProfile> | null>;
    updateUser(userId: string, updateData: Partial<UserUpdateInput>): Promise<Partial<UserDbRecord>>;
    getProfileUploadUrl(userId: string, fileType: string): Promise<SignedUrlResponse>;
}

class UserServiceImpl implements UserService {
    
    private getPublicURL(key: string): string {
        const url = `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`;
        return url;
    }

    async createUser(data: NewUserInput, tx: Prisma.TransactionClient): Promise<UserDbRecord> {

        try{
            return await userRepo.createUser(data, tx);
        }
        catch(err: any){
             if (err?.code === "P2002") {
                throw new AppError("Username already taken")
            }
            throw err
        }

    }

    async getProfileUploadUrl(userId: string, fileType: string): Promise<SignedUrlResponse> {
        
        if(!fileType.startsWith("image/")){
            throw new AppError("Invalid file type. Only image files are allowed.");
        }

        const uploadData = await getPresignedUploadUrl(userId, 'profiles', fileType);
        return uploadData;
    }

    async findUserbyId(id: string): Promise<UserProfile | null> {

        const user =  await userRepo.findById(id);

        if(!user) return null;

        const userProfile = {
            id: user.id,
            username: user.username,
            displayName: user.displayName,
            email: user.email,
            avatarUrl: user.profileImageKey ? this.getPublicURL(user.profileImageKey) : null
        }

        return userProfile;

    }

    async findUserbyAuthId(authId: string): Promise<UserDbRecord | null> {
        const user =  await userRepo.findByAuthId(authId);
        return user;
    }

    async getUserByUsername(username: string): Promise<Partial<UserProfile> | null> {

        let user = await userRepo.findByUsername(username);

        if(!user) return null;

        const userProfile = {
            id: user.id,
            username: user.username,
            displayName: user.displayName,
            avatarUrl: user.profileImageKey ? this.getPublicURL(user.profileImageKey) : null
        }

        return userProfile;
    }   

    async updateUser(userId: string, updateData: Partial<UserUpdateInput>): Promise<Partial<UserDbRecord>> {

        const user = await userRepo.updateUser(userId, updateData);
        
        const userProfile = {
            username: user.username,
            displayName: user.displayName,
            email: user.email,
            imagePublicURL: user.profileImageKey ? this.getPublicURL(user.profileImageKey) : null,
            createdAt: user.createdAt
        }

        return userProfile;
    }

}

export const userService = new UserServiceImpl();