/**
 * ◈ @moon/compute — Prayer Times Calculator
 *
 * Uses the 'adhan' library for accurate Islamic prayer time calculation.
 * Isomorphic: runs in Node.js AND browser.
 *
 * Extracted from @moon/witness/astronomy for clean dependency isolation.
 */
import { Coordinates, CalculationMethod, PrayerTimes, Qibla } from 'adhan'

export interface PrayerData {
  currentPrayer: string
  nextPrayer: string
  nextPrayerTime: Date | null
  qiblaDirection: number
}

export interface DailyPrayerTimes {
  fajr: Date
  sunrise: Date
  dhuhr: Date
  asr: Date
  maghrib: Date
  isha: Date
}

const prayerMap: Record<string, string> = {
  fajr: 'FAJR',
  sunrise: 'SUNRISE',
  dhuhr: 'DHUHR',
  asr: 'ASR',
  maghrib: 'MAGHRIB',
  isha: 'ISHA',
  none: 'NONE'
}

export function getDailyPrayerTimes(lat: number, lng: number, date: Date): DailyPrayerTimes {
  const coordinates = new Coordinates(lat, lng)
  const params = CalculationMethod.MuslimWorldLeague()
  const prayerTimes = new PrayerTimes(coordinates, date, params)

  return {
    fajr: prayerTimes.fajr,
    sunrise: prayerTimes.sunrise,
    dhuhr: prayerTimes.dhuhr,
    asr: prayerTimes.asr,
    maghrib: prayerTimes.maghrib,
    isha: prayerTimes.isha
  }
}

export function getIslamicData(lat: number, lng: number, date: Date): PrayerData {
  const coordinates = new Coordinates(lat, lng)
  const params = CalculationMethod.MuslimWorldLeague()

  let prayerTimes = new PrayerTimes(coordinates, date, params)
  const qiblaDirection = Qibla(coordinates)

  let nextPrayer = prayerTimes.nextPrayer()
  let nextPrayerTime: Date | null = null
  let nextPrayerName = 'NONE'

  const currentPrayer = prayerTimes.currentPrayer()

  if (nextPrayer !== 'none') {
    nextPrayerTime = prayerTimes.timeForPrayer(nextPrayer)
    nextPrayerName = prayerMap[nextPrayer] || nextPrayer
  } else {
    const tomorrow = new Date(date)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowPrayerTimes = new PrayerTimes(coordinates, tomorrow, params)
    nextPrayerTime = tomorrowPrayerTimes.fajr
    nextPrayerName = 'FAJR'
  }

  return {
    currentPrayer: currentPrayer !== 'none' ? currentPrayer.toUpperCase() : 'NONE',
    nextPrayer: nextPrayerName,
    nextPrayerTime,
    qiblaDirection: parseFloat(qiblaDirection.toFixed(1))
  }
}

export interface DetailedPrayerTimesResult {
  date: string
  latitude: number
  longitude: number
  timezone_offset: number
  convention: string
  fajr: string
  sunrise: string
  dhuhr: string
  asr: string
  maghrib: string
  isha: string
  qibla_bearing: number
}

