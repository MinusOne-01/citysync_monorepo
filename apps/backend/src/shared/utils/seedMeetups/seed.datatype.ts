import type { MeetupStatus } from "@prisma/client"

export const ADMIN_ORGANIZER_ID = "4597da77-86db-4ede-bc49-c4217eab4eb8"


export const MEETUP_TITLES = [
  "Sunday Coffee & Conversations",
  "Morning Yoga in the Park",
  "Weekend Coding Jam",
  "Photography Walk Around the City",
  "Book Club Meetup",
  "Casual Networking Over Chai",
  "Sunset Walk & Talk",
  "Beginner-Friendly Running Group",
  "Creative Writing Circle",
  "Board Games & Chill",
  "Open Mic Evening",
  "Street Food Exploration",
  "Mindfulness & Meditation Session",
  "Startup Ideas Brainstorm",
  "Sketching & Urban Art Meetup",
  "Cycling Around the City",
  "Tech Talks & Knowledge Sharing",
  "Language Exchange Meetup",
  "Movie Discussion Night",
  "Weekend Volunteering Meetup",
]


export const MEETUP_DESCRIPTIONS = [
  "A relaxed meetup to meet new people and enjoy good conversations.",
  "Join us for a casual session focused on learning and sharing ideas.",
  "A friendly gathering for anyone interested in this activity.",
  "Spend some quality time connecting with people from the community.",
  "An open meetup to unwind, socialize, and have a good time.",
  "A small group meetup to learn, explore, and grow together.",
  "Perfect for beginners and enthusiasts alike.",
  "Come along to meet like-minded people and exchange experiences.",
  "A casual and welcoming space to connect with others.",
  "An informal meetup focused on community and collaboration.",
  "Take a break from routine and join us for a refreshing session.",
  "A light, easygoing meetup with no pressure and no expectations.",
  "Great opportunity to meet new faces and build connections.",
  "A simple meetup designed to bring people together.",
  "Join us for an engaging and friendly group session.",
  "An open and inclusive meetup for everyone.",
  "A relaxed setting to share ideas and enjoy the moment.",
  "Come for the activity, stay for the conversations.",
  "A casual meetup with a focus on community bonding.",
  "An easygoing meetup to connect and have meaningful discussions.",
]


export type LocationPreset = {
  city: string
  area: string
  placeName: string
  latitude: number
  longitude: number
}

export const LOCATION_PRESETS: LocationPreset[] = [
  {
    city: "Bangalore",
    area: "Indiranagar",
    placeName: "Cubbon Park",
    latitude: 12.9716,
    longitude: 77.5946,
  },
  {
    city: "Mumbai",
    area: "Andheri West",
    placeName: "Versova Beach",
    latitude: 19.0760,
    longitude: 72.8777,
  },
  {
    city: "Delhi",
    area: "Connaught Place",
    placeName: "Central Park",
    latitude: 28.6139,
    longitude: 77.2090,
  },
  {
    city: "Hyderabad",
    area: "HITEC City",
    placeName: "Durgam Cheruvu",
    latitude: 17.3850,
    longitude: 78.4867,
  },
  {
    city: "Pune",
    area: "Koregaon Park",
    placeName: "Osho Garden",
    latitude: 18.5204,
    longitude: 73.8567,
  },
]

export const CAPACITY_POOL: Array<number | null> = [
  null, // no limit
  10,
  12,
  15,
  20,
  25,
  30,
  40,
]


export const STATUS_POOL: MeetupStatus[] = [
  // Most common
  "PUBLISHED",
  "PUBLISHED",
  "PUBLISHED",
  "PUBLISHED",

  // Some drafts
  "DRAFT",

  // Few cancelled
  "CANCELLED",

  // Few ended
  "ENDED",
]

export const MEETUP_IMAGE_BASE_PATH = "meetups/92325ec9-1b16-4d53-a171-581710456652"

  export const MEETUP_IMAGE_FILES = [
  "0a7e2d5c-9f41-4b86-8a3d-1c6f2e9b457d.jpg",
  "1e7a9c4d-b5f2-48a1-9c6e-3d0b8f241a57.jpg",
  "2b7f4a9d-6e18-4c5a-8f3d-91c2e0b6a457.jpg",
  "3a9c2f6d-8b41-4e7a-9c51-0d2f1e6a457b.jpg",
  "5cc07cc2-9fc7-4ae1-bc5b-b94deaaab131.jpg",
  "6a3d8f2c-b914-4e7a-9c51-0b2d4f1e8a97.jpg",
  "7d2f9c18-4b6a-42f1-8e3a-0c9b71d5a2e6.jpg",
  "8d1f2c6a-b457-4e9c-9a3b-5f0e7d21c684.jpg",
  "94c2a1f7-d6b5-4c8e-9a3f-2b7e51d0c684.webp",
  "9d2c7f1a-4b6e-48a5-8c3f-e1b0a57d9642.png",
  "a3f4b8d1-2e6a-4c9f-9c2a-1f7d8e0b45a1.jpg",
  "b2d6a9c4-7f18-4e5b-8a3c-91f0d2e6b457.jpg",
  "c8b41f6d-3a92-4e7c-9d51-2f8a0b6e94c1.jpg",
  "e91c6a74-8f2b-4a1d-b6e3-9c2f41a7d8b4.jpeg",
  "f1e8b5d2-7a9c-4c63-8a94-2d0b6e1f457c.png",
  "f6e1b4a9-2d8c-4c57-9a3f-0b7d51e6a842.jpg",
]

export const MEETUP_IMAGE_KEYS = MEETUP_IMAGE_FILES.map(
  (file) => `${MEETUP_IMAGE_BASE_PATH}/${file}`
)
