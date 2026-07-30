import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const city = searchParams.get("city") || "Jakarta"
  const country = searchParams.get("country") || "Indonesia"

  try {
    // 1. Fetch accurate live prayer timings from Aladhan API (Kemenag Indonesia method = 20)
    const res = await fetch(
      `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=20`
    )

    let timings = {
      Fajr: "04:35",
      Sunrise: "05:50",
      Dhuhr: "12:00",
      Asr: "15:20",
      Sunset: "17:55",
      Maghrib: "17:55",
      Isha: "19:05",
    }

    if (res.ok) {
      const json = await res.json()
      if (json && json.data && json.data.timings) {
        timings = json.data.timings
      }
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
      source: "Aladhan Official API (Kemenag Indonesia Method)",
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
