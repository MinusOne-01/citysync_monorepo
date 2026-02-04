import { useCallback, useState } from "react";
import { getFeed } from "./feed.api";
import type { FeedCursor, FeedItem, FeedParams } from "./feed.types";

export function useFeed(initialParams: Omit<FeedParams, "cursor"> | null) {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [cursor, setCursor] = useState<FeedCursor | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(
    async (reset = false) => {
      if (!initialParams) return;

      setLoading(true);
      const params = {
        ...initialParams,
        cursor: reset ? null : cursor,
      };

      const res = await getFeed(params);
      setItems((prev) => (reset ? res.items : [...prev, ...res.items]));
      setCursor(res.nextCursor);
      setLoading(false);
    },
    [initialParams, cursor]
  );

  return { items, cursor, loading, load };
}

