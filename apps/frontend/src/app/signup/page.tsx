"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../../modules/auth/auth.hooks"
import { ApiError } from "../../shared/utils/apiError"

export default function SignupPage() {
  const router = useRouter()
  const { register, user, loading: authLoading } = useAuth()

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]> | null>(null)

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
          await register({ username, email, password })
          router.push("/profile")
      } catch (err) {
          if (err instanceof ApiError) {
              const fe = (err.details as any)?.error?.fieldErrors
              if (fe) setFieldErrors(fe)
          } else {
              setError("Request failed")
          }
      } finally {
          setLoading(false)
      }
  }

  return (
    <main className="min-h-screen flex items-start justify-center px-4 pt-20">
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Create your account
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Join and start creating meetups
            </p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">
                Username
              </label>
              <input
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="
                  w-full rounded-lg border border-slate-200
                  px-3 py-2 text-sm
                  focus:outline-none focus:ring-2 focus:ring-sky-400
                "
              />
              {fieldErrors?.username && (
                    <p className="text-xs text-red-600">{fieldErrors.username[0]}</p>
               )}
            </div>

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
                {fieldErrors?.email && (
                    <p className="text-xs text-red-600">{fieldErrors.email[0]}</p>
                )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="
                  w-full rounded-lg border border-slate-200
                  px-3 py-2 text-sm
                  focus:outline-none focus:ring-2 focus:ring-sky-400
                "
              />
              {fieldErrors?.password && (
                    <p className="text-xs text-red-600">{fieldErrors.password[0]}</p>
                )}
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
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <a href="/login" className="font-medium text-sky-600 hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </main>
  )

}
