import { NextRequest, NextResponse } from "next/server"
import { getDailyPrayerTimes } from "@moon/compute"

const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  "Makkah, Saudi Arabia": { lat: 21.3891, lng: 39.8579 },
  "Jakarta, Indonesia": { lat: -6.2088, lng: 106.8456 },
  "London, United Kingdom": { lat: 51.5074, lng: -0.1278 },
  "New York, United States": { lat: 40.7128, lng: -74.006 },
  "Tokyo, Japan": { lat: 35.6762, lng: 139.6503 },
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const city = searchParams.get("city") || "Jakarta"
  const country = searchParams.get("country") || "Indonesia"
  const locationKey = `${city}, ${country}`

  try {
    const coords =
      CITY_COORDINATES[locationKey] || CITY_COORDINATES["Jakarta, Indonesia"]!

    // 1. Compute locally using the MoonWitness Astronomy Engine
    const dailyTimes = getDailyPrayerTimes(coords.lat, coords.lng, new Date())

    const formatTime = (d: Date) =>
      `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`

    let timings = {
      Fajr: formatTime(dailyTimes.fajr),
      Sunrise: formatTime(dailyTimes.sunrise),
      Dhuhr: formatTime(dailyTimes.dhuhr),
      Asr: formatTime(dailyTimes.asr),
      Sunset: formatTime(dailyTimes.maghrib),
      Maghrib: formatTime(dailyTimes.maghrib),
      Isha: formatTime(dailyTimes.isha),
    }

    const prayerSchedule = {
      subuh: timings.Fajr,
      syuruq: timings.Sunrise,
      zuhur: timings.Dhuhr,
      ashar: timings.Asr,
      maghrib: timings.Maghrib,
      isya: timings.Isha,
    }

    // 2. Calculate Real-time Next Prayer Time Countdown
    const now = new Date()
    const currentHour = now.getHours()
    const currentMin = now.getMinutes()
    const currentSec = now.getSeconds()
    const currentMinsTotal = currentHour * 60 + currentMin

    function parseTimeToMins(timeStr: string): number {
      const [h, m] = timeStr.split(":").map(Number)
      return (h || 0) * 60 + (m || 0)
    }

    const prayersList = [
      {
        name: "Subuh",
        time: timings.Fajr,
        icon: "🌅",
        mins: parseTimeToMins(timings.Fajr),
      },
      {
        name: "Syuruq",
        time: timings.Sunrise,
        icon: "☀️",
        mins: parseTimeToMins(timings.Sunrise),
      },
      {
        name: "Zuhur",
        time: timings.Dhuhr,
        icon: "🕌",
        mins: parseTimeToMins(timings.Dhuhr),
      },
      {
        name: "Ashar",
        time: timings.Asr,
        icon: "🌆",
        mins: parseTimeToMins(timings.Asr),
      },
      {
        name: "Maghrib",
        time: timings.Maghrib,
        icon: "🌇",
        mins: parseTimeToMins(timings.Maghrib),
      },
      {
        name: "Isya",
        time: timings.Isha,
        icon: "🌙",
        mins: parseTimeToMins(timings.Isha),
      },
    ]

    const nextPrayer =
      prayersList.find((p) => p.mins > currentMinsTotal) || prayersList[0]!
    let isTomorrow = false

    if (!prayersList.find((p) => p.mins > currentMinsTotal)) {
      isTomorrow = true
    }

    let diffMins = nextPrayer.mins - currentMinsTotal
    if (isTomorrow) {
      diffMins += 24 * 60
    }

    const remainingHours = Math.floor(diffMins / 60)
    const remainingMins = diffMins % 60
    const remainingSecs = 60 - currentSec

    return NextResponse.json({
      city: `${city}, ${country}`,
      source: "MoonWitness Astronomy Engine (Internal)",
      schedule: prayerSchedule,
      nextPrayer: {
        name: nextPrayer.name,
        time: nextPrayer.time,
        icon: nextPrayer.icon,
        isTomorrow,
        remainingHours,
        remainingMins,
        remainingSecs,
        formattedCountdown: `${remainingHours > 0 ? remainingHours + " Jam " : ""}${remainingMins} Menit`,
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