function hoursToTimeStr(hVal: number): string {
  let normalized = ((hVal % 24) + 24) % 24
  let h = Math.floor(normalized)
  let m = Math.round((normalized - h) * 60.0)
  if (m >= 60) {
    h = (h + 1) % 24
    m = 0
  }
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

import { calculateQiblaBearing } from './qibla.js'

export function calculateDetailedPrayerTimes(
  latitude: number,
  longitude: number,
  dateStr = '2026-09-06',
  timezoneOffset = 7.0,
  convention: 'KEMENAG' | 'MWL' | 'ISNA' | 'UMM_AL_QURA' = 'KEMENAG'
): DetailedPrayerTimesResult {
  let dt: Date
  try {
    const parts = dateStr.split('-').map(Number)
    dt = new Date(Date.UTC(parts[0] || 2026, (parts[1] || 9) - 1, parts[2] || 6))
  } catch {
    dt = new Date(Date.UTC(2026, 8, 6))
  }

  // Day of year
  const startOfYear = new Date(Date.UTC(dt.getUTCFullYear(), 0, 1))
  const dayOfYear = Math.floor((dt.getTime() - startOfYear.getTime()) / 86400000) + 1

  // Fractional year in radians
  const gamma = (2.0 * Math.PI / 365.25) * (dayOfYear - 1)

  // Equation of Time (minutes) - Spencer formula
  const eqt = 229.18 * (
    0.000075 +
    0.001868 * Math.cos(gamma) -
    0.032077 * Math.sin(gamma) -
    0.014615 * Math.cos(2.0 * gamma) -
    0.040849 * Math.sin(2.0 * gamma)
  )

  // Solar Declination in radians - Spencer formula
  const decl =
    0.006918 -
    0.399912 * Math.cos(gamma) +
    0.070257 * Math.sin(gamma) -
    0.006758 * Math.cos(2.0 * gamma) +
    0.000907 * Math.sin(2.0 * gamma) -
    0.002697 * Math.cos(3.0 * gamma) +
    0.00148 * Math.sin(3.0 * gamma)

  const phi = (latitude * Math.PI) / 180.0

  // Solar Transit (Solar Noon) in local standard time hours
  const solarTransit = 12.0 + (timezoneOffset * 15.0 - longitude) / 15.0 - (eqt / 60.0)

  // Helper for Hour Angle omega given solar altitude alphaDeg
  function hourAngle(alphaDeg: number): number {
    const alpha = (alphaDeg * Math.PI) / 180.0
    let cosOmega = (Math.sin(alpha) - Math.sin(phi) * Math.sin(decl)) /
      (Math.cos(phi) * Math.cos(decl))
    cosOmega = Math.max(-1.0, Math.min(1.0, cosOmega))
    return (Math.acos(cosOmega) * 180.0) / Math.PI
  }

  let fajrAngle = 20.0
  let ishaAngle = 18.0
  if (convention === 'MWL') {
    fajrAngle = 18.0
    ishaAngle = 17.0
  } else if (convention === 'ISNA') {
    fajrAngle = 15.0
    ishaAngle = 15.0
  } else if (convention === 'UMM_AL_QURA') {
    fajrAngle = 18.5
    ishaAngle = 18.5
  }

  // 1. Sunrise & Sunset (-0.833° accounting for refraction & solar semidiameter)
  const omegaSun = hourAngle(-0.833)
  const tSunrise = solarTransit - omegaSun / 15.0
  const tSunset = solarTransit + omegaSun / 15.0

  // 2. Fajr (Dawn)
  const omegaFajr = hourAngle(-fajrAngle)
  const tFajr = solarTransit - omegaFajr / 15.0

  // 3. Dhuhr (Transit + 2 minutes safety/ihtiyat)
  const tDhuhr = solarTransit + (2.0 / 60.0)

  // 4. Asr (Standard Shafi'i: shadow = object length + shadow at noon)
  const asrAltitudeRad = Math.atan(1.0 / (1.0 + Math.tan(Math.abs(phi - decl))))
  const omegaAsr = hourAngle((asrAltitudeRad * 180.0) / Math.PI)
  const tAsr = solarTransit + omegaAsr / 15.0

  // 5. Maghrib (Sunset + 2 minutes ihtiyat)
  const tMaghrib = tSunset + (2.0 / 60.0)

  // 6. Isha
  let tIsha: number
  if (convention === 'UMM_AL_QURA') {
    tIsha = tMaghrib + 1.5 // Fixed 90 minutes after Maghrib
  } else {
    const omegaIsha = hourAngle(-ishaAngle)
    tIsha = solarTransit + omegaIsha / 15.0
  }

  const qibla = calculateQiblaBearing(latitude, longitude)

  return {
    date: dateStr,
    latitude: parseFloat(latitude.toFixed(4)),
    longitude: parseFloat(longitude.toFixed(4)),
    timezone_offset: parseFloat(timezoneOffset.toFixed(2)),
    convention,
    fajr: hoursToTimeStr(tFajr),
    sunrise: hoursToTimeStr(tSunrise),
    dhuhr: hoursToTimeStr(tDhuhr),
    asr: hoursToTimeStr(tAsr),
    maghrib: hoursToTimeStr(tMaghrib),
    isha: hoursToTimeStr(tIsha),
    qibla_bearing: qibla.qibla_bearing_deg,
  }
}

