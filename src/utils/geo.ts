/**
 * Haversine formula — returns distance in meters between two lat/lng points.
 */
export const haversineDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number => {
  const R = 6_371_000 // Earth radius in meters
  const toRad = (deg: number) => (deg * Math.PI) / 180

  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}

/**
 * Formats a distance in meters to a human-readable string.
 * e.g. 322 → "322 m", 2100 → "2.1 km"
 */
export const formatDistance = (meters: number): string => {
  if (meters < 1000) {
    return `${Math.round(meters)} m`
  }
  return `${(meters / 1000).toFixed(1)} km`
}
