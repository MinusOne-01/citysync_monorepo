import { AuthState } from "./auth.types";

export interface AuthStore {
  state: AuthState;
  setState: (state: AuthState) => void;
}
