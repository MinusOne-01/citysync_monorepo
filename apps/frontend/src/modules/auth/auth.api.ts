
import { apiRequest } from "../../shared/utils/apiClient"

export const authApi = {

  register(input: { email: string; password: string; username: string }) {
    return apiRequest<{ ok: true }>("/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input)
    })
  },

  login(input: { email: string; password: string }) {
    return apiRequest<{ ok: true }>("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input)
    })
  },

  logout() {
    return apiRequest<void>("/auth/logout", { method: "POST" })
  },

  refresh() {
    return apiRequest<{ ok: true }>("/auth/refresh", { method: "POST" })
  },

  // adjust path to your backend "current user" endpoint
  me() {
    return apiRequest<{ user: any }>("/user/me", { method: "GET" })
  }

}

