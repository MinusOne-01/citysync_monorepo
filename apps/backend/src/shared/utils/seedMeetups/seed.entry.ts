import seedrandom from "seedrandom"
import { addDays, subDays } from "date-fns"
import type { MeetupStatus } from "@prisma/client/edge"
import { prisma } from "../../configs/db"
import { ADMIN_ORGANIZER_ID, CAPACITY_POOL, LOCATION_PRESETS, MEETUP_DESCRIPTIONS, MEETUP_IMAGE_KEYS, MEETUP_TITLES, STATUS_POOL } from "./seed.datatype"

const rng = seedrandom("citysync-seed")

function pick<T>(arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)]
}

function randomizeTime(date: Date) {
  const d = new Date(date)
  d.setHours(Math.floor(rng() * 12) + 8) // 8 AM – 8 PM
  d.setMinutes(Math.floor(rng() * 60))
  d.setSeconds(0)
  d.setMilliseconds(0)
  return d
}

function getStartTimeForStatus(status: MeetupStatus) {
  const now = new Date()
  let baseDate : Date

  switch (status) {
    case "ENDED":
      baseDate = subDays(now, Math.floor(rng() * 14) + 1)
      break

    case "CANCELLED":
    case "DRAFT":
      baseDate = addDays(now, Math.floor(rng() * 14) + 1)
      break

    case "PUBLISHED":
    default:
      baseDate = addDays(now, Math.floor(rng() * 100) + 30)
      break
  }

  return randomizeTime(baseDate)
  
}


async function runSeeder() {
  console.log("🌱 Seeding meetups...")

  for (let i = 0; i < 100; i++) {
    const location = pick(LOCATION_PRESETS)
    const status = pick(STATUS_POOL)

    await prisma.meetup.create({
      data: {
        organizerId: ADMIN_ORGANIZER_ID,

        title: pick(MEETUP_TITLES),
        description: pick(MEETUP_DESCRIPTIONS),

        status,
        startTime: getStartTimeForStatus(status),
        capacity: pick(CAPACITY_POOL),

        latitude: location.latitude,
        longitude: location.longitude,
        city: location.city,
        area: location.area,
        placeName: location.placeName,

        meetupImageKey: pick(MEETUP_IMAGE_KEYS),
      },
    })
  }

  console.log("✅ Meetup seeding complete")
}

runSeeder()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
