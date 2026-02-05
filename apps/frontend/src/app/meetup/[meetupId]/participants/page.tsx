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
    await refreshParticipants()
    const fresh = await getMeetupParticipants(meetupId);
    setParticipants(fresh);
  }

  async function refreshParticipants() {
    if (!meetupId) return
    const fresh = await getMeetupParticipants(meetupId)
    setParticipants(fresh)
  }

  const filtered = useMemo(() => {
    if (filter === "ALL") return participants;
    return participants.filter((p) => p.status === filter);
  }, [participants, filter]);

  if (meetupLoading || loading) {
    return (
      <main className="min-h-screen px-4 pt-10">
        <p className="text-sm text-slate-500">Loading participants...</p>
      </main>
    )
  }

  if (!isOrganizer) {
    return (
      <main className="min-h-screen px-4 pt-10">
        <p className="text-sm text-slate-500">Not authorized.</p>
      </main>
    )
  }


  return (
  <main className="min-h-screen px-4 pt-10 pb-24">
    <div className="mx-auto w-full max-w-3xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Participants
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage requests and attendance for this meetup
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {(["ALL", "REQUESTED", "CONFIRMED", "CANCELLED"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`
              rounded-full px-3 py-1.5 text-sm font-medium
              ${
                filter === f
                  ? "bg-sky-100 text-sky-700"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }
              transition-colors
            `}
          >
            {f === "ALL" ? "All" : f.toLowerCase()}
          </button>
        ))}
          <button
            type="button"
            onClick={refreshParticipants}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm hover:bg-slate-50 transition-colors"
          >
            Refresh
          </button>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <p className="text-sm text-slate-500">
          No participants found.
        </p>
      ) : (
        <div className="rounded-2xl bg-white border border-slate-200 divide-y">
          {filtered.map((p) => (
            <div
              key={p.userId}
              className="flex items-center justify-between gap-4 px-4 py-3"
            >
              {/* Identity */}
              <div>
                <div className="text-sm font-medium text-slate-900">
                  {p.usernameSnapshot}
                </div>
                <span
                  className={`
                    inline-block mt-0.5 rounded-full px-2 py-0.5 text-xs font-medium
                    ${
                      p.status === "REQUESTED"
                        ? "bg-amber-100 text-amber-700"
                        : p.status === "CONFIRMED"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-600"
                    }
                  `}
                >
                  {p.status.toLowerCase()}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    handleStatusChange(p.userId, "CONFIRMED")
                  }
                  disabled={p.status === "CONFIRMED" || p.status === "CANCELLED"}
                  className="
                    rounded-lg border border-slate-200 px-3 py-1.5
                    text-sm font-medium text-slate-700
                    hover:bg-slate-50
                    disabled:opacity-50 disabled:cursor-not-allowed
                  "
                >
                  Approve
                </button>

                <button
                  onClick={() =>
                    handleStatusChange(p.userId, "CANCELLED")
                  }
                  disabled={p.status === "CANCELLED"}
                  className="
                    rounded-lg border border-red-200 px-3 py-1.5
                    text-sm font-medium text-red-600
                    hover:bg-red-50
                    disabled:opacity-50 disabled:cursor-not-allowed
                  "
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </main>
)

}
