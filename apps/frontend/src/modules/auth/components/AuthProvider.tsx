"use client"

import React, { createContext, useContext, useEffect, useMemo, useState } from "react"
import type { AuthState, AuthUser } from "../auth.types"
import { authApi } from "../auth.api"

type AuthContextValue = AuthState & {
    login: (input: { email: string; password: string }) => Promise<void>
    register: (input: { email: string; password: string; username: string }) => Promise<void>
    logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {

    const [user, setUser] = useState<AuthUser | null>(null)
    const [loading, setLoading] = useState(true)
    const status = loading
        ? "loading"
        : user
            ? "authenticated"
            : "unauthenticated";


    useEffect(() => {
        let mounted = true

        async function bootstrap() {
            try {
                const me = await authApi.me()
                if (mounted) setUser(me.user ?? null)
            } catch {
                if (mounted) setUser(null)
            } finally {
                if (mounted) setLoading(false)
            }
        }

        bootstrap()
        return () => { mounted = false }
    }, [])

    const value = useMemo<AuthContextValue>(() => ({
        user,
        loading,
        status,
        async login(input) {
            await authApi.login(input);
            const me = await authApi.me();
            setUser(me.user ?? null);
        },
        async register(input) {
            await authApi.register(input);
            const me = await authApi.me();
            setUser(me.user ?? null);
        },
        async logout() {
            await authApi.logout();
            setUser(null);
        }
    }), [user, loading, status]);


    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>

}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error("useAuth must be used within AuthProvider")
    return ctx
}
