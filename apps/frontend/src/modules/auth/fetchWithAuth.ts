

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export async function fetchWithAuth(
  input: RequestInfo,
  init?: RequestInit
): Promise<Response> {
  let res = await fetch(input, {
    ...init,
    credentials: "include",
  });

  if (res.status !== 401) {
    return res;
  }

  // try refresh
  const refresh = await fetch(`${API_BASE}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });

  if (!refresh.ok) {
    throw new Error("Session expired");
  }

  // retry original request
  res = await fetch(input, {
    ...init,
    credentials: "include",
  });

  return res;
}
