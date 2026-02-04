export type AuthUser = {
  id: string;
  email: string;
  username: string;
};

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export type AuthState = {
  user: AuthUser | null;
  loading: boolean;
  status: AuthStatus;
};

