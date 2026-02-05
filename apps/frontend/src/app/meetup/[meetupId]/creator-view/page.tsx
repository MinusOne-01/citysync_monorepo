"use client"

import { useParams } from "next/navigation"
import { useCreatorMeetup } from "../../../../modules/meetups/meetup.hook"
import Link from "next/link"


export default function CreatorMeetupViewPage() {
  const params = useParams()
  const meetupId = typeof params.meetupId === "string" ? params.meetupId : null
  const { meetup, loading, error } = useCreatorMeetup(meetupId)

  if (loading) {
    return (
      <main style={{ maxWidth: 700, margin: "48px auto", padding: "0 16px" }}>
        <p>Loading meetup...</p>
      </main>
    )
  }

  if (error || !meetup) {
    return (
      <main style={{ maxWidth: 700, margin: "48px auto", padding: "0 16px" }}>
        <p>Meetup not found.</p>
      </main>
    )
  }

  return (
  <main className="min-h-screen px-4 pt-10 pb-24">
    <div className="mx-auto w-full max-w-3xl space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            {meetup.title}
          </h1>

          <span
            className={`
              rounded-full px-3 py-1 text-xs font-medium
              ${
                meetup.status === "DRAFT"
                  ? "bg-slate-100 text-slate-700"
                  : meetup.status === "PUBLISHED"
                  ? "bg-sky-100 text-sky-700"
                  : meetup.status === "CANCELLED"
                  ? "bg-red-100 text-red-700"
                  : "bg-slate-200 text-slate-700"
              }
            `}
          >
            {meetup.status}
          </span>
        </div>

        <p className="text-sm text-slate-500">
          {new Date(meetup.startTime).toLocaleString()}
        </p>
      </div>

      {/* Image */}
      {meetup.imageUrl && (
        <img
          src={meetup.imageUrl}
          alt={meetup.title}
          className="w-full rounded-2xl border border-slate-200 object-cover"
        />
      )}

      {/* Details */}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 space-y-6">
        {meetup.description && (
          <p className="text-sm text-slate-700 leading-relaxed">
            {meetup.description}
          </p>
        )}

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-slate-500">City</span>
            <div className="font-medium text-slate-900">
              {meetup.city ?? "—"}
            </div>
          </div>

          <div>
            <span className="text-slate-500">Area</span>
            <div className="font-medium text-slate-900">
              {meetup.area ?? "—"}
            </div>
          </div>

          <div>
            <span className="text-slate-500">Place</span>
            <div className="font-medium text-slate-900">
              {meetup.placeName ?? "—"}
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

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href={`/meetup/${meetup.id}/edit`} className="w-full">
          <button
            className="
              w-full rounded-lg bg-sky-500 px-4 py-2.5
              text-sm font-medium text-white
              hover:bg-sky-600 transition-colors
            "
          >
            Edit meetup
          </button>
        </Link>

        <Link href={`/meetup/${meetup.id}/participants`} className="w-full">
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
      </div>
    </div>
  </main>
)

}
