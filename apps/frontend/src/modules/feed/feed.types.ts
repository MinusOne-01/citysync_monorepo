export type FeedCursor = {
  startTime: string;
  meetupId: string;
};

export type FeedItem = {
  distance: number;
  score: number;
  _count: {
    participants: number;
  };
  id: string;
  organizerId: string;
  title: string;
  description: string | null;
  startTime: string;
  capacity: number | null;
  status: "DRAFT" | "PUBLISHED" | "CANCELLED" | "ENDED";
  latitude: number;
  longitude: number;
  city: string | null;
  area: string | null;
  placeName: string | null;
  meetupImageKey: string;
  imageUrl: string;
  createdAt: string;
};

export type FeedResponse = {
  items: FeedItem[];
  nextCursor: FeedCursor | null;
};

export type FeedParams = {
  latitude: number;
  longitude: number;
  radiusKm?: number;
  limit?: number;
  cursor?: FeedCursor | null;
};
