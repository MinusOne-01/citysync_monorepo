import type { UserDTO } from "@shared/types/user";
import { fetchWithAuth } from "./fetchWithAuth";

const API_BASE = "http://localhost:3001/api";

export async function fetchMe(): Promise<UserDTO> {
  const res = await fetch(`${API_BASE}/user/me`, {
    headers: {
      "Accept": "application/json",
      // Force the browser to get fresh data from the server
      "Cache-Control": "no-cache", 
      "Pragma": "no-cache"
    },
    credentials: "include",
  });

  if (!res.ok) {
    const errorBody = await res.text();
    console.error("Server responded with:", errorBody);
    throw new Error("Not authenticated");
  }

  const data = await res.json();
  return data;
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error("Login failed");
  }
}


export async function logout(): Promise<void> {
  const res = await fetch(`${API_BASE}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Logout failed");
  }
}

