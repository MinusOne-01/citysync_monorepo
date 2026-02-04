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
        <div><strong>Status:</strong> {meetup.status}</div>
        <div><strong>City:</strong> {meetup.city ?? "—"}</div>
        <div><strong>Area:</strong> {meetup.area ?? "—"}</div>
        <div><strong>Place:</strong> {meetup.placeName ?? "—"}</div>
        <div><strong>Capacity:</strong> {meetup.capacity ?? "—"}</div>
      </div>
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <Link href={`/meetup/${meetup.id}/edit`} style={{ padding: "8px 12px" }}>
                  Edit
              </Link>
              <Link href={`/meetup/${meetup.id}/participants`} style={{ padding: "8px 12px" }}>
                  Participants
              </Link>
          </div>

    </main>
  )
}
