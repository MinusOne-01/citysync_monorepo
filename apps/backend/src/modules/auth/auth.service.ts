import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { authRepo } from "./auth.repo"
import { userService } from "../user/user.service"
import { prisma } from "../../shared/configs/db"
import { Prisma } from "@prisma/client"
import { env } from "../../shared/configs/env"
import { AppError } from "../../shared/configs/errors"



export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthService {
  register(input: {
    email: string
    password: string
    username: string
  }): Promise<AuthTokens>

  login(input: {
    email: string
    password: string
  }): Promise<AuthTokens>

  refresh(refreshToken: string): Promise<AuthTokens>
}



export const authService = {

  async register(input: {
    email: string
    password: string
    username: string
  }) {
    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // 1) Ensure email uniqueness
      const existing = await tx.authAccount.findUnique({
        where: { email: input.email }
      })

      if (existing) {
        throw new AppError("Email already registered")
      }

      // 2) Hash password
      const passwordHash = await bcrypt.hash(input.password, 12)

      // 3) Create auth account
      const account = await tx.authAccount.create({
        data: {
          email: input.email,
          passwordHash
        }
      })

      // 4) Call user module to create new account ( can fail due to username uniqueness )
      const user = await userService.createUser({
        authAccountId: account.id,
        username: input.username,
        email: input.email
      }, tx);

      // 5) Issue tokens
      const accessToken = jwt.sign(
        { sub: user.id },
        env.JWT_ACCESS_SECRET,
        { expiresIn: env.ACCESS_TOKEN_TTL as jwt.SignOptions["expiresIn"] }
      )

      const refreshToken = jwt.sign(
        { sub: user.id },
        env.JWT_REFRESH_SECRET,
        { expiresIn: `${env.REFRESH_TOKEN_TTL_DAYS}d` }
      )

      const refreshTokenHash = await bcrypt.hash(refreshToken, 12)
      const expiresAt = new Date(
        Date.now() + env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000
      )

      // 6) Store refresh token
      await tx.authRefreshToken.create({
        data: {
          accountId: account.id,
          tokenHash: refreshTokenHash,
          expiresAt
        }
      })

      return {
        accessToken,
        refreshToken
      }
    }
  )},

  async login(input: {
    email: string
    password: string
  }) {
    // Find user account & verify password
    const account = await authRepo.findAccountByEmail(input.email)
    if (!account) {
      throw new AppError("Invalid email or password")
    }

    const passwordValid = await bcrypt.compare(
      input.password,
      account.passwordHash
    )

    if (!passwordValid) {
      throw new AppError("Invalid email or password")
    }

    // Load user (identity)
    const user = await userService.findUserbyAuthId(account.id);

    if (!user) {
      // This should never happen if register is correct
      throw new AppError("User not found for account")
    }

    // Issue access token
    const accessToken = jwt.sign(
      { sub: user.id },
      env.JWT_ACCESS_SECRET,
      { expiresIn: env.ACCESS_TOKEN_TTL as jwt.SignOptions["expiresIn"] }
    )

    // Issue refresh token
    const refreshToken = jwt.sign(
      { sub: user.id },
      env.JWT_REFRESH_SECRET,
      { expiresIn: `${env.REFRESH_TOKEN_TTL_DAYS}d` }
    )

    // Store hashed refresh token
    const refreshTokenHash = await bcrypt.hash(refreshToken, 12)

    const expiresAt = new Date(
      Date.now() + env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000
    )

    await authRepo.saveRefreshToken({
      accountId: account.id,
      tokenHash: refreshTokenHash,
      expiresAt
    })

    return {
      accessToken,
      refreshToken
    }
  },

  async refresh(refreshToken: string) {
    // Verify refresh token signature
    let payload: any
    try {
      payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET)
    } catch {
      throw new AppError("Invalid refresh token")
    }

    const userId = payload.sub as string

    // Find matching refresh token (hashed)
    const tokens = await prisma.authRefreshToken.findMany({
      where: {
        revokedAt: null,
        expiresAt: { gt: new Date() }
      }
    })

    const matchingToken = await Promise.all(
      tokens.map(async (token: any) => {
        const match = await bcrypt.compare(refreshToken, token.tokenHash)
        return match ? token : null
      })
    ).then((res) => res.find(Boolean))

    if (!matchingToken) {
      throw new AppError("Refresh token not found or revoked")
    }

    // Revoke old token
    await prisma.authRefreshToken.update({
      where: { id: matchingToken.id },
      data: { revokedAt: new Date() }
    })

    // Issue new tokens
    const newAccessToken = jwt.sign(
      { sub: userId },
      env.JWT_ACCESS_SECRET,
      { expiresIn: env.ACCESS_TOKEN_TTL as jwt.SignOptions["expiresIn"] }
    )

    const newRefreshToken = jwt.sign(
      { sub: userId },
      env.JWT_REFRESH_SECRET,
      { expiresIn: `${env.REFRESH_TOKEN_TTL_DAYS}d` }
    )

    const newRefreshTokenHash = await bcrypt.hash(newRefreshToken, 12)

    const expiresAt = new Date(
      Date.now() + env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000
    )

    await prisma.authRefreshToken.create({
      data: {
        accountId: matchingToken.accountId,
        tokenHash: newRefreshTokenHash,
        expiresAt
      }
    })

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    }
  },

  async logout(refreshToken: string): Promise<void> {
   
    if (!refreshToken) return;

    const tokens = await prisma.authRefreshToken.findMany({
      where: { revokedAt: null }
    })

    const matchingToken = await Promise.all(
      tokens.map(async (token: any) => {
        const match = await bcrypt.compare(refreshToken, token.tokenHash)
        return match ? token : null
      })
    ).then((res) => res.find(Boolean))

    if (!matchingToken) {
      return
    }

    await prisma.authRefreshToken.update({
      where: { id: matchingToken.id },
      data: { revokedAt: new Date() }
    })

}


}


