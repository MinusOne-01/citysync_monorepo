"use client";

import { useEffect, useRef, useState } from "react";
import { useNotifications } from "../noti.hooks";
import { useAuth } from "../../auth/auth.hooks";
import { useRouter } from "next/navigation";


export default function NotificationsOverlay() {

  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [open, setOpen] = useState(false);
  const [showLoginHint, setShowLoginHint] = useState(false);

  const ref = useRef<HTMLDivElement | null>(null);

  // Hook must be called unconditionally
  const {
    items,
    loading,
    error,
    nextCursor,
    loadMore,
    markRead,
    markAllRead,
  } = useNotifications(20);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  const unreadCount = items.filter((n) => !n.isRead).length;

  function handleToggle() {
    if (authLoading) return;

    if (!user) {
      setShowLoginHint(true);
      setTimeout(() => setShowLoginHint(false), 2000);
      return;
    }

    setOpen((v) => !v);
  }

  return (
    <div ref={ref} style={{ position: "fixed", bottom: 24, right: 24, zIndex: 50 }}>
      <button
        type="button"
        onClick={handleToggle}
        style={{
          position: "relative",
          width: 48,
          height: 48,
          borderRadius: "50%",
          border: "1px solid #ddd",
          background: "#fff",
          boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
          cursor: "pointer",
          display: "grid",
          placeItems: "center"

        }}
        aria-label="Notifications"
        aria-expanded={open}
        aria-controls="notifications-panel"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 7 3 7H3s3 0 3-7" />
          <path d="M10 19a2 2 0 0 0 4 0" />
        </svg>
        {unreadCount > 0 && user && (
          <span
            style={{
              position: "absolute",
              top: -4,
              right: -4,
              background: "crimson",
              color: "#fff",
              borderRadius: 999,
              padding: "2px 6px",
              fontSize: 12,
            }}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {showLoginHint && (
        <div
          style={{
            position: "absolute",
            right: 0,
            bottom: 60,
            background: "#111",
            color: "#fff",
            padding: "8px 10px",
            borderRadius: 8,
            fontSize: 12,
            boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
          }}
        >
          Login to see notifications
        </div>
      )}

      {user && open && (
        <div
          id="notifications-panel"
          role="dialog"
          aria-label="Notifications"
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
            padding: 12,
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
                onClick={() => router.push(`/meetup/${n.data.meetupId}`)}
                style={{
                  padding: "8px 6px",
                  borderBottom: "1px solid #f0f0f0",
                  opacity: n.isRead ? 0.6 : 1,
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 600 }}>{n.type}</div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>
                   {n.data.participantName}
                </div>
                <div style={{ fontSize: 12, color: "#666" }}>
                  {new Date(n.createdAt).toLocaleString()}
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    markRead(n.notiId)
                  }}
                  style={{ fontSize: 12, marginTop: 6 }}
                  disabled={n.isRead}
                >
                  Mark read
                </button>
              </li>
            ))}
          </ul>

          {nextCursor && (
            <button type="button" onClick={loadMore} style={{ width: "100%", marginTop: 8 }}>
              Load more
            </button>
          )}
        </div>
      )}
    </div>
  );
}
