"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useUserMe } from "../../modules/user/user.hook"
import { useAuth } from "../../modules/auth/auth.hooks"
import { userApi } from "../../modules/user/user.api"
import { uploadUserProfileImage } from "../../modules/user/user.upload"
import { ApiError } from "../../shared/utils/apiError"

export default function ProfilePage() {
  const router = useRouter()
  const { logout } = useAuth()
  const { user, loading, error, refresh } = useUserMe()
  const [isEditing, setIsEditing] = useState(false)

  const [displayName, setDisplayName] = useState("")
  const [email, setEmail] = useState("")
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]> | null>(null)

  const [loggingOut, setLoggingOut] = useState(false)
  const [logoutError, setLogoutError] = useState<string | null>(null)


  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login")
      return
    }
    if (user){
      setDisplayName(user.displayName ?? "")
      setEmail(user.email ?? "")
    }
  }, [loading, user, router])
   

  async function onLogout() {
    setLogoutError(null)
    setLoggingOut(true)
    try {
      await logout()
      router.replace("/login")
    } catch (err) {
      setLogoutError("Logout failed, please try again.")
    } finally {
      setLoggingOut(false)
    }
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault()
    if (!isEditing) return
    setFieldErrors(null)
    setFormError(null)
    setSaving(true)

    try {
      const payload: { displayName?: string; email?: string } = {}
      if (displayName.trim()) payload.displayName = displayName.trim()
      if (email.trim()) payload.email = email.trim()

      if (!payload.displayName && !payload.email) {
        setFormError("No changes to save")
        setSaving(false)
        return
      }
      await userApi.update(payload)
      await refresh()
      setIsEditing(false)
      setSaveMessage("Changes saved")
      setTimeout(() => setSaveMessage(null), 2500)

    } catch (err) {
      if (err instanceof ApiError) {
        const fe = (err.details as any)?.error?.fieldErrors
        if (fe) setFieldErrors(fe)
      } else {
        setFormError("Failed to update profile")
      }
    } finally {
      setSaving(false)
    }
  }

  async function onAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setFormError(null)
    setUploading(true)

    try {
      await uploadUserProfileImage(file)
      await refresh()
    } catch (err) {
      if (err instanceof ApiError) setFormError(err.message)
      else setFormError("Failed to upload avatar")
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <p className="text-sm text-slate-500">Loading profile...</p>
      </main>
    )
  }

  if (error || !user) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <p className="text-sm text-red-600">Failed to load profile</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen px-4 pt-10 pb-20">
      <div className="mx-auto w-full max-w-xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Your profile
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your personal details
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt="avatar"
                className="h-16 w-16 rounded-full border border-slate-200 object-cover"
              />
            ) : (
              <div className="h-16 w-16 rounded-full border border-slate-200 bg-slate-50" />
            )}

            <div>
              <div className="text-sm font-medium text-slate-900">
                {user.username}
              </div>
              <label className="mt-1 inline-block text-xs font-medium text-sky-600 cursor-pointer hover:underline">
                {uploading ? "Uploading..." : "Change avatar"}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={onAvatarChange}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={(e) => {
              if (!isEditing) {
                e.preventDefault()
                return
              }
              onSave(e)
            }}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">
                Display name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => { setDisplayName(e.target.value); setSaveMessage(null) }}
                disabled={!isEditing}
                  className="
                    w-full rounded-lg border border-slate-200
                    px-3 py-2 text-sm
                    focus:outline-none focus:ring-2 focus:ring-sky-400
                    disabled:bg-slate-50 disabled:text-slate-400
                  "
              />
              {fieldErrors?.displayName && (
                <p className="text-xs text-red-600">{fieldErrors.displayName[0]}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                type="email"
                value={email}
                disabled
                  className="
                    w-full rounded-lg border border-slate-200
                    px-3 py-2 text-sm
                    focus:outline-none focus:ring-2 focus:ring-sky-400
                    disabled:bg-slate-50 disabled:text-slate-400
                  "
              />
            </div>

            {formError && (
              <p className="text-sm text-red-600">{formError}</p>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">

              {!isEditing ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    setIsEditing(true)
                    setFormError(null)
                    setSaveMessage(null)
                  }}
                  className="
                    w-full rounded-lg bg-sky-500 px-4 py-2.5
                    text-sm font-medium text-white
                    hover:bg-sky-600 transition-colors
                  "
                >
                  Edit profile
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={saving}
                  className="
                    w-full rounded-lg bg-sky-500 px-4 py-2.5
                    text-sm font-medium text-white
                    hover:bg-sky-600 transition-colors
                    disabled:opacity-60 disabled:cursor-not-allowed
                  "
                >
                  {saving ? "Saving..." : "Save changes"}
                </button>
              )}

              <button
                type="button"
                onClick={onLogout}
                disabled={loggingOut}
                className="
                  w-full rounded-lg border border-slate-200 px-4 py-2.5
                  text-sm font-medium text-slate-700
                  hover:bg-slate-50
                  transition-colors
                  disabled:opacity-60 disabled:cursor-not-allowed
                "
              >
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
              
            </div>
          </form>
        </div>
        {saveMessage && (
          <p className="text-center text-sm text-emerald-600">
            {saveMessage}
          </p>
        )}
        {logoutError && <p className="text-sm text-red-600">{logoutError}</p>}

      </div>
    </main>
  )
}

