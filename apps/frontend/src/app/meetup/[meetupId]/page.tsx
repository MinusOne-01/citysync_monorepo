"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation"
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
    const router = useRouter()
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
    if (status !== "authenticated") {
      router.replace("/login");
      return;
    }

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
  <main className="min-h-screen px-4 pt-10 pb-24">
    <div className="mx-auto w-full max-w-3xl space-y-8">
      {/* Hero */}
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          {meetup.title}
        </h1>

        <p className="text-sm text-slate-500">
          {new Date(meetup.startTime).toLocaleString()}
        </p>

        {meetup.imageUrl && (
          <img
            src={meetup.imageUrl}
            alt={meetup.title}
            className="mt-4 w-full rounded-2xl border border-slate-200 object-cover"
          />
        )}
      </div>

      {/* Body */}
      <div className="space-y-6">
        {meetup.description && (
          <p className="text-sm text-slate-700 leading-relaxed">
            {meetup.description}
          </p>
        )}

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-slate-500">City</span>
            <div className="font-medium text-slate-900">
              {meetup.city ?? "-"}
            </div>
          </div>

          <div>
            <span className="text-slate-500">Area</span>
            <div className="font-medium text-slate-900">
              {meetup.area ?? "-"}
            </div>
          </div>

          <div>
            <span className="text-slate-500">Place</span>
            <div className="font-medium text-slate-900">
              {meetup.placeName ?? "-"}
            </div>
          </div>

          <div>
            <span className="text-slate-500">Capacity</span>
            <div className="font-medium text-slate-900">
              {meetup.capacity ?? "Unlimited"}
            </div>
          </div>
        </div>
      </div>

      {/* Action Card */}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 space-y-4">
        <div className="text-sm text-slate-600">
          <span className="font-medium text-slate-900">Your status:</span>{" "}
          {statusState.status === "loading" && "Checking..."}
          {statusState.status === "none" && "Not joined"}
          {statusState.status === "ready" && statusState.value}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {canJoin && (
            <button
              onClick={handleJoin}
              disabled={actionLoading}
              className="
                w-full rounded-lg bg-sky-500 px-4 py-2.5
                text-sm font-medium text-white
                hover:bg-sky-600 transition-colors
                disabled:opacity-60 disabled:cursor-not-allowed
              "
            >
              {actionLoading ? "Joining..." : "Join meetup"}
            </button>
          )}

          {canLeave && (
            <button
              onClick={handleLeave}
              disabled={actionLoading}
              className="
                w-full rounded-lg border border-slate-200 px-4 py-2.5
                text-sm font-medium text-slate-700
                hover:bg-slate-50 transition-colors
              "
            >
              {actionLoading ? "Leaving..." : "Leave meetup"}
            </button>
          )}
        </div>

        {isOrganizer && meetupId && (
          <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-slate-200">
            <Link href={`/meetup/${meetupId}/participants`} className="w-full">
              <button
                className="
                  w-full rounded-lg border border-slate-200 px-4 py-2.5
                  text-sm font-medium text-slate-700
                  hover:bg-slate-50 transition-colors
                "
              >
                View participants
              </button>
            </Link>
              <Link
                href={`/meetup/${meetupId}/edit`}
                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors text-center"
              >
                Edit meetup
              </Link>
          </div>
        )}
      </div>
    </div>
  </main>
)

}
