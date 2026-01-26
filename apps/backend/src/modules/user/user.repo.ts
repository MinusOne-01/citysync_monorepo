import { Prisma } from "@prisma/client/scripts/default-index.js";
import { prisma } from "../../shared/db";
import { NewUserRecord, UserRecord, UserUpdateRecord } from "./user.service";
import { deleteS3Object } from "../../shared/s3.service";

export interface UserRepository {
    createUser(data: NewUserRecord, tx: Prisma.TransactionClient): Promise<UserRecord>;
    findByUsername(username: string): Promise<UserRecord | null>;
    updateUser(userId: string, updateData: Partial<UserUpdateRecord>): Promise<UserRecord>;
}

class UserRepositoryImpl implements UserRepository {
    
    async createUser(data: NewUserRecord, tx: Prisma.TransactionClient): Promise<UserRecord> {
        
        const newUser = await tx.user.create({  
            data: {
                authAccountId: data.authAccountId,
                username: data.username,
                email: data.email
            }
        });
        return newUser;
    }

    async findByUsername(username: string): Promise<UserRecord | null> {
        
        const record = await prisma.user.findUnique({
            where: { username },
        });

        if (!record) {
            return null;
        }
        return record;
    }

    async updateUser(userId: string, updateData: UserUpdateRecord): Promise<UserRecord> {

        let oldKey: string | null | undefined = null;

        if(updateData.profileImageKey !== null){
            const user = await prisma.user.findUnique({
                where: { id: userId }
            });

            oldKey = user?.profileImageKey;
        }

        const updatedRecord = await prisma.user.update({
            where: { id: userId },
            data: updateData,
        });

        if (oldKey && oldKey !== updatedRecord.profileImageKey) {
            try{
                await deleteS3Object(oldKey);
            } catch (err) {
                // log the error but don't stop the request 
                console.error("Failed to delete orphaned S3 object:", oldKey, err);
            }
        }    

        return updatedRecord;
    }
}

export const userRepo = new UserRepositoryImpl();