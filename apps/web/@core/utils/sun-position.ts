/**
 * Client-side Sun Position Calculator
 * 
 * Lightweight version for use in the taskbar/footer.
 * Computes real-time solar altitude and Duha status using
 * pure astronomical algorithms (Jean Meeus).
 * 
 * This is the same algorithm used in @moon/witness/sun-position.ts
 * but bundled for client-side use without server round-trip.
 */

export type SunInfo = {
  /** Solar altitude above horizon in degrees */
  altitude: number
  /** Descriptive label */
  label: string
  /** Whether currently in Duha window */
  isInDuhaWindow: boolean
  /** Duha status */
  duhaStatus: 'BEFORE' | 'ACTIVE' | 'AFDHAL' | 'ENDED' | 'NIGHT'
  /** Duha status label for display */
  duhaLabel: string
}

// ── Math helpers ──

function deg2rad(d: number): number { return (d * Math.PI) / 180 }
function rad2deg(r: number): number { return (r * 180) / Math.PI }
function unwind(a: number): number { return a - 360 * Math.floor(a / 360) }

/**
 * Compute solar altitude for a given lat/lng/date.
 * Based on Jean Meeus "Astronomical Algorithms".
 */
export function calculateSunAltitude(
  lat: number,
  lng: number,
  date: Date = new Date()
): number {
  const utcH = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600

  // Julian Day
  const y = date.getUTCFullYear()
  const mo = date.getUTCMonth() + 1
  const d = date.getUTCDate()
  const Y = Math.trunc(mo > 2 ? y : y - 1)
  const M = Math.trunc(mo > 2 ? mo : mo + 12)
  const D = d + utcH / 24
  const A = Math.trunc(Y / 100)
  const B = Math.trunc(2 - A + Math.trunc(A / 4))
  const JD = Math.trunc(365.25 * (Y + 4716)) + Math.trunc(30.6001 * (M + 1)) + D + B - 1524.5
  const T = (JD - 2451545.0) / 36525

  // Solar coordinates
  const L0 = unwind(280.4664567 + 36000.76983 * T + 0.0003032 * T * T)
  const Ma = unwind(357.52911 + 35999.05029 * T - 0.0001537 * T * T)
  const Mr = deg2rad(Ma)
  const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mr) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * Mr) + 0.000289 * Math.sin(3 * Mr)
  const sunLng = L0 + C
  const Omega = 125.04 - 1934.136 * T
  const Lambda = deg2rad(unwind(sunLng - 0.00569 - 0.00478 * Math.sin(deg2rad(Omega))))

  const Eps0 = 23.439291 - 0.013004167 * T - 0.0000001639 * T * T + 0.0000005036 * T * T * T
  const EpsApp = deg2rad(Eps0 + 0.00256 * Math.cos(deg2rad(Omega)))

  // Declination
  const decl = rad2deg(Math.asin(Math.sin(EpsApp) * Math.sin(Lambda)))

  // Right ascension
  const ra = unwind(rad2deg(Math.atan2(Math.cos(EpsApp) * Math.sin(Lambda), Math.cos(Lambda))))

  // Sidereal time + nutation
  const Theta0 = unwind(280.46061837 + 360.98564736629 * (JD - 2451545) + 0.000387933 * T * T - T * T * T / 38710000)
  const Lp = unwind(218.3165 + 481267.8813 * T)
  const ascNode = unwind(125.04452 - 1934.136261 * T + 0.0020708 * T * T + T * T * T / 450000)
  const dPsi = (-17.2 / 3600) * Math.sin(deg2rad(ascNode)) - (1.32 / 3600) * Math.sin(2 * deg2rad(L0)) - (0.23 / 3600) * Math.sin(2 * deg2rad(Lp)) + (0.21 / 3600) * Math.sin(2 * deg2rad(ascNode))
  const dEps = (9.2 / 3600) * Math.cos(deg2rad(ascNode)) + (0.57 / 3600) * Math.cos(2 * deg2rad(L0)) + (0.1 / 3600) * Math.cos(2 * deg2rad(Lp)) - (0.09 / 3600) * Math.cos(2 * deg2rad(ascNode))
  const appST = Theta0 + (dPsi * 3600 * Math.cos(deg2rad(Eps0 + dEps))) / 3600

  // Hour angle
  const localST = unwind(appST + lng)
  let H = localST - ra
  if (H > 180) H -= 360
  if (H < -180) H += 360

  // Altitude
  const sinAlt = Math.sin(deg2rad(lat)) * Math.sin(deg2rad(decl)) +
    Math.cos(deg2rad(lat)) * Math.cos(deg2rad(decl)) * Math.cos(deg2rad(H))

  return rad2deg(Math.asin(Math.max(-1, Math.min(1, sinAlt))))
}

/**
 * Calculate comprehensive sun info for taskbar display.
 * Includes altitude, position label, and Duha status.
 */
export function calculateSunInfo(
  lat: number,
  lng: number,
  date: Date = new Date()
): SunInfo {
  const altitude = calculateSunAltitude(lat, lng, date)

  // Position label
  let label = 'NIGHT'
  if (altitude > 80) label = 'ZENITH'
  else if (altitude > 60) label = 'HIGH'
  else if (altitude > 30) label = 'MID'
  else if (altitude > 15) label = 'RISING'
  else if (altitude > 0) label = 'LOW'
  else label = 'NIGHT'

  // Duha status estimate:
  // Duha window is roughly when sun altitude is between ~5° (after sunrise+15min)
  // and before transit (when altitude is at maximum). 
  // Afdhal zone: when altitude is above ~70% of max for the day.
  // We use a simplified approach: altitude > 5° and hour angle < 0 (before noon).
  const utcH = date.getUTCHours() + date.getUTCMinutes() / 60
  const localApproxHour = (utcH + lng / 15 + 24) % 24

  let duhaStatus: SunInfo['duhaStatus'] = 'NIGHT'
  let duhaLabel = ''
  let isInDuhaWindow = false

  if (altitude <= 0) {
    duhaStatus = 'NIGHT'
    duhaLabel = ''
  } else if (localApproxHour >= 12) {
    // After solar noon — Duha has ended
    duhaStatus = 'ENDED'
    duhaLabel = ''
  } else if (altitude < 5) {
    // Sun just rose but not yet Isyraq height
    duhaStatus = 'BEFORE'
    duhaLabel = 'PRE-DUHA'
  } else if (altitude >= 5 && altitude < 45) {
    duhaStatus = 'ACTIVE'
    duhaLabel = 'DUHA'
    isInDuhaWindow = true
  } else {
    // altitude >= 45 and before noon = afdhal zone
    duhaStatus = 'AFDHAL'
    duhaLabel = 'AFDHAL ✦'
    isInDuhaWindow = true
  }

  return {
    altitude: parseFloat(altitude.toFixed(1)),
    label,
    isInDuhaWindow,
    duhaStatus,
    duhaLabel,
  }
}
