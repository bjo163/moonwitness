/**
 * ◈ @moon/compute — Qibla Bearing & Geodesic Distance Engine
 *
 * High-precision spherical trigonometry calculating forward azimuth and
 * great-circle distance to the Holy Ka'bah in Makkah al-Mukarramah.
 *
 * Isomorphic: runs in Node.js, Bun, Edge, and browser runtimes.
 */

// Holy Ka'bah Sanctuary Coordinates (WGS84 datum)
export const KAABA_LATITUDE = 21.422487
export const KAABA_LONGITUDE = 39.826206
export const EARTH_MEAN_RADIUS_KM = 6371.0088

export interface QiblaCalculationResult {
  latitude: number
  longitude: number
  qibla_bearing_deg: number
  bearing_degrees?: number
  cardinal_direction: string
  compass_direction?: string
  distance_to_kabah_km: number
  distance_km?: number
  target: string
}

const COMPASS_POINTS = [
  "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
  "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW",
] as const

export function degreesToCompass(degrees: number): string {
  const normalized = ((degrees % 360) + 360) % 360
  const index = Math.floor((normalized + 11.25) / 22.5) % 16
  return COMPASS_POINTS[index] || "N"
}

function toRadians(deg: number): number {
  return (deg * Math.PI) / 180.0
}

function toDegrees(rad: number): number {
  return (rad * 180.0) / Math.PI
}

/**
 * Calculates forward azimuth bearing from observer coordinates to the Ka'bah,
 * along with the geodesic Haversine distance in kilometers.
 */
export function calculateQiblaBearing(
  latitude: number,
  longitude: number
): QiblaCalculationResult {
  const phi1 = toRadians(latitude)
  const phi2 = toRadians(KAABA_LATITUDE)
  const deltaLambda = toRadians(KAABA_LONGITUDE - longitude)

  // Spherical forward azimuth formula
  const y = Math.sin(deltaLambda) * Math.cos(phi2)
  const x =
    Math.cos(phi1) * Math.sin(phi2) -
    Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda)

  const bearingRad = Math.atan2(y, x)
  const bearingDeg = (toDegrees(bearingRad) + 360.0) % 360.0

  // Great-circle Haversine distance
  const deltaPhi = phi2 - phi1
  const sinHalfDeltaPhi = Math.sin(deltaPhi / 2.0)
  const sinHalfDeltaLambda = Math.sin(deltaLambda / 2.0)

  const a =
    sinHalfDeltaPhi * sinHalfDeltaPhi +
    Math.cos(phi1) * Math.cos(phi2) * sinHalfDeltaLambda * sinHalfDeltaLambda
  const c = 2.0 * Math.atan2(Math.sqrt(a), Math.sqrt(Math.max(0.0, 1.0 - a)))
  const distanceKm = EARTH_MEAN_RADIUS_KM * c

  const roundedBearing = parseFloat(bearingDeg.toFixed(2))
  const roundedDist = parseFloat(distanceKm.toFixed(1))
  const compass = degreesToCompass(roundedBearing)

  return {
    latitude: parseFloat(latitude.toFixed(6)),
    longitude: parseFloat(longitude.toFixed(6)),
    qibla_bearing_deg: roundedBearing,
    bearing_degrees: roundedBearing,
    cardinal_direction: compass,
    compass_direction: compass,
    distance_to_kabah_km: roundedDist,
    distance_km: roundedDist,
    target: "Ka'bah, Makkah al-Mukarramah",
  }
}
