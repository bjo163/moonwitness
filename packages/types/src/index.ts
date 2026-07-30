// Core Monorepo Types for MoonWitness OS

import type { ElementType } from "react"

export interface PrayerData {
  city: string
  nextPrayer: string
  nextPrayerTime: string
  countdown: string
  status: "ONLINE" | "SYNCING" | "OFFLINE"
  schedule: {
    Fajr: string
    Dhuhr: string
    Asr: string
    Maghrib: string
    Isha: string
  }
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

export interface SubNavLink {
  label: string
  href: string
  icon: string | ElementType
}
