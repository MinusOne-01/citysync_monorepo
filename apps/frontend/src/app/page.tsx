"use client"

import { useEffect, useState } from "react"
import { apiFetch } from "@/src/lib/api"
import { useAuthContext } from "../modules/auth/components/AuthProvider";
import LoginPage from "./login/page";

export default function Home() {
  const [status, setStatus] = useState<string>("loading")
  const { logout } = useAuthContext();

  useEffect(() => {
    apiFetch<{ status: string }>("/health")
      .then((data) => setStatus(data.status))
      .catch(() => setStatus("error"))
  }, [])

  return (
    <main style={{ padding: 20 }}>
      <h1>CitySync</h1>
      <p>Backend status: {status}</p>
      <LoginPage></LoginPage>
      <button onClick={logout}>Logout</button>;
    </main>
  )
}

export function LogoutButton() {
  const { logout } = useAuthContext();

  return <button onClick={logout}>Logout</button>;
}
