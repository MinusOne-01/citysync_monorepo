"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../../modules/auth/auth.hooks"
import { ApiError } from "../../shared/utils/apiError"
import { PageContainer } from "@/src/components/layout/PageContainer"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user, loading: authLoading } = useAuth()

  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/profile")
    }
  }, [authLoading, user, router])


  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await login({ email, password })
      router.push("/profile")
    } catch (err: any) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError("Login failed")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageContainer>
     <main className="min-h-screen flex items-start justify-center px-4 pt-60">
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Welcome back
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Sign in to join your next meetup
            </p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="
                  w-full rounded-lg border border-slate-200
                  px-3 py-2 text-sm
                  focus:outline-none focus:ring-2 focus:ring-sky-400
                "
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="
                  w-full rounded-lg border border-slate-200
                  px-3 py-2 text-sm
                  focus:outline-none focus:ring-2 focus:ring-sky-400
                "
              />
            </div>

            {error && (
              <p className="text-sm text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="
                w-full rounded-lg bg-sky-500 px-4 py-2.5
                text-sm font-medium text-white
                hover:bg-sky-600
                transition-colors
                disabled:opacity-60 disabled:cursor-not-allowed
              "
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>

        {/* Optional footer */}
        <p className="mt-4 text-center text-sm text-slate-500">
          New here?{" "}
          <a href="/signup" className="font-medium text-sky-600 hover:underline">
            Create an account
          </a>
        </p>
      </div>
    </main>
    </PageContainer>
);

}
