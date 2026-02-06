"use client"

import { useEffect, useState } from "react"
import { meetupApi } from "./meetup.api"
import type { Meetup } from "./meetup.types"
import { ApiError } from "../../shared/utils/apiError"
import { useRouter } from "next/navigation"

type HookState = {
  meetup: Meetup | null
  loading: boolean
  error: unknown
}

async function fetchPublic(meetupId: string) {
  return meetupApi.get(meetupId)
}

async function fetchCreator(meetupId: string) {
  return meetupApi.getCreatorView(meetupId)
}

function useMeetupBase(meetupId: string | null, mode: "public" | "creator"): HookState {
  const router = useRouter()
  const [meetup, setMeetup] = useState<Meetup | null>(null)
  const [loading, setLoading] = useState(Boolean(meetupId))
  const [error, setError] = useState<unknown>(null)

  useEffect(() => {
    let mounted = true
    if (!meetupId) return

    async function load() {
      try {
        if (!meetupId) return
        const res =
          mode === "creator"
            ? await fetchCreator(meetupId)
            : await fetchPublic(meetupId)

        if (mounted) setMeetup(res.meetup)
      } catch (err) {
        if (mode === "creator" && err instanceof ApiError && err.status === 401) {
          return
        }
        if (mounted) setError(err)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()
    return () => { mounted = false }
  }, [meetupId, mode, router])

  return { meetup, loading, error }
}

export function useMeetup(meetupId: string | null) {
  return useMeetupBase(meetupId, "public")
}

export function useCreatorMeetup(meetupId: string | null) {
  return useMeetupBase(meetupId, "creator")
}
