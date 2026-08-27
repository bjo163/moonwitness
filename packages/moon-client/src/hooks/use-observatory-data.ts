"use client"
/* eslint-disable @typescript-eslint/no-magic-numbers -- Math constants are heavily used for celestial telemetry */

import { useState, useEffect } from "react"

export type ObservatoryData = {
  loading: boolean
  moon: {
    age: string
    illumination: string
    phaseName: string
    visibility: string
    nextFullMoon: string
  }
  hijri: {
    day: string
    month: string
    year: string
    weekdayEn: string
    weekdayAr: string
  }
  qibla: string
  sun: {
    sunrise: string
    sunset: string
  }
}

function getMoonData() {
  const LUNAR_MONTH = 29.53058867
  const KNOWN_NEW_MOON = new Date("2000-01-06T18:14:00Z").getTime()
  const now = new Date()

  const diff = now.getTime() - KNOWN_NEW_MOON
  const days = diff / (1000 * 60 * 60 * 24)
  const lunarAge = days % LUNAR_MONTH

  const phasePercent = lunarAge / LUNAR_MONTH
  const illumination = 50 * (1 - Math.cos(phasePercent * 2 * Math.PI))

  let phaseName = ""
  if (lunarAge < 1.84) phaseName = "NEW MOON"
  else if (lunarAge < 5.53) phaseName = "WAXING CRESCENT"
  else if (lunarAge < 9.22) phaseName = "FIRST QUARTER"
  else if (lunarAge < 12.91) phaseName = "WAXING GIBBOUS"
  else if (lunarAge < 16.61) phaseName = "FULL MOON"
  else if (lunarAge < 20.3) phaseName = "WANING GIBBOUS"
  else if (lunarAge < 23.99) phaseName = "LAST QUARTER"
  else if (lunarAge < 27.68) phaseName = "WANING CRESCENT"
  else phaseName = "NEW MOON"

  const daysToNextFullMoon = (14.76 - lunarAge + LUNAR_MONTH) % LUNAR_MONTH
  const nextFullMoonDate = new Date(
    now.getTime() + daysToNextFullMoon * 24 * 60 * 60 * 1000
  )
  const nextFullMoonStr = nextFullMoonDate
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .toUpperCase()

  return {
    age: lunarAge.toFixed(1),
    illumination: illumination.toFixed(1),
    phaseName,
    visibility:
      illumination > 80 ? "EXCELLENT" : illumination > 30 ? "GOOD" : "POOR",
    nextFullMoon: nextFullMoonStr,
  }
}

export function useObservatoryData(): ObservatoryData {
  const [data, setData] = useState<ObservatoryData>({
    loading: true,
    moon: getMoonData(),
    hijri: {
      day: "--",
      month: "----",
      year: "----",
      weekdayEn: "----",
      weekdayAr: "----",
    },
    qibla: "295.1",
    sun: { sunrise: "--:--", sunset: "--:--" },
  })

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(
          "https://api.aladhan.com/v1/timingsByCity?city=Jakarta&country=Indonesia&method=2"
        ).catch(() => null)

        if (res && res.ok) {
          const json = await res.json()
          const hijri = json.data.date.hijri
          const timings = json.data.timings
          const qibla = json.data.meta?.method?.location?.qibla || "295.1"

          setData((prev) => ({
            ...prev,
            loading: false,
            moon: getMoonData(),
            hijri: {
              day: hijri.day,
              month: hijri.month.en,
              year: hijri.year,
              weekdayEn: hijri.weekday.en,
              weekdayAr: hijri.weekday.ar,
            },
            qibla: String(qibla),
            sun: {
              sunrise: timings.Sunrise,
              sunset: timings.Sunset,
            },
          }))
        } else {
          setData((prev) => ({ ...prev, loading: false }))
        }
      } catch (err) {
        console.error("Failed to load observatory data", err)
        setData((prev) => ({ ...prev, loading: false }))
      }
    }

    fetchData()
    const interval = setInterval(
      () => {
        setData((prev) => ({ ...prev, moon: getMoonData() }))
      },
      1000 * 60 * 60
    )

    return () => clearInterval(interval)
  }, [])

  return data
}
