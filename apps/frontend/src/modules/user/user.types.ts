export type UserProfile = {
  id: string
  username: string
  email: string
  displayName: string | null
  avatarUrl: string | null
}

export type UserUpdateInput = {
  displayName?: string
  email?: string
}

export type UserUpdateResult = {
  user: {
    username: string
    displayName: string | null
    email: string
    imagePublicURL: string | null
    createdAt: string
  }
}

export type UserMeResult = {
  user: UserProfile
}

export type UserUploadUrlResult = {
  uploadData: {
    signedUrl: string
    key: string
    publicUrl: string
  }
}

export type UserProfileUploadCompleteInput = {
  profileImageKey: string
}

