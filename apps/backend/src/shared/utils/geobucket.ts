export function regionKey(
  lat: number,
  lng: number,
  precision = 2
): string {
  return `${lat.toFixed(precision)}:${lng.toFixed(precision)}`;
}
