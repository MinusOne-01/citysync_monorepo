export type AuthUser = {
  id: string
  email: string
  username: string
}

export type AuthState = {
  user: AuthUser | null
  loading: boolean
}
