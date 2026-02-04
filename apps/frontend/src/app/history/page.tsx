"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../modules/auth/auth.hooks";
import { useParticipationActions } from "../../modules/participate/participate.hooks";
import type { ParticipantHistoryItem } from "../../modules/participate/participate.types";

export default function HistoryPage() {
  const { status } = useAuth();
  const { getParticipantHistory } = useParticipationActions();

  const [history, setHistory] = useState<ParticipantHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status !== "authenticated") return;

    setLoading(true);
    getParticipantHistory()
      .then(setHistory)
      .finally(() => setLoading(false));
  }, [status, getParticipantHistory]);

  if (status === "loading" || loading) {
    return (
      <main style={{ maxWidth: 800, margin: "48px auto", padding: "0 16px" }}>
        <p>Loading history...</p>
      </main>
    );
  }

  if (status !== "authenticated") {
    return (
      <main style={{ maxWidth: 800, margin: "48px auto", padding: "0 16px" }}>
        <p>Please log in to view your history.</p>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 800, margin: "48px auto", padding: "0 16px" }}>
      <h1 style={{ fontSize: 26, fontWeight: 700 }}>Your Meetup History</h1>

      {history.length === 0 ? (
        <p style={{ marginTop: 16 }}>No history yet.</p>
      ) : (
        <div
          style={{
            marginTop: 16,
            maxHeight: 520,
            overflowY: "auto",
            border: "1px solid #eee",
            borderRadius: 8,
            padding: 12,
          }}
        >
          {history.map((h) => (
            <div
              key={`${h.meetupId}-${h.joinedAt}`}
              style={{
                display: "flex",
                gap: 12,
                padding: "12px 0",
                borderBottom: "1px solid #f0f0f0",
              }}
            >
              <img
                src={h.meetupImageUrl}
                alt={h.placeName ?? "Meetup"}
                style={{ width: 90, height: 70, objectFit: "cover", borderRadius: 6 }}
              />

              <div>
                <div style={{ fontWeight: 600 }}>
                  {h.placeName ?? "Meetup"} · {h.city ?? "Unknown city"}
                </div>
                <div style={{ color: "#666", fontSize: 14 }}>
                  {new Date(h.meetupDate).toLocaleString()}
                </div>
                <div style={{ color: "#666", fontSize: 14 }}>
                  Role: {h.role}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
