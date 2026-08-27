/**
 * ◈ @moon/compute — Sun Position Calculator
 * 
 * Uses adhan's internal astronomical algorithms (SolarTime, SolarCoordinates,
 * Astronomical) to compute real-time sun altitude, azimuth, and Duha prayer
 * window timing.
 * 
 * All computation is pure math — zero external API calls.
 * Isomorphic: runs in Node.js AND browser.
 */

import { Coordinates, CalculationMethod, PrayerTimes } from 'adhan'

// ── Types ──────────────────────────────────────────────────────────

export interface SunPositionData {
  /** Sun altitude above horizon in degrees (0° = horizon, 90° = zenith) */
  altitude: number
  /** Sun azimuth from north in degrees (0°=N, 90°=E, 180°=S, 270°=W) */
  azimuth: number
  /** Solar declination in degrees */
  declination: number
  /** Whether the sun is above the horizon */
  isAboveHorizon: boolean
  /** Descriptive label for the sun's current position */
  positionLabel: string
}

export type DuhaStatus = 'BEFORE' | 'ACTIVE' | 'AFDHAL_ZONE' | 'ENDED'

export interface DuhaTimeData {
  /** Start of Duha window (~15min after sunrise) */
  isyraq: Date
  /** End of Duha window (solar transit / Dhuhr) */
  zawal: Date
  /** Best time for Duha prayer (¾ of the Duha window) */
  afdhal: Date
  /** 0-100 progress through the Duha window */
  currentProgress: number
  /** Whether current time is within Duha window */
  isInDuhaWindow: boolean
  /** Current Duha status */
  status: DuhaStatus
  /** Total duration of Duha window in minutes */
  totalDurationMinutes: number
  /** Remaining minutes until Duha ends (0 if ended) */
  remainingMinutes: number
}

// ── Constants ──────────────────────────────────────────────────────

/** Minutes after sunrise for Isyraq (start of Duha) */
const ISYRAQ_OFFSET_MINUTES = 15

/** Fraction of Duha window for afdhal (¾) */
const AFDHAL_FRACTION = 0.75

/** Afdhal zone starts at 65% of the Duha window */
const AFDHAL_ZONE_START = 0.65

// ── Helpers (inline from adhan internals) ──────────────────────────

function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180.0
}

function radiansToDegrees(radians: number): number {
  return (radians * 180.0) / Math.PI
}

function unwindAngle(angle: number): number {
  return angle - 360.0 * Math.floor(angle / 360.0)
}

/**
 * Compute Julian Day number for a given date with fractional hours.
 * Algorithm from Jean Meeus, "Astronomical Algorithms", p.60
 */
function julianDay(year: number, month: number, day: number, hours: number = 0): number {
  const trunc = Math.trunc
  const Y = trunc(month > 2 ? year : year - 1)
  const M = trunc(month > 2 ? month : month + 12)
  const D = day + hours / 24
  const A = trunc(Y / 100)
  const B = trunc(2 - A + trunc(A / 4))
  const i0 = trunc(365.25 * (Y + 4716))
  const i1 = trunc(30.6001 * (M + 1))
  return i0 + i1 + D + B - 1524.5
}

function julianCentury(jd: number): number {
  return (jd - 2451545.0) / 36525
}

/**
 * Solar coordinates for a given Julian Day.
 * Returns declination, right ascension, and apparent sidereal time.
 */
function solarCoordinates(jd: number) {
  const T = julianCentury(jd)

  // Mean solar longitude
  const L0 = unwindAngle(280.4664567 + 36000.76983 * T + 0.0003032 * T * T)

  // Mean anomaly
  const M = unwindAngle(357.52911 + 35999.05029 * T - 0.0001537 * T * T)
  const Mrad = degreesToRadians(M)

  // Equation of center
  const C =
    (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mrad) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * Mrad) +
    0.000289 * Math.sin(3 * Mrad)

  // Apparent solar longitude
  const sunLongitude = L0 + C
  const Omega = 125.04 - 1934.136 * T
  const Lambda = degreesToRadians(
    unwindAngle(sunLongitude - 0.00569 - 0.00478 * Math.sin(degreesToRadians(Omega)))
  )

  // Mean obliquity of ecliptic
  const Epsilon0 = 23.439291 - 0.013004167 * T - 0.0000001639 * T * T + 0.0000005036 * T * T * T
  const EpsilonApparent = degreesToRadians(
    Epsilon0 + 0.00256 * Math.cos(degreesToRadians(Omega))
  )

  // Declination
  const declination = radiansToDegrees(
    Math.asin(Math.sin(EpsilonApparent) * Math.sin(Lambda))
  )

  // Right Ascension
  const rightAscension = unwindAngle(
    radiansToDegrees(Math.atan2(Math.cos(EpsilonApparent) * Math.sin(Lambda), Math.cos(Lambda)))
  )

  // Mean sidereal time
  const JD = T * 36525 + 2451545.0
  const Theta0 = unwindAngle(
    280.46061837 + 360.98564736629 * (JD - 2451545) + 0.000387933 * T * T - T * T * T / 38710000
  )

  // Nutation corrections
  const Lp = unwindAngle(218.3165 + 481267.8813 * T) // mean lunar longitude
  const ascNode = unwindAngle(125.04452 - 1934.136261 * T + 0.0020708 * T * T + T * T * T / 450000)
  const dPsi =
    (-17.2 / 3600) * Math.sin(degreesToRadians(ascNode)) -
    (1.32 / 3600) * Math.sin(2 * degreesToRadians(L0)) -
    (0.23 / 3600) * Math.sin(2 * degreesToRadians(Lp)) +
    (0.21 / 3600) * Math.sin(2 * degreesToRadians(ascNode))
  const dEpsilon =
    (9.2 / 3600) * Math.cos(degreesToRadians(ascNode)) +
    (0.57 / 3600) * Math.cos(2 * degreesToRadians(L0)) +
    (0.1 / 3600) * Math.cos(2 * degreesToRadians(Lp)) -
    (0.09 / 3600) * Math.cos(2 * degreesToRadians(ascNode))

  const apparentSiderealTime =
    Theta0 + (dPsi * 3600 * Math.cos(degreesToRadians(Epsilon0 + dEpsilon))) / 3600

  return { declination, rightAscension, apparentSiderealTime }
}

