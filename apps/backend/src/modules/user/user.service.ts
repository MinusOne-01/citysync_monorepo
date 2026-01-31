import { Prisma } from "@prisma/client/scripts/default-index.js";
import { userRepo } from "./user.repo";
import { AppError } from "../../shared/configs/errors";
import { getPresignedUploadUrl } from "../../shared/configs/s3.service";
import { env } from "../../shared/configs/env";

const BUCKET = env.AWS_S3_BUCKET!;
const REGION = env.AWS_REGION!;


export type NewUserRecord = {
    authAccountId: string;
    username: string;
    email: string;
}

export type UserRecord = {
    id: string;
    authAccountId: string;
    username: string;
    email: string;
    displayName: string | null;
    createdAt: Date;
    profileImageKey?: string | null;
    imagePublicURL?: string | null;
}

export type UserUpdateRecord = {
    displayName?: string;
    email?: string
    profileImageKey?: string;
}

export type SignedUrlResponse = {
  signedUrl: string;
  key: string;
  publicUrl: string;
}


export interface UserService {
    createUser(data: NewUserRecord, tx: Prisma.TransactionClient): Promise<UserRecord>;
    findUserbyId(id: string): Promise<UserRecord | null>;
    findUserbyAuthId(authId: string): Promise<UserRecord | null>;
    getUserByUsername(username: string): Promise<Partial<UserRecord> | null>;
    updateUser(userId: string, updateData: Partial<UserUpdateRecord>): Promise<Partial<UserRecord>>;
    getProfileUploadUrl(userId: string, fileType: string): Promise<SignedUrlResponse>;
}

class UserServiceImpl implements UserService {
    
    private getPublicURL(key: string): string {
        const url = `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`;
        return url;
    }

    async createUser(data: NewUserRecord, tx: Prisma.TransactionClient): Promise<UserRecord> {
        try{
            const newUser = await userRepo.createUser(data, tx);
            return newUser;

        }
        catch(err){
            throw new AppError("Username already taken");
        }

    }

    async findUserbyId(id: string): Promise<UserRecord | null> {
        const user =  await userRepo.findById(id);
        return user;
    }

    async findUserbyAuthId(authId: string): Promise<UserRecord | null> {
        const user =  await userRepo.findByAuthId(authId);
        return user;
    }

    async getUserByUsername(username: string): Promise<Partial<UserRecord> | null> {

        let user = await userRepo.findByUsername(username);

        if(!user) return null;

        const userProfile = {
            username: user.username,
            displayName: user.displayName,
            imagePublicURL: user.profileImageKey ? this.getPublicURL(user.profileImageKey) : null,
            createdAt: user.createdAt
        }

        return userProfile;
    }   

    async updateUser(userId: string, updateData: Partial<UserUpdateRecord>): Promise<Partial<UserRecord>> {

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

    async getProfileUploadUrl(userId: string, fileType: string): Promise<SignedUrlResponse> {
        
        if(!fileType.startsWith("image/")){
            throw new AppError("Invalid file type. Only image files are allowed.");
        }

        const uploadData = await getPresignedUploadUrl(userId, 'profiles', fileType);
        return uploadData;
    }

}

export const userService = new UserServiceImpl();