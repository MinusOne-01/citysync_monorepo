"use client";

import { useEffect, useState } from "react";
import { useFeed } from "../../modules/feed/feed.hooks";
import { geocodeSearch, getBrowserLocation, type GeoResult } from "../../shared/utils/geocode";

export default function FeedPage() {
  const [location, setLocation] = useState<GeoResult | null>(null);
  
  const [geoFailed, setGeoFailed] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<GeoResult[]>([]);
  
    const feedParams = location
        ? {
            latitude: location.latitude,
            longitude: location.longitude,
            radiusKm: 20,
            limit: 20,
        }
        : null;

    const { items, loading, load } = useFeed(feedParams);

  useEffect(() => {
    (async () => {
      try {
        const loc = await getBrowserLocation();
        setLocation(loc);
        await load(true);
      } catch {
        setGeoFailed(true);
      }
    })();
  }, [load]);

  useEffect(() => {
    if (!geoFailed) return;
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const handle = setTimeout(async () => {
      const results = await geocodeSearch(query.trim(), 5);
      setSuggestions(results);
    }, 400);

    return () => clearTimeout(handle);
  }, [query, geoFailed]);

  async function handleSelectLocation(loc: GeoResult) {
    setLocation(loc);
    setSuggestions([]);
    await load(true);
  }

  return (
    <main style={{ maxWidth: 800, margin: "48px auto", padding: "0 16px" }}>
      <h1>Feed</h1>

      {location?.label && (
        <p style={{ marginTop: 12 }}>Showing results near: {location.label}</p>
      )}

      {geoFailed && !location && (
        <div style={{ marginTop: 16 }}>
          <p>Search your city or area:</p>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a city..."
          />

          <ul style={{ marginTop: 8, paddingLeft: 0, listStyle: "none" }}>
            {suggestions.map((s, idx) => (
              <li key={idx} style={{ marginTop: 6 }}>
                <button onClick={() => handleSelectLocation(s)}>{s.label}</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {loading && <p style={{ marginTop: 16 }}>Loading...</p>}

      {!loading &&
        items.map((m) => (
          <div key={m.id} style={{ marginTop: 12 }}>
            <strong>{m.title}</strong>
            <div>{m.city ?? "Unknown city"}</div>
          </div>
        ))}
    </main>
  );
}
