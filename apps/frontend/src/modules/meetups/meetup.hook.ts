"use client"

import { useEffect, useState } from "react"
import { meetupApi } from "./meetup.api"
import type { Meetup } from "./meetup.types"

export function useMeetup(meetupId: string | null) {
  const [meetup, setMeetup] = useState<Meetup | null>(null)
  const [loading, setLoading] = useState(Boolean(meetupId))
  const [error, setError] = useState<unknown>(null)

  useEffect(() => {
    let mounted = true
    if (!meetupId) return

    async function load() {
      try {
        if (!meetupId) return
        const res = await meetupApi.get(meetupId)
        if (mounted) setMeetup(res.meetup)
      } catch (err) {
        if (mounted) setError(err)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()
    return () => { mounted = false }
  }, [meetupId])

  return { meetup, loading, error }
}
