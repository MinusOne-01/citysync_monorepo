"use client"

import { useEffect, useRef, useState } from "react"
import { useNotifications } from "../noti.hooks"
import { useAuth } from "../../auth/auth.hooks"

export default function NotificationsOverlay() {

  const { user, loading: authLoading } = useAuth()
  if (authLoading || !user) return null

  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)
  const { items, loading, error, nextCursor, loadMore, markRead, markAllRead } =
    useNotifications(20)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (!ref.current) return
      if (!ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener("mousedown", onClickOutside)
    return () => document.removeEventListener("mousedown", onClickOutside)
  }, [open])

  const unreadCount = items.filter((n) => !n.isRead).length

  return (
    <div ref={ref} style={{ position: "fixed", bottom: 24, right: 24, zIndex: 50 }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          position: "relative",
          width: 48,
          height: 48,
          borderRadius: "50%",
          border: "1px solid #ddd",
          background: "#fff",
          boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
          cursor: "pointer"
        }}
        aria-label="Notifications"
      >
        🔔
        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: -4,
              right: -4,
              background: "crimson",
              color: "#fff",
              borderRadius: 999,
              padding: "2px 6px",
              fontSize: 12
            }}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            bottom: 60,
            width: 320,
            maxHeight: 360,
            overflow: "auto",
            border: "1px solid #e6e6e6",
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 10px 24px rgba(0,0,0,0.12)",
            padding: 12
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <strong>Notifications</strong>
            <button type="button" onClick={markAllRead} style={{ fontSize: 12 }}>
              Mark all read
            </button>
          </div>

          {loading && <p style={{ marginTop: 12 }}>Loading...</p>}
          {!!error && <p style={{ marginTop: 12, color: "crimson" }}>Failed to load.</p>}

          {!loading && items.length === 0 && (
            <p style={{ marginTop: 12, color: "#666" }}>No notifications yet.</p>
          )}

          <ul style={{ listStyle: "none", padding: 0, margin: "12px 0 0 0" }}>
            {items.map((n) => (
              <li
                key={n.notiId}
                style={{
                  padding: "8px 6px",
                  borderBottom: "1px solid #f0f0f0",
                  opacity: n.isRead ? 0.6 : 1
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 600 }}>{n.type}</div>
                <div style={{ fontSize: 12, color: "#666" }}>
                  {new Date(n.createdAt).toLocaleString()}
                </div>
                <button
                  type="button"
                  onClick={() => markRead(n.notiId)}
                  style={{ fontSize: 12, marginTop: 6 }}
                >
                  Mark read
                </button>
              </li>
            ))}
          </ul>

          {nextCursor && (
            <button
              type="button"
              onClick={loadMore}
              style={{ width: "100%", marginTop: 8 }}
            >
              Load more
            </button>
          )}
        </div>
      )}
    </div>
  )
}
