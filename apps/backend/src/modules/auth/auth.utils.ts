export const ACCESS_COOKIE = "access_token"
export const REFRESH_COOKIE = "refresh_token"

export function setAuthCookies(res: any, tokens: { accessToken: string; refreshToken: string }) {
  res.cookie(ACCESS_COOKIE, tokens.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 15 * 60 * 1000, // 15 min
  })

  res.cookie(REFRESH_COOKIE, tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  })
}

export function clearAuthCookies(res: any) {
  res.clearCookie(ACCESS_COOKIE)
  res.clearCookie(REFRESH_COOKIE)
}