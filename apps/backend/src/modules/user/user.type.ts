import { Prisma } from "@prisma/client";

////////////////////////
//Service types
////////////////////////

export type UserProfile = {
  id: string
  username: string
  email: string
  displayName: string | null
  avatarUrl: string | null
}

export type NewUserInput = {
    authAccountId: string;
    username: string;
    email: string;
}

export type UserUpdateInput = {
    displayName?: string;
    email?: string
    profileImageKey?: string;
}

export type SignedUrlResponse = {
  signedUrl: string;
  key: string;
  publicUrl: string;
}




////////////////////////
//Repo types
////////////////////////

export type UserDbRecord = Prisma.UserGetPayload<{}>