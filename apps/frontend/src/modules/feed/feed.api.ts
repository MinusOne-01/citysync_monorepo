import { apiRequest } from "../../shared/utils/apiClient";
import type { FeedParams, FeedResponse } from "./feed.types";

export function getFeed(params: FeedParams): Promise<FeedResponse> {
  const search = new URLSearchParams();

  search.set("latitude", String(params.latitude));
  search.set("longitude", String(params.longitude));

  if (params.radiusKm) search.set("radiusKm", String(params.radiusKm));
  if (params.limit) search.set("limit", String(params.limit));

  if (params.cursor) {
    search.set("cursor", JSON.stringify(params.cursor));
  }

  return apiRequest<FeedResponse>(`/feed?${search.toString()}`);
}
