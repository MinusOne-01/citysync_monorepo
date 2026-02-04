"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "../../../../modules/auth/auth.hooks";
import { useMeetup } from "../../../../modules/meetups/meetup.hook";
import {
  getMeetupParticipants,
  changeParticipantStatus,
} from "../../../../modules/participate/participate.api";
import type { Participant, ParticipationStatus } from "../../../../modules/participate/participate.types";

type Filter = "ALL" | "REQUESTED" | "CONFIRMED" | "CANCELLED";

export default function ParticipantsPage() {
  const params = useParams();
  const router = useRouter();
  const meetupId = typeof params.meetupId === "string" ? params.meetupId : null;

  const { status, user } = useAuth();
  const { meetup, loading: meetupLoading } = useMeetup(meetupId);

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("ALL");

  const isOrganizer =
    status === "authenticated" && user && meetup && user.id === meetup.organizerId;

  useEffect(() => {
    if (!meetupId) return;
    if (!meetup) return;

    if (!isOrganizer) {
      router.replace(`/meetup/${meetupId}`);
      return;
    }

    setLoading(true);
    getMeetupParticipants(meetupId)
      .then(setParticipants)
      .finally(() => setLoading(false));
  }, [meetupId, meetup, isOrganizer, router]);

  async function handleStatusChange(participantId: string, newStatus: ParticipationStatus) {
    if (!meetupId) return;
    await changeParticipantStatus(meetupId, participantId, newStatus);
    const fresh = await getMeetupParticipants(meetupId);
    setParticipants(fresh);
  }

  const filtered = useMemo(() => {
    if (filter === "ALL") return participants;
    return participants.filter((p) => p.status === filter);
  }, [participants, filter]);

  if (meetupLoading || loading) {
    return (
      <main style={{ maxWidth: 700, margin: "48px auto", padding: "0 16px" }}>
        <p>Loading participants...</p>
      </main>
    );
  }

  if (!isOrganizer) {
    return (
      <main style={{ maxWidth: 700, margin: "48px auto", padding: "0 16px" }}>
        <p>Not authorized.</p>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 700, margin: "48px auto", padding: "0 16px" }}>
      <h1 style={{ fontSize: 26, fontWeight: 700 }}>Participants</h1>

      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
        {(["ALL", "REQUESTED", "CONFIRMED", "CANCELLED"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              fontWeight: filter === f ? 700 : 400,
              border: filter === f ? "2px solid #111" : "1px solid #ccc",
            }}
          >
            {f === "ALL" ? "All" : f.toLowerCase()}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p style={{ marginTop: 16 }}>No participants.</p>
      ) : (
        <ul style={{ marginTop: 16, listStyle: "none", padding: 0 }}>
          {filtered.map((p) => (
            <li
              key={p.userId}
              style={{
                padding: "12px 0",
                borderBottom: "1px solid #eee",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontWeight: 600 }}>{p.usernameSnapshot}</div>
                <div style={{ color: "#666", fontSize: 14 }}>{p.status}</div>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => handleStatusChange(p.userId, "CONFIRMED")}
                  disabled={p.status === "CONFIRMED"}
                >
                  Approve
                </button>
                <button
                  onClick={() => handleStatusChange(p.userId, "CANCELLED")}
                  disabled={p.status === "CANCELLED"}
                >
                  Cancel
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
