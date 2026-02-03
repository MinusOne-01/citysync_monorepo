import { ApiError } from "./apiError";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001/api";

async function parseBody(res: Response) {

  const contentType = res.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) return res.json();
  return res.text();
}

export type ApiRequestOptions = RequestInit;

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {}
): Promise<T> {

  const { ...fetchOptions } = options;
  const url = `${API_BASE}${path}`;

 console.log("sending req-> ", url)
 
  const res = await fetch(url, {
    credentials: "include",
    ...fetchOptions,
    headers: {
      "Accept": "application/json",
      ...(fetchOptions.headers ?? {}),
    },
  });

  const body = await parseBody(res);

  if (!res.ok) {
    const message =
      typeof body === "string"
        ? body
        : body?.message ?? "Request failed";

    throw new ApiError(message, res.status, body?.code, body);
  }

  return body as T;

}

