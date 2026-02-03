import { Prisma } from "@prisma/client"
import { prisma } from "../../shared/configs/db";
import { NewUserInput, UserDbRecord, UserUpdateInput } from "./user.type";
import { deleteS3Object } from "../../shared/configs/s3.service";

export interface UserRepository {
    createUser(data: NewUserInput, tx: Prisma.TransactionClient): Promise<UserDbRecord>;
    findById(id: string): Promise<UserDbRecord | null>;
    findByUsername(username: string): Promise<UserDbRecord | null>;
    updateUser(userId: string, updateData: Partial<UserUpdateInput>): Promise<UserDbRecord>;
}

class UserRepositoryImpl implements UserRepository {
    
    async createUser(data: NewUserInput, tx: Prisma.TransactionClient): Promise<UserDbRecord> {
        
        const newUser = await tx.user.create({  
            data: {
                authAccountId: data.authAccountId,
                username: data.username,
                email: data.email
            }
        });
        return newUser;
    }

    async findById(id: string): Promise<UserDbRecord | null> {
        const record = await prisma.user.findUnique({
            where: { id },
        });
        return record;
    }

    async findByAuthId(authId: string): Promise<UserDbRecord | null> {
        const record = await prisma.user.findUnique({
            where: { authAccountId: authId },
        });
        return record;
    }

    async findByUsername(username: string): Promise<UserDbRecord | null> {
        
        const record = await prisma.user.findUnique({
            where: { username },
        });

        if (!record) {
            return null;
        }
        return record;
    }

    async updateUser(userId: string, updateData: UserUpdateInput): Promise<UserDbRecord> {

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
                console.error("Failed to delete orphaned S3 object:", oldKey, err);
            }
        }    

        return updatedRecord;
    }
}

export const userRepo = new UserRepositoryImpl();