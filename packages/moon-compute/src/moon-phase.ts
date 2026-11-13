/**
 * ◈ @moon/compute — Moon Phase Calculator
 *
 * Pure astronomical computation — no database, no network.
 * Isomorphic: runs in Node.js AND browser.
 *
 * Extracted from @moon/witness/astronomy for clean dependency isolation.
 */

export interface MoonData {
  phaseName: string
  illumination: number
  distance: number
}

export const LUNAR_MONTH = 29.53058770576
export const KNOWN_NEW_MOON = new Date(Date.UTC(2024, 0, 11, 11, 57)).getTime()
export const ANOMALISTIC_MONTH = 27.55455
export const KNOWN_PERIGEE = new Date(Date.UTC(2024, 0, 13, 10, 34)).getTime()

export function getMoonData(date: Date): MoonData {
  const days = (date.getTime() - KNOWN_NEW_MOON) / (1000 * 60 * 60 * 24)
  const phase = (days / LUNAR_MONTH) - Math.floor(days / LUNAR_MONTH)
  const illumination = ((1 - Math.cos(phase * 2 * Math.PI)) / 2) * 100

  let phaseName = ''
  if (phase < 0.02 || phase > 0.98) phaseName = 'NEW MOON'
  else if (phase < 0.23) phaseName = 'WAXING CRESCENT'
  else if (phase < 0.27) phaseName = 'FIRST QUARTER'
  else if (phase < 0.48) phaseName = 'WAXING GIBBOUS'
  else if (phase < 0.52) phaseName = 'FULL MOON'
  else if (phase < 0.73) phaseName = 'WANING GIBBOUS'
  else if (phase < 0.77) phaseName = 'LAST QUARTER'
  else phaseName = 'WANING CRESCENT'

  const daysPerigee = (date.getTime() - KNOWN_PERIGEE) / (1000 * 60 * 60 * 24)
  const phasePerigee = (daysPerigee / ANOMALISTIC_MONTH) - Math.floor(daysPerigee / ANOMALISTIC_MONTH)
  const distance = 362600 + (405400 - 362600) * ((1 - Math.cos(phasePerigee * 2 * Math.PI)) / 2)

  return {
    phaseName,
    illumination: parseFloat(illumination.toFixed(1)),
    distance: Math.round(distance)
  }
}

export interface DetailedLunarPhase {
  phase_name: string
  illumination_fraction: number
  age_days: number
  elongation_degrees: number
}

export function calculateLunarPhaseCycle(daysSinceNewMoon: number): DetailedLunarPhase {
  const synodicMonth = 29.53058867
  const cycleFraction = (((daysSinceNewMoon % synodicMonth) + synodicMonth) % synodicMonth) / synodicMonth
  const phaseAngle = cycleFraction * 2 * Math.PI
  const elongation = cycleFraction * 360.0

  const illumination = (1.0 + Math.cos(phaseAngle + Math.PI)) / 2.0

  let name = ''
  if (elongation < 1.0 || elongation >= 359.0) {
    name = 'New Moon'
  } else if (elongation < 89.0) {
    name = 'Waxing Crescent'
  } else if (elongation <= 91.0) {
    name = 'First Quarter'
  } else if (elongation < 179.0) {
    name = 'Waxing Gibbous'
  } else if (elongation <= 181.0) {
    name = 'Full Moon'
  } else if (elongation < 269.0) {
    name = 'Waning Gibbous'
  } else if (elongation <= 271.0) {
    name = 'Last Quarter'
  } else {
    name = 'Waning Crescent'
  }

  return {
    phase_name: name,
    illumination_fraction: parseFloat(illumination.toFixed(4)),
    age_days: parseFloat((daysSinceNewMoon % synodicMonth).toFixed(2)),
    elongation_degrees: parseFloat(elongation.toFixed(2)),
  }
}

