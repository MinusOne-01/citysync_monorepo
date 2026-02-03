"use client"

import { useParams } from "next/navigation"
import { useMeetup } from "../../../modules/meetups/meetup.hook"

export default function MeetupDetailPage() {

  const params = useParams()
  const meetupId = typeof params.meetupId === "string" ? params.meetupId : null
  const { meetup, loading, error } = useMeetup(meetupId)

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
        <div><strong>City:</strong> {meetup.city ?? "—"}</div>
        <div><strong>Area:</strong> {meetup.area ?? "—"}</div>
        <div><strong>Place:</strong> {meetup.placeName ?? "—"}</div>
        <div><strong>Capacity:</strong> {meetup.capacity ?? "—"}</div>
      </div>
    </main>
  )
  
}
