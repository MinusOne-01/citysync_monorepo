export type GeoResult = {
  latitude: number;
  longitude: number;
  label: string;
};

type NominatimResult = {
  display_name: string;
  lat: string;
  lon: string;
};

export async function geocodeSearch(query: string, limit = 5): Promise<GeoResult[]> {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    query
  )}&limit=${limit}`;

  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) return [];

  const data = (await res.json()) as NominatimResult[];
  return data.map((d) => ({
    latitude: Number(d.lat),
    longitude: Number(d.lon),
    label: d.display_name,
  }));
}

export function getBrowserLocation(): Promise<GeoResult> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error("Geolocation not supported"));

    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          label: "Current location",
        }),
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
}
