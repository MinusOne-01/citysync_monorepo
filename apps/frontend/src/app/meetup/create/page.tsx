"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../../modules/auth/auth.hooks"
import { useRouter } from "next/navigation"
import { meetupApi } from "../../../modules/meetups/meetup.api"
import { uploadMeetupImage } from "../../../modules/meetups/meetup.upload"
import { ApiError } from "../../../shared/utils/apiError"
import { z } from "zod"
import { geocodeSearch, getBrowserLocation, type GeoResult } from "../../../shared/utils/geocode"

const CreateMeetupClientSchema = z.object({
  title: z.string().min(5),
  description: z.string().optional(),
  startTime: z.string().min(1),
  capacity: z.string().optional(),
  city: z.string().optional(),
  area: z.string().optional(),
  placeName: z.string().optional(),
})

export default function CreateMeetupPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [startTime, setStartTime] = useState("")
  const [capacity, setCapacity] = useState<string>("")
  const [city, setCity] = useState("")
  const [area, setArea] = useState("")
  const [placeName, setPlaceName] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)

  const [locationQuery, setLocationQuery] = useState("")
  const [locationResults, setLocationResults] = useState<GeoResult[]>([])
  const [selectedLocation, setSelectedLocation] = useState<GeoResult | null>(null)
  const [searching, setSearching] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login")
    }
  }, [authLoading, user, router])

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview)
    }
  }, [imagePreview])

  async function onSearchLocation() {
    setError(null)
    if (!locationQuery.trim()) {
      setError("Enter a location to search.")
      return
    }
    setSearching(true)
    try {
      const results = await geocodeSearch(locationQuery, 5)
      setLocationResults(results)
      if (results.length === 0) setError("No locations found.")
    } catch {
      setError("Failed to search location.")
    } finally {
      setSearching(false)
    }
  }

  async function onUseCurrentLocation() {
    setError(null)
    setSearching(true)
    try {
      const loc = await getBrowserLocation()
      setSelectedLocation(loc)
      setLocationResults([])
    } catch {
      setError("Could not access current location.")
    } finally {
      setSearching(false)
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const parsed = CreateMeetupClientSchema.safeParse({
      title,
      description: description || undefined,
      startTime,
      capacity: capacity || undefined,
      city: city || undefined,
      area: area || undefined,
      placeName: placeName || undefined,
    })

    if (!parsed.success) {
      const first =
        parsed.error.issues?.[0]?.message ?? "Please fix the highlighted fields."
      setError(first)
      return
    }


    if (!selectedLocation) {
      setError("Please select a location.")
      return
    }

    if (!imageFile) {
      setError("Please select a meetup image.")
      return
    }

    setLoading(true)
    try {
      const uploadData = await uploadMeetupImage(imageFile)

      const res = await meetupApi.create({
        title,
        description: description || undefined,
        startTime: new Date(startTime).toISOString(),
        capacity: capacity ? Number(capacity) : undefined,
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        city: city || undefined,
        area: area || undefined,
        placeName: placeName || undefined,
        meetupImageKey: uploadData.key
      })

      router.push(`/meetup/${res.meetupId}/creator-view`)
    } catch (err) {
      if (err instanceof ApiError) setError(err.message)
      else setError("Failed to create meetup")
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <p className="text-sm text-slate-500">Checking session...</p>
      </main>
    )
  }

 return (
  <main className="min-h-screen px-4 pt-10 pb-20">
    <div className="mx-auto w-full max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Create a meetup
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Share an idea and bring people together
        </p>
      </div>

      {/* Card */}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8">
        <form onSubmit={onSubmit} className="space-y-6">
          {/* Basic info */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">
                Title
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm
                           focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm
                           focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>
          </div>

          {/* Time & capacity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">
                Start time
              </label>
              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm
                           focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">
                Capacity (optional)
              </label>
              <input
                type="number"
                min={1}
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm
                           focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-700">
              Location
            </label>

            <div className="flex gap-2">
              <input
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                placeholder="Search address or place"
                className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm
                           focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
              <button
                type="button"
                onClick={onSearchLocation}
                disabled={searching}
                className="rounded-lg border border-slate-200 px-3 text-sm
                           hover:bg-slate-50 transition-colors"
              >
                {searching ? "Searching..." : "Search"}
              </button>
              <button
                type="button"
                onClick={onUseCurrentLocation}
                disabled={searching}
                className="rounded-lg border border-slate-200 px-3 text-sm
                           hover:bg-slate-50 transition-colors"
              >
                Use current
              </button>
            </div>

            {locationResults.length > 0 && (
              <div className="rounded-lg border border-slate-200 divide-y">
                {locationResults.map((r, i) => (
                  <button
                    key={`${r.label}-${i}`}
                    type="button"
                    onClick={() => {
                      setSelectedLocation(r)
                      setLocationResults([])
                      setLocationQuery(r.label)
                    }}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50"
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            )}

            {selectedLocation && (
              <p className="text-sm text-slate-500">
                Selected: {selectedLocation.label}
              </p>
            )}
          </div>

          {/* Image */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">
              Meetup image
            </label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => {
                 const file = e.target.files?.[0] ?? null
                 setImageFile(file)

                 if (imagePreview) URL.revokeObjectURL(imagePreview)
                 setImagePreview(file ? URL.createObjectURL(file) : null)
               }}
              required
              className="text-sm"
            />
            {imagePreview && (
  <img
    src={imagePreview}
    alt="Preview"
    className="mt-2 h-1/2 w-1/2 rounded-lg border border-slate-200 object-cover"
  />
)}


          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          {/* Action */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-sky-500 px-4 py-2.5
                       text-sm font-medium text-white
                       hover:bg-sky-600 transition-colors
                       disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Create meetup"}
          </button>
        </form>
      </div>
    </div>
  </main>
)

}
