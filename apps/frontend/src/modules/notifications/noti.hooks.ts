"use client"

import { useCallback, useEffect, useState } from "react"
import { notiApi } from "./noti.api"
import type { NotificationRecord } from "./noti.types"
import { ApiError } from "../../shared/utils/apiError"
import { useRouter } from "next/navigation"

export function useNotifications(limit = 20) {
  const router = useRouter()
  const [items, setItems] = useState<NotificationRecord[]>([])
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<unknown>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await notiApi.list({ limit })
      setItems(res.items)
      setNextCursor(res.nextCursor)
    } catch (err: any) {
      if (err instanceof ApiError && err.status === 401) {
        router.replace("/login")
        return
      }
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [limit, router])

  const loadMore = useCallback(async () => {
    if (!nextCursor) return
    setLoadingMore(true)
    try {
      const res = await notiApi.list({ limit, cursor: nextCursor })
      setItems((prev) => [...prev, ...res.items])
      setNextCursor(res.nextCursor)
    } catch (err) {
      setError(err)
    } finally {
      setLoadingMore(false)
    }
  }, [limit, nextCursor])

  const markRead = useCallback(async (id: string) => {
    await notiApi.markRead(id)
    setItems((prev) =>
      prev.map((n) => (n.notiId === id ? { ...n, isRead: true } : n))
    )
  }, [])

  const markAllRead = useCallback(async () => {
    await notiApi.markAllRead()
    setItems((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return { items, loading, loadingMore, error, nextCursor, loadMore, markRead, markAllRead, reload: load }
}
