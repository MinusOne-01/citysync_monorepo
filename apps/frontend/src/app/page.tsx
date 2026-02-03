"use client"

import { useEffect, useState } from "react"
import { apiFetch } from "@/src/lib/api"


export default function Home() {
  const [status, setStatus] = useState<string>("loading")

  useEffect(() => {
    apiFetch<{ status: string }>("/health")
      .then((data) => setStatus(data.status))
      .catch(() => setStatus("error"))
  }, [])

  return (
    <main style={{ padding: 20 }}>
      <h1>CitySync</h1>
      <p>Backend status: {status}</p>
    </main>
  )
}

