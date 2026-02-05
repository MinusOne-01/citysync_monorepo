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
  <main className="min-h-screen px-4 pt-10 pb-20">
    <div className="mx-auto w-full max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Edit meetup details
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Update details or manage the meetup status
          </p>
        </div>

        {/* Status badge */}
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

      {isReadOnly && (
        <p className="text-sm text-slate-500">
          This meetup can no longer be edited.
        </p>
      )}

      {/* Card */}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8">
        <form onSubmit={onSave} className="space-y-6">
          {/* Fields */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">
                Title
              </label>
              <input
                disabled={isReadOnly}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="
                  w-full rounded-lg border border-slate-200
                  px-3 py-2 text-sm
                  focus:outline-none focus:ring-2 focus:ring-sky-400
                  disabled:bg-slate-50 disabled:text-slate-400
                "
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">
                Description
              </label>
              <textarea
                disabled={isReadOnly}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="
                  w-full rounded-lg border border-slate-200
                  px-3 py-2 text-sm
                  focus:outline-none focus:ring-2 focus:ring-sky-400
                  disabled:bg-slate-50 disabled:text-slate-400
                "
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">
                  Start time
                </label>
                <input
                  disabled={isReadOnly}
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="
                    w-full rounded-lg border border-slate-200
                    px-3 py-2 text-sm
                    focus:outline-none focus:ring-2 focus:ring-sky-400
                    disabled:bg-slate-50 disabled:text-slate-400
                  "
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">
                  Capacity
                </label>
                <input
                  disabled={isReadOnly}
                  type="number"
                  min={1}
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  className="
                    w-full rounded-lg border border-slate-200
                    px-3 py-2 text-sm
                    focus:outline-none focus:ring-2 focus:ring-sky-400
                    disabled:bg-slate-50 disabled:text-slate-400
                  "
                />
              </div>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="submit"
              disabled={saving || isReadOnly}
              className="
                w-full rounded-lg bg-sky-500 px-4 py-2.5
                text-sm font-medium text-white
                hover:bg-sky-600 transition-colors
                disabled:opacity-60 disabled:cursor-not-allowed
              "
            >
              {saving ? "Saving…" : "Save changes"}
            </button>

            {canPublish && (
              <button
                type="button"
                onClick={onPublish}
                disabled={actionLoading}
                className="
                  w-full rounded-lg border border-slate-200 px-4 py-2.5
                  text-sm font-medium text-slate-700
                  hover:bg-slate-50 transition-colors
                "
              >
                {actionLoading ? "Publishing…" : "Publish"}
              </button>
            )}

            {canCancel && (
              <button
                type="button"
                onClick={onCancel}
                disabled={actionLoading}
                className="
                  w-full rounded-lg border border-red-200 px-4 py-2.5
                  text-sm font-medium text-red-600
                  hover:bg-red-50 transition-colors
                "
              >
                {actionLoading ? "Cancelling…" : "Cancel meetup"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  </main>
)
}
