import { prisma } from "../../shared/db"

export interface AuthAccountRecord {
  id: string
  email: string
  passwordHash: string
  createdAt: Date
}

export interface AuthRefreshTokenRecord {
  id: string
  accountId: string
  tokenHash: string
  expiresAt: Date
  revokedAt?: Date
  createdAt: Date
}

export interface AuthRepository {
  findAccountByEmail(email: string): Promise<AuthAccountRecord | null>
  createAccount(input: {
    email: string
    passwordHash: string
  }): Promise<AuthAccountRecord>

  saveRefreshToken(input: {
    accountId: string
    tokenHash: string
    expiresAt: Date
  }): Promise<void>

  findRefreshToken(tokenHash: string): Promise<AuthRefreshTokenRecord | null>
  revokeRefreshToken(id: string): Promise<void>
}

/**
 * ...
 * ...
 */
export const authRepo: AuthRepository = {

  async findAccountByEmail( email: string ) {
    return prisma.authAccount.findUnique({
      where: { email }
    })
  },

  async createAccount(input: {
    email: string
    passwordHash: string
  }) {
    return prisma.authAccount.create({
      data: {
        email: input.email,
        passwordHash: input.passwordHash
      }
    })
  },

  async saveRefreshToken(input: {
    accountId: string
    tokenHash: string
    expiresAt: Date
  }) {
    await prisma.authRefreshToken.create({
      data: {
        accountId: input.accountId,
        tokenHash: input.tokenHash,
        expiresAt: input.expiresAt
      }
    })
  },

  async findRefreshToken() {
    throw new Error("Not implemented")
  },

  async revokeRefreshToken() {
    throw new Error("Not implemented")
  }
}
