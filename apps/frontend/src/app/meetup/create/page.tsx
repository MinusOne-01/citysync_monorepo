"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { meetupApi } from "../../../modules/meetups/meetup.api"
import { uploadMeetupImage } from "../../../modules/meetups/meetup.upload"
import { ApiError } from "../../../shared/utils/apiError"
import { z } from "zod"

const CreateMeetupClientSchema = z.object({
  title: z.string().min(5),
  description: z.string().optional(),
  startTime: z.string().min(1),
  capacity: z.string().optional(),
  latitude: z.string().min(1),
  longitude: z.string().min(1),
  city: z.string().optional(),
  area: z.string().optional(),
  placeName: z.string().optional(),
})

export default function CreateMeetupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [startTime, setStartTime] = useState("")
  const [capacity, setCapacity] = useState<string>("")
  const [latitude, setLatitude] = useState<string>("")
  const [longitude, setLongitude] = useState<string>("")
  const [city, setCity] = useState("")
  const [area, setArea] = useState("")
  const [placeName, setPlaceName] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const parsed = CreateMeetupClientSchema.safeParse({
        title,
        description: description || undefined,
        startTime,
        capacity: capacity || undefined,
        latitude,
        longitude,
        city: city || undefined,
        area: area || undefined,
        placeName: placeName || undefined,
    })

    if (!parsed.success) {
        setError("Please fix the form errors before submitting.")
        return
    }

    if (!imageFile) {
      setError("Please select a meetup image.")
      return
    }

    setLoading(true)
    try {
      // 1) upload image to S3
      const uploadData = await uploadMeetupImage(imageFile)

      // 2) create meetup
      const res = await meetupApi.create({
        title,
        description: description || undefined,
        startTime: new Date(startTime).toISOString(),
        capacity: capacity ? Number(capacity) : undefined,
        latitude: Number(latitude),
        longitude: Number(longitude),
        city: city || undefined,
        area: area || undefined,
        placeName: placeName || undefined,
        meetupImageKey: uploadData.key
      })

      router.push(`/meetup/${res.meetupId}`)
    } catch (err) {
      if (err instanceof ApiError) setError(err.message)
      else setError("Failed to create meetup")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ maxWidth: 600, margin: "48px auto", padding: "0 16px" }}>
      <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 16 }}>Create Meetup</h1>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <label>
          Title
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ display: "block", width: "100%", padding: "10px 12px" }}
          />
        </label>

        <label>
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ display: "block", width: "100%", padding: "10px 12px", minHeight: 80 }}
          />
        </label>

        <label>
          Start time
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
            style={{ display: "block", width: "100%", padding: "10px 12px" }}
          />
        </label>

        <label>
          Capacity
          <input
            type="number"
            min={1}
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            style={{ display: "block", width: "100%", padding: "10px 12px" }}
          />
        </label>

        <label>
          Latitude
          <input
            type="number"
            step="any"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            required
            style={{ display: "block", width: "100%", padding: "10px 12px" }}
          />
        </label>

        <label>
          Longitude
          <input
            type="number"
            step="any"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            required
            style={{ display: "block", width: "100%", padding: "10px 12px" }}
          />
        </label>

        <label>
          City
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            style={{ display: "block", width: "100%", padding: "10px 12px" }}
          />
        </label>

        <label>
          Area
          <input
            value={area}
            onChange={(e) => setArea(e.target.value)}
            style={{ display: "block", width: "100%", padding: "10px 12px" }}
          />
        </label>

        <label>
          Place name
          <input
            value={placeName}
            onChange={(e) => setPlaceName(e.target.value)}
            style={{ display: "block", width: "100%", padding: "10px 12px" }}
          />
        </label>

        <label>
          Meetup image
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            required
          />
        </label>

        {error && <p style={{ color: "crimson", margin: 0 }}>{error}</p>}

        <button type="submit" disabled={loading} style={{ padding: "10px 12px" }}>
          {loading ? "Creating..." : "Create Meetup"}
        </button>
      </form>
    </main>
  )
}
