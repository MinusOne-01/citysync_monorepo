"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { login as loginApi, fetchMe, logout as logoutApi } from "../auth.api";
import type { AuthState } from "../auth.types";

const AuthContext = createContext<{
  state: AuthState;
  setState: React.Dispatch<React.SetStateAction<AuthState>>;
  logout: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
} | null>(null);


export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ status: "idle" });

  function clearAuth() {
    setState({ status: "unauthenticated" });
  }

  async function login(email: string, password: string) {
    setState({ status: "loading" });

    await loginApi(email, password);

    const user = await fetchMe();
    setState({ status: "authenticated", user });
  }

  async function logout() {
    try {
      await logoutApi();
    } finally {
      // even if backend fails, frontend must reset
      clearAuth();
    }
  }

  useEffect(() => {
    async function init() {
      setState({ status: "loading" });
      try {
        const user = await fetchMe();
        console.log("UserInfo-> ", user)
        setState({ status: "authenticated", user });
      } catch {
        setState({ status: "unauthenticated" });
      }
    }
    init();
  }, []);

  return (
    <AuthContext.Provider value={{ state, setState, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("AuthProvider missing");
  return ctx;
}
