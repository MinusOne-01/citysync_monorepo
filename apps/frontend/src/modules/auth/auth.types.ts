import type { UserDTO } from "@shared/types/user";

export type AuthState =
  | { status: "idle" }               // not checked yet
  | { status: "loading" }            // checking / refreshing
  | { status: "authenticated"; user: UserDTO }
  | { status: "unauthenticated" };
