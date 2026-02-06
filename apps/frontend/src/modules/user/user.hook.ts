import { useEffect, useState } from "react";
import { userApi } from "./user.api";
import type { UserProfile } from "./user.types";
import { useAuth } from "../auth/auth.hooks";

export function useUserMe() {
  const { status } = useAuth();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(status === "loading");
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      if (status !== "authenticated") {
        if (mounted) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      try {
        const res = await userApi.me();
        if (mounted) setUser(res.user);
      } catch (err) {
        if (mounted) setError(err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    setLoading(status === "loading");
    setError(null);
    load();

    return () => { mounted = false };
  }, [status]);

  return {
    user,
    loading,
    error,
    refresh: async () => {
      if (status !== "authenticated") return;
      setLoading(true);
      setError(null);
      try {
        const res = await userApi.me();
        setUser(res.user);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
  };
}
