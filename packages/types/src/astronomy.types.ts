// Celestial Telemetry & Astronomy Matrix Domain Types

export interface CelestialCoordinates {
  latitude: number
  longitude: number
  altitude?: number
}

export interface PrayerSchedule {
  Fajr: string
  Sunrise?: string
  Dhuhr: string
  Asr: string
  Sunset?: string
  Maghrib: string
  Isha: string
  Imsak?: string
  Midnight?: string
}

export interface PrayerData {
  city: string
  nextPrayer: string
  nextPrayerTime: string
  countdown: string
  status: "ONLINE" | "SYNCING" | "OFFLINE"
  schedule: PrayerSchedule
}

export interface PrayerItem {
  name: string
  time: string
  passed: boolean
  current?: boolean
  countdown?: string
}

export interface MoonData {
  azimuth: string
  altitude: string
  distance: string
  illumination: string
  visibility: string
  phaseName?: string
}

export interface LunarDayItem {
  hijriDay: number
  gregorianDate: string
  phaseName: string
  illumination: number
  isAyyamulBidh: boolean
  moonrise: string
  moonset: string
  icon: string
}

export interface EclipseEvent {
  dateStr: string
  type: "LUNAR" | "SOLAR"
  title: string
  visibility: string
  duration: string
  prayerGuidance: string
}

export interface QiblaVector {
  directionDegrees: number
  distanceKm: number
  compassHeading: number
  isAligned: boolean
}
