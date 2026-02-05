"use client"

import { useEffect, useState } from "react"
import { useAuth } from "../../modules/auth/auth.hooks"
import { useParticipationActions } from "../../modules/participate/participate.hooks"
import type { ParticipantHistoryItem } from "../../modules/participate/participate.types"
import { HistoryMeetupItem } from "../../components/meetups/HistoryMeetupItem"

export default function HistoryPage() {
  const { status } = useAuth()
  const { getParticipantHistory } = useParticipationActions()

  const [history, setHistory] = useState<ParticipantHistoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status !== "authenticated") return

    setLoading(true)
    getParticipantHistory()
      .then(setHistory)
      .finally(() => setLoading(false))
  }, [status, getParticipantHistory])

  if (status === "loading" || loading) {
    return (
      <main className="min-h-screen px-4 pt-10">
        <p className="text-sm text-slate-500">Loading history…</p>
      </main>
    )
  }

  if (status !== "authenticated") {
    return (
      <main className="min-h-screen px-4 pt-10">
        <p className="text-sm text-slate-500">
          Please log in to view your meetup history.
        </p>
      </main>
    )
  }

  return (
    <main className="min-h-screen px-4 pt-10 pb-24">
      <div className="mx-auto w-full max-w-4xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Your meetup history
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Meetups you’ve joined or participated in
          </p>
        </div>

        {/* Content */}
        {history.length === 0 ? (
          <p className="text-sm text-slate-500">
            You haven’t joined any meetups yet.
          </p>
        ) : (
          <div className="rounded-2xl bg-white border border-slate-200 divide-y">
            {history.map((item) => (
              <HistoryMeetupItem
                key={`${item.meetupId}-${item.joinedAt}`}
                item={item}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
