"use client"

import { useEffect, useState } from "react"
import { useFeed } from "../../modules/feed/feed.hooks"
import { geocodeSearch, getBrowserLocation, type GeoResult } from "../../shared/utils/geocode"
import { MeetupCard } from "../../components/meetups/MeetupCard"

type PersistedLocation = {
  label: string
  latitude: number
  longitude: number
}

function persistLocation(loc: GeoResult) {
  const payload: PersistedLocation = {
    label: loc.label,
    latitude: loc.latitude,
    longitude: loc.longitude,
  }

  localStorage.setItem("feed:location", JSON.stringify(payload))
}



export default function FeedPage() {
  const [location, setLocation] = useState<GeoResult | null>(null)
  const [geoFailed, setGeoFailed] = useState(false)
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<GeoResult[]>([])
  const [searching, setSearching] = useState(false)


  const feedParams = location
    ? {
      latitude: location.latitude,
      longitude: location.longitude,
      radiusKm: 20,
      limit: 20,
    }
    : null

  const { items, loading, load } = useFeed(feedParams)

  useEffect(() => {
    const raw = localStorage.getItem("feed:location")
    if (raw) {
      try {
        const saved: PersistedLocation = JSON.parse(raw)
        setLocation(saved)
        return
      } catch {
        localStorage.removeItem("feed:location")
      }
    }

    (async () => {
      try {
        const loc = await getBrowserLocation()
        setLocation(loc)
      } catch {
        setGeoFailed(true)
      }
    })()
  }, [])

  useEffect(() => {
    (async () => {
      try {
        const loc = await getBrowserLocation()
        setLocation(loc)
      } catch {
        setGeoFailed(true)
      }
    })()
  }, [])

  useEffect(() => {
    if (!location) return
    load(true)
  }, [location])

  async function handleSelectLocation(loc: GeoResult) {
    persistLocation(loc)
    setLocation(loc)
    setSuggestions([])
    setQuery(loc.label)
  }

  async function handleSearch() {
    if (!query.trim()) {
      setSuggestions([])
      return
    }

    setSearching(true)
    try {
      const results = await geocodeSearch(query.trim(), 5)
      setSuggestions(results)
    } finally {
      setSearching(false)
    }
  }


  return (
    <main className="min-h-screen px-4 pt-10 pb-24">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Meetups near you
          </h1>

          {location?.label && (
            <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
              <span>Showing results near</span>
              <span className="font-medium text-slate-900">{location.label}</span>
              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem("feed:location")
                  setLocation(null)
                  setSuggestions([])
                  setGeoFailed(true)
                  setQuery(location.label ?? "")
                }}
                className="text-sky-600 hover:underline text-sm"
              >
                Change
              </button>
            </div>
          )}
        </div>


        {/* Manual location search */}
        {geoFailed && !location && (
          <div className="space-y-2">
            <p className="text-sm text-slate-600">
              Search your city or area
            </p>
            <div className="flex gap-2 max-w-sm">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a city..."
                className="
      flex-1 rounded-lg border border-slate-200
      px-3 py-2 text-sm
      focus:outline-none focus:ring-2 focus:ring-sky-400
    "
              />

              <button
                type="button"
                onClick={handleSearch}
                disabled={searching}
                className="
      rounded-lg border border-slate-200 px-3
      text-sm hover:bg-slate-50 transition-colors
      disabled:opacity-60
    "
              >
                {searching ? "Searching..." : "Search"}
              </button>
            </div>


            {suggestions.length > 0 && (
              <div className="rounded-lg border border-slate-200 divide-y max-w-sm">
                {suggestions.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectLocation(s)}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Feed */}
        {loading && (
          <p className="text-sm text-slate-500">
            Loading meetups...
          </p>
        )}

        {!loading && items.length === 0 && (
          <div className="text-sm text-slate-500 space-y-1">
            <p>No meetups found near this location</p>
            <p>Try popular locations like Delhi, Mumbai, Hyderabad, Bangalore, Pune</p>
          </div>
        )}

        {!loading && items.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((m) => (
              <MeetupCard key={m.id} meetup={m} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
