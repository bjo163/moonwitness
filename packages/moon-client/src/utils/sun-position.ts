/* eslint-disable @typescript-eslint/no-magic-numbers -- Solar altitude algorithms require precise geometric constants */
/**
 * Client-side Sun Position Calculator
 * Pure astronomical algorithms (Jean Meeus).
 */

export type SunInfo = {
  altitude: number
  label: string
  isInDuhaWindow: boolean
  duhaStatus: "BEFORE" | "ACTIVE" | "AFDHAL" | "ENDED" | "NIGHT"
  duhaLabel: string
}

function deg2rad(d: number): number {
  return (d * Math.PI) / 180
}
function rad2deg(r: number): number {
  return (r * 180) / Math.PI
}

function julianDay(date: Date): number {
  const time = date.getTime()
  return time / 86400000 + 2440587.5
}

function sunCoordinates(jd: number): { ra: number; dec: number } {
  const d = jd - 2451545.0
  const g = 357.529 + 0.98560028 * d
  const q = 280.459 + 0.98564736 * d
  const L = q + 1.915 * Math.sin(deg2rad(g)) + 0.02 * Math.sin(deg2rad(2 * g))
  const e = 23.439 - 0.00000036 * d

  const ra = rad2deg(
    Math.atan2(
      Math.cos(deg2rad(e)) * Math.sin(deg2rad(L)),
      Math.cos(deg2rad(L))
    )
  )
  const dec = rad2deg(Math.asin(Math.sin(deg2rad(e)) * Math.sin(deg2rad(L))))

  return { ra: (ra + 360) % 360, dec }
}

function gmst(jd: number): number {
  const d = jd - 2451545.0
  const g = 18.697374558 + 24.06570982441908 * d
  return ((g % 24) + 24) % 24
}

export function calculateSunAltitude(
  date: Date = new Date(),
  lat: number = -6.2088, // Default: Jakarta
  lng: number = 106.8456
): number {
  const jd = julianDay(date)
  const { ra, dec } = sunCoordinates(jd)

  const gmstHours = gmst(jd)
  const lmstDeg = ((gmstHours * 15 + lng) % 360 + 360) % 360
  const haDeg = ((lmstDeg - ra) % 360 + 360) % 360

  const sinAlt =
    Math.sin(deg2rad(lat)) * Math.sin(deg2rad(dec)) +
    Math.cos(deg2rad(lat)) * Math.cos(deg2rad(dec)) * Math.cos(deg2rad(haDeg))

  return rad2deg(Math.asin(Math.max(-1, Math.min(1, sinAlt))))
}

export function getSunInfo(
  date: Date = new Date(),
  lat: number = -6.2088,
  lng: number = 106.8456
): SunInfo {
  const altitude = calculateSunAltitude(date, lat, lng)
  const roundedAlt = Math.round(altitude * 10) / 10

  let label: string
  if (altitude < -18) label = "NIGHT (ASTRONOMICAL)"
  else if (altitude < -12) label = "NAUTICAL TWILIGHT"
  else if (altitude < -6) label = "CIVIL TWILIGHT"
  else if (altitude < 0) label = "SUNSET / SUNRISE HORIZON"
  else if (altitude < 15) label = "EARLY MORNING / LATE AFTERNOON"
  else if (altitude < 45) label = "MID MORNING / AFTERNOON"
  else if (altitude < 75) label = "LATE MORNING / EARLY AFTERNOON"
  else label = "SOLAR NOON (ZENITH)"

  let duhaStatus: SunInfo["duhaStatus"]
  let duhaLabel: string
  let isInDuhaWindow = false

  const hours = date.getHours() + date.getMinutes() / 60
  const isMorning = hours >= 5 && hours < 12

  if (altitude < 0) {
    duhaStatus = "NIGHT"
    duhaLabel = "NIGHT — Awaiting Fajr & Sunrise"
  } else if (altitude < 3.5 && isMorning) {
    duhaStatus = "BEFORE"
    duhaLabel = `BEFORE DUHA (${roundedAlt}° — Need ~3.5°)`
  } else if (altitude >= 3.5 && altitude < 15 && isMorning) {
    duhaStatus = "ACTIVE"
    duhaLabel = `DUHA ACTIVE (${roundedAlt}° — Valid Window)`
    isInDuhaWindow = true
  } else if (altitude >= 15 && altitude < 60 && isMorning) {
    duhaStatus = "AFDHAL"
    duhaLabel = `DUHA AFDHAL (${roundedAlt}° — Most Virtuous Window)`
    isInDuhaWindow = true
  } else if (isMorning && altitude >= 60) {
    duhaStatus = "ENDED"
    duhaLabel = `DUHA ENDED — Sun at Zenith (${roundedAlt}°)`
  } else {
    duhaStatus = "ENDED"
    duhaLabel = `AFTERNOON (${roundedAlt}° — Duha Closed)`
  }

  return {
    altitude: roundedAlt,
    label,
    isInDuhaWindow,
    duhaStatus,
    duhaLabel,
  }
}
