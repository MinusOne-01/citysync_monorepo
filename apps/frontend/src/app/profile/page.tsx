"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUserMe } from "../../modules/user/user.hook"
import { useAuth } from "../../modules/auth/auth.hooks"


export default function ProfilePage() {
  const router = useRouter()
  const { logout } = useAuth()
  const { user, loading, error } = useUserMe()

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login")
    }
  }, [loading, user, router])

  if (loading) {
    return (
      <main style={{ maxWidth: 600, margin: "48px auto", padding: "0 16px" }}>
        <p>Loading profile...</p>
      </main>
    )
  }

  if (error) {
    return (
      <main style={{ maxWidth: 600, margin: "48px auto", padding: "0 16px" }}>
        <p>Failed to load profile.</p>
      </main>
    )
  }

  if (!user) {
    return null
  }

  return (
    <main style={{ maxWidth: 600, margin: "48px auto", padding: "0 16px" }}>
      <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 16 }}>Your Profile</h1>

      <div style={{ display: "grid", gap: 8 }}>
        <div><strong>ID:</strong> {user.id}</div>
        <div><strong>Username:</strong> {user.username}</div>
        <div><strong>Display name:</strong> {user.displayName ?? "—"}</div>
        <div>
          <strong>Avatar:</strong>{" "}
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt="avatar"
              style={{ width: 64, height: 64, borderRadius: "50%" }}
            />
          ) : (
            "—"
          )}
        </div>
      </div>
      <button
        onClick={async () => {
          await logout()
          router.replace("/login")
        }}
        style={{ padding: "8px 12px", marginTop: 16 }}
      >
        Logout
      </button>
    </main>
  )
}
