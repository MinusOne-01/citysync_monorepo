"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { meetupApi } from "../../../../modules/meetups/meetup.api"
import type { Meetup } from "../../../../modules/meetups/meetup.types"
import { ApiError } from "../../../../shared/utils/apiError"


export default function MeetupEditPage() {
  const router = useRouter()
  const params = useParams()
  const meetupId = typeof params.meetupId === "string" ? params.meetupId : null

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [meetup, setMeetup] = useState<Meetup | null>(null)
  const canPublish = meetup?.status === "DRAFT"
  const canCancel = meetup?.status === "DRAFT" || meetup?.status === "PUBLISHED"
  const isReadOnly = meetup?.status === "CANCELLED" || meetup?.status === "ENDED"


  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [startTime, setStartTime] = useState("")
  const [capacity, setCapacity] = useState<string>("")

    function updateStatus(status: Meetup["status"]) {
        setMeetup((prev) => (prev ? { ...prev, status } : prev))
    }


  useEffect(() => {
    let mounted = true
    if (!meetupId) return

    async function load() {
      try {
        if (!meetupId) return
        const res = await meetupApi.getCreatorView(meetupId)
        if (!mounted) return
        const m = res.meetup
        setMeetup(m)
        setTitle(m.title)
        setDescription(m.description ?? "")
        setStartTime(new Date(m.startTime).toISOString().slice(0, 16))
        setCapacity(m.capacity ? String(m.capacity) : "")
      } catch (err: any) {
        if (err instanceof ApiError && err.status === 401) {
          router.replace("/login")
          return
        }
        setError("Failed to load meetup")
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()
    return () => { mounted = false }
  }, [meetupId, router])

  async function onSave(e: React.FormEvent) {
    e.preventDefault()
    if (!meetupId) return

    setError(null)
    setSaving(true)

    try {
      await meetupApi.edit(meetupId, {
        title,
        description: description || undefined,
        startTime: startTime ? new Date(startTime).toISOString() : undefined,
        capacity: capacity ? Number(capacity) : undefined
      })
      setMeetup((prev) => prev ? { ...prev, title, description, startTime: new Date(startTime).toISOString(), capacity: capacity ? Number(capacity) : null } : prev)

      
    } catch (err: any) {
      if (err instanceof ApiError) setError(err.message)
      else setError("Failed to save changes")
    } finally {
      setSaving(false)
    }
  }

  async function onPublish() {
    if (!meetupId) return
    setError(null)
    setActionLoading(true)

    try {
      await meetupApi.publish(meetupId)
      updateStatus("PUBLISHED")
      
    } catch (err: any) {
      if (err instanceof ApiError) setError(err.message)
      else setError("Failed to publish meetup")
    } finally {
      setActionLoading(false)
    }
  }

  async function onCancel() {
    if (!meetupId) return
    setError(null)
    setActionLoading(true)

    try {
      await meetupApi.cancel(meetupId)
      updateStatus("CANCELLED")
      
    } catch (err: any) {
      if (err instanceof ApiError) setError(err.message)
      else setError("Failed to cancel meetup")
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <main style={{ maxWidth: 700, margin: "48px auto", padding: "0 16px" }}>
        <p>Loading...</p>
      </main>
    )
  }

  if (!meetup || error) {
    return (
      <main style={{ maxWidth: 700, margin: "48px auto", padding: "0 16px" }}>
        <p>{error ?? "Meetup not found"}</p>
      </main>
    )
  }

  return (
    <main style={{ maxWidth: 700, margin: "48px auto", padding: "0 16px" }}>
      <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 16 }}>
        Edit Meetup
      </h1>

      <form onSubmit={onSave} style={{ display: "grid", gap: 12 }}>
        <label>
          Title
          <input 
            disabled={isReadOnly}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ display: "block", width: "100%", padding: "10px 12px" }}
          />
        </label>

        <label>
          Description
          <textarea 
            disabled={isReadOnly}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ display: "block", width: "100%", padding: "10px 12px", minHeight: 80 }}
          />
        </label>

        <label>
          Start time
          <input 
            disabled={isReadOnly}
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            style={{ display: "block", width: "100%", padding: "10px 12px" }}
          />
        </label>

        <label>
          Capacity
          <input 
            disabled={isReadOnly}
            type="number"
            min={1}
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            style={{ display: "block", width: "100%", padding: "10px 12px" }}
          />
        </label>

        {error && <p style={{ color: "crimson", margin: 0 }}>{error}</p>}

        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="submit" disabled={saving || isReadOnly}
            style={{ padding: "10px 12px" }}>
            {saving ? "Saving..." : "Save changes"}
          </button>

          <button
            type="button"
            onClick={onPublish}
            disabled={actionLoading || !canPublish}
            style={{ padding: "10px 12px" }}
          >
            {actionLoading ? "Publishing..." : "Publish"}
          </button>

          <button
            type="button"
            onClick={onCancel}
            disabled={actionLoading  || !canCancel}
            style={{ padding: "10px 12px" }}
          >
            {actionLoading ? "Cancelling..." : "Cancel"}
          </button>
        </div>
      </form>
    </main>
  )
}
