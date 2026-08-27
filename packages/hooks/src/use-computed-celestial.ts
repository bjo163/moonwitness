"use client"

import { useMemo } from "react"
import {
  getMoonData,
  getIslamicData,
  getDailyPrayerTimes,
  getSunPosition,
  getDuhaTime,
  type MoonData,
  type PrayerData,
  type DailyPrayerTimes,
  type SunPositionData,
  type DuhaTimeData,
} from "@moon/compute"

export interface ComputedCelestialData {
  moon: MoonData
  prayer: PrayerData
  dailyPrayers: DailyPrayerTimes
  sun: SunPositionData
  duha: DuhaTimeData
  timestamp: string
}

export interface UseComputedCelestialOptions {
  lat?: number
  lng?: number
  date?: Date
}

const DEFAULT_LAT = -6.2088
const DEFAULT_LNG = 106.8456

/**
 * ◈ useComputedCelestial — Instant 0ms Offline Celestial Mechanics Hook
 *
 * Runs pure astronomical calculations on-device via @moon/compute.
 * Zero network requests, zero database queries, 100% offline PWA support.
 */
export function useComputedCelestial(options: UseComputedCelestialOptions = {}): ComputedCelestialData {
  const lat = options.lat ?? DEFAULT_LAT
  const lng = options.lng ?? DEFAULT_LNG
  const date = options.date ?? new Date()

  return useMemo(() => {
    const moon = getMoonData(date)
    const prayer = getIslamicData(lat, lng, date)
    const dailyPrayers = getDailyPrayerTimes(lat, lng, date)
    const sun = getSunPosition(lat, lng, date)
    const duha = getDuhaTime(lat, lng, date)

    return {
      moon,
      prayer,
      dailyPrayers,
      sun,
      duha,
      timestamp: date.toISOString(),
    }
  }, [lat, lng, date.getTime()])
}
