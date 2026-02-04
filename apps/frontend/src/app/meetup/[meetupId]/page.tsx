"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useMeetup } from "../../../modules/meetups/meetup.hook";
import {
  getParticipationStatus,
  joinMeetup,
  leaveMeetup,
} from "../../../modules/participate/participate.api";
import type { ParticipationStatus } from "../../../modules/participate/participate.types";
import Link from "next/link";
import { useAuth } from "../../../modules/auth/auth.hooks";


type StatusState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; value: ParticipationStatus }
  | { status: "none" };

export default function MeetupDetailPage() {
  const params = useParams();
  const meetupId = typeof params.meetupId === "string" ? params.meetupId : null;

  const { meetup, loading, error } = useMeetup(meetupId);

  const [statusState, setStatusState] = useState<StatusState>({ status: "idle" });
  const [actionLoading, setActionLoading] = useState(false);

  const { status, user } = useAuth();
  const isOrganizer =
    status === "authenticated" && user?.id === meetup?.organizerId;

  
  useEffect(() => {
    if (!meetupId) return;
    setStatusState({ status: "loading" });
    getParticipationStatus(meetupId)
      .then((res) => setStatusState({ status: "ready", value: res.status }))
      .catch(() => setStatusState({ status: "none" }));
  }, [meetupId]);

  const canJoin = useMemo(() => {
    if (statusState.status === "none") return true;
    if (statusState.status === "ready") return statusState.value === "CANCELLED";
    return false;
  }, [statusState]);

  const canLeave = useMemo(() => {
    if (statusState.status === "ready") {
      return statusState.value === "REQUESTED" || statusState.value === "CONFIRMED";
    }
    return false;
  }, [statusState]);

  async function handleJoin() {
    if (!meetupId) return;
    setActionLoading(true);
    try {
      await joinMeetup(meetupId);
      const res = await getParticipationStatus(meetupId);
      setStatusState({ status: "ready", value: res.status });
    } finally {
      setActionLoading(false);
    }
  }

  async function handleLeave() {
    if (!meetupId) return;
    setActionLoading(true);
    try {
      await leaveMeetup(meetupId);
      setStatusState({ status: "none" });
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) {
    return (
      <main style={{ maxWidth: 700, margin: "48px auto", padding: "0 16px" }}>
        <p>Loading meetup...</p>
      </main>
    );
  }

  if (error || !meetup) {
    return (
      <main style={{ maxWidth: 700, margin: "48px auto", padding: "0 16px" }}>
        <p>Meetup not found.</p>
      </main>
    );
  }

  return (
    
    <main style={{ maxWidth: 700, margin: "48px auto", padding: "0 16px" }}>
      <h1 style={{ fontSize: 30, fontWeight: 700 }}>{meetup.title}</h1>
      <p style={{ marginTop: 6, color: "#555" }}>
        {new Date(meetup.startTime).toLocaleString()}
      </p>

      {meetup.imageUrl && (
        <img
          src={meetup.imageUrl}
          alt={meetup.title}
          style={{ marginTop: 16, width: "100%", borderRadius: 12 }}
        />
      )}

      {meetup.description && (
        <p style={{ marginTop: 16 }}>{meetup.description}</p>
      )}

      <div style={{ marginTop: 16 }}>
        <div><strong>City:</strong> {meetup.city ?? "-"}</div>
        <div><strong>Area:</strong> {meetup.area ?? "-"}</div>
        <div><strong>Place:</strong> {meetup.placeName ?? "-"}</div>
        <div><strong>Capacity:</strong> {meetup.capacity ?? "-"}</div>
      </div>

      <div style={{ marginTop: 24 }}>
        <p>
          <strong>Request Status:</strong>{" "}
          {statusState.status === "loading" && "Loading..."}
          {statusState.status === "none" && "Not joined"}
          {statusState.status === "ready" && statusState.value}
        </p>

        <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
          <button onClick={handleJoin} disabled={!canJoin || actionLoading}>
            Join
          </button>
          <button onClick={handleLeave} disabled={!canLeave || actionLoading}>
            Leave
          </button>
        </div>
      </div>
      {isOrganizer && meetupId && (
        <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
          <Link href={`/meetup/${meetupId}/participants`}>
            <button>See participants</button>
          </Link>
          <Link href={`/meetup/${meetupId}/edit`}>
            <button>Edit details</button>
          </Link>
        </div>
      )}

    </main>
  );
}