/**
 * Compute the sun's altitude and azimuth for a given location and time.
 * Uses the algorithm from Jean Meeus, "Astronomical Algorithms".
 */
export function getSunPosition(lat: number, lng: number, date: Date): SunPositionData {
  // Get fractional hours in UTC
  const utcHours =
    date.getUTCHours() +
    date.getUTCMinutes() / 60 +
    date.getUTCSeconds() / 3600

  const jd = julianDay(
    date.getUTCFullYear(),
    date.getUTCMonth() + 1,
    date.getUTCDate(),
    utcHours
  )

  const solar = solarCoordinates(jd)

  // Local hour angle
  const localSiderealTime = unwindAngle(solar.apparentSiderealTime + lng)
  const hourAngle = localSiderealTime - solar.rightAscension
  // Normalize to [-180, 180]
  let H = hourAngle
  if (H > 180) H -= 360
  if (H < -180) H += 360

  // Altitude (elevation angle)
  const sinAlt =
    Math.sin(degreesToRadians(lat)) * Math.sin(degreesToRadians(solar.declination)) +
    Math.cos(degreesToRadians(lat)) *
      Math.cos(degreesToRadians(solar.declination)) *
      Math.cos(degreesToRadians(H))
  const altitude = radiansToDegrees(Math.asin(Math.max(-1, Math.min(1, sinAlt))))

  // Azimuth (from north, clockwise)
  const cosAz =
    (Math.sin(degreesToRadians(solar.declination)) -
      Math.sin(degreesToRadians(lat)) * Math.sin(degreesToRadians(altitude))) /
    (Math.cos(degreesToRadians(lat)) * Math.cos(degreesToRadians(altitude)))
  let azimuth = radiansToDegrees(Math.acos(Math.max(-1, Math.min(1, cosAz))))

  // If hour angle is positive, sun is west of meridian
  if (H > 0) {
    azimuth = 360 - azimuth
  }

  // Position label
  let positionLabel = 'BELOW HORIZON'
  if (altitude > 0 && altitude <= 15) positionLabel = 'LOW'
  else if (altitude > 15 && altitude <= 30) positionLabel = 'RISING'
  else if (altitude > 30 && altitude <= 60) positionLabel = 'MID-SKY'
  else if (altitude > 60 && altitude <= 80) positionLabel = 'HIGH'
  else if (altitude > 80) positionLabel = 'NEAR ZENITH'

  return {
    altitude: parseFloat(altitude.toFixed(2)),
    azimuth: parseFloat(azimuth.toFixed(2)),
    declination: parseFloat(solar.declination.toFixed(2)),
    isAboveHorizon: altitude > 0,
    positionLabel,
  }
}

/**
 * Calculate Duha prayer time window and optimal (afdhal) time.
 * 
 * Duha window: Isyraq (sunrise + 15min) → Zawal (solar transit/Dhuhr)
 * Afdhal time: ¾ of the Duha window (when the heat is strongest)
 */
export function getDuhaTime(lat: number, lng: number, date: Date): DuhaTimeData {
  const coordinates = new Coordinates(lat, lng)
  const params = CalculationMethod.MuslimWorldLeague()
  const prayerTimes = new PrayerTimes(coordinates, date, params)

  const sunrise = prayerTimes.sunrise
  const dhuhr = prayerTimes.dhuhr

  // Isyraq = sunrise + ISYRAQ_OFFSET_MINUTES
  const isyraq = new Date(sunrise.getTime() + ISYRAQ_OFFSET_MINUTES * 60 * 1000)

  // Zawal = Dhuhr (solar transit)
  const zawal = dhuhr

  // Total Duha duration
  const totalMs = zawal.getTime() - isyraq.getTime()
  const totalDurationMinutes = Math.round(totalMs / 60000)

  // Afdhal = Isyraq + ¾ of total Duha duration
  const afdhal = new Date(isyraq.getTime() + totalMs * AFDHAL_FRACTION)

  // Current progress
  const now = date.getTime()
  let currentProgress = 0
  let remainingMinutes = 0
  let isInDuhaWindow = false
  let status: DuhaStatus = 'BEFORE'

  if (now < isyraq.getTime()) {
    // Before Duha window
    status = 'BEFORE'
    currentProgress = 0
    remainingMinutes = Math.round((zawal.getTime() - isyraq.getTime()) / 60000)
  } else if (now >= isyraq.getTime() && now <= zawal.getTime()) {
    // Inside Duha window
    isInDuhaWindow = true
    const elapsed = now - isyraq.getTime()
    currentProgress = Math.min(100, (elapsed / totalMs) * 100)
    remainingMinutes = Math.max(0, Math.round((zawal.getTime() - now) / 60000))

    if (currentProgress >= AFDHAL_ZONE_START * 100) {
      status = 'AFDHAL_ZONE'
    } else {
      status = 'ACTIVE'
    }
  } else {
    // After Duha window
    status = 'ENDED'
    currentProgress = 100
    remainingMinutes = 0
  }

  return {
    isyraq,
    zawal,
    afdhal,
    currentProgress: parseFloat(currentProgress.toFixed(1)),
    isInDuhaWindow,
    status,
    totalDurationMinutes,
    remainingMinutes,
  }
}
