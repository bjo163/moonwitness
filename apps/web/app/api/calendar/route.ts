import { NextResponse } from "next/server"
import { PROPHETIC_EVENTS } from "@/lib/data/prophetic-events.db"

export async function GET() {
  try {
    const today = new Date()
    const month = today.getMonth()
    const year = today.getFullYear()
    const numDays = new Date(year, month + 1, 0).getDate()
    const daysArray = Array.from(
      { length: numDays },
      (_, i) => new Date(year, month, i + 1)
    )

    const hijriFormatter = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    })
    const hijriMonthFormatter = new Intl.DateTimeFormat(
      "en-u-ca-islamic-umalqura",
      {
        month: "long",
      }
    )
    const gregMonthFormatter = new Intl.DateTimeFormat("en", { month: "long" })

    const formattedDays = daysArray.map((date) => {
      const hijriParts = hijriFormatter
        .formatToParts(date)
        .reduce((acc, part) => {
          acc[part.type] = part.value
          return acc
        }, {} as any)

      const hijriMonthName = hijriMonthFormatter.format(date).split(" ")[0]

      const hijriDay = parseInt(hijriParts.day || "1", 10)
      const hijriMonthNumber = parseInt(hijriParts.month || "1", 10)
      const isAyyamulBidh =
        hijriDay === 13 || hijriDay === 14 || hijriDay === 15

      // Calculate Phase Approximations
      let phaseName = "Waxing Crescent"
      let illumination = Math.min(100, Math.round((hijriDay / 15) * 100))
      let icon = "🌒"

      if (hijriDay === 1) {
        phaseName = "New Moon (Hilal)"
        icon = "🌑"
        illumination = 2
      } else if (hijriDay <= 7) {
        phaseName = "Waxing Crescent"
        icon = "🌒"
      } else if (hijriDay === 8) {
        phaseName = "First Quarter"
        icon = "🌓"
        illumination = 50
      } else if (hijriDay <= 12) {
        phaseName = "Waxing Gibbous"
        icon = "🌔"
      } else if (hijriDay >= 13 && hijriDay <= 15) {
        phaseName = "Full Moon (Bulan Purnama)"
        icon = "🌕"
        illumination = 100
      } else if (hijriDay <= 22) {
        phaseName = "Waning Gibbous"
        icon = "🌖"
        illumination = Math.round(((30 - hijriDay) / 15) * 100)
      } else if (hijriDay === 23) {
        phaseName = "Last Quarter"
        icon = "🌗"
        illumination = 50
      } else {
        phaseName = "Waning Crescent"
        icon = "🌘"
        illumination = 15
      }

      // Cari Prophetic Event berdasarkan Tanggal & Bulan Hijriyah
      const propheticEvents = PROPHETIC_EVENTS.filter(
        (e) => e.dayNumber === hijriDay && e.monthNumber === hijriMonthNumber
      )

      return {
        hijriDay,
        hijriMonthName,
        hijriYear: hijriParts.year,
        gregorianDate: `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}`,
        gregorianDay: date.getDate(),
        gregorianMonthName: gregMonthFormatter.format(date),
        gregorianYear: date.getFullYear(),
        phaseName,
        illumination,
        isAyyamulBidh,
        icon,
        holidays: [],
        propheticEvents:
          propheticEvents.length > 0 ? propheticEvents : undefined,
        moonrise: `${String((18 + Math.floor(hijriDay * 0.8)) % 24).padStart(2, "0")}:15 WIB`,
        moonset: `${String((5 + Math.floor(hijriDay * 0.8)) % 24).padStart(2, "0")}:45 WIB`,
      }
    })

    return NextResponse.json({ days: formattedDays })
  } catch (error: any) {
    console.error("[Calendar API Error]", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
