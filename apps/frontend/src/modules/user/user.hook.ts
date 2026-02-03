"use client"

import { useEffect, useState } from "react"
import { userApi } from "./user.api"
import type { UserProfile } from "./user.types"

export function useUserMe() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<unknown>(null)

  useEffect(() => {
    let mounted = true

    async function load() {
      try {
        const res = await userApi.me()
        if (mounted) setUser(res.user)
      } catch (err) {
        if (mounted) setError(err)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()
    return () => { mounted = false }
  }, [])

  return { user, loading, error, refresh: async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await userApi.me()
      setUser(res.user)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  } }
}
