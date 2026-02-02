import { useAuthContext } from "./components/AuthProvider";

export function useAuth() {
  const { state } = useAuthContext();
  return state;
}

export function useRequireAuth() {
  const { state } = useAuthContext();

  if (state.status === "loading" || state.status === "idle") {
    return { loading: true };
  }

  if (state.status === "unauthenticated") {
    throw new Error("Unauthorized");
  }

  return { user: state.user };
}
