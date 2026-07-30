import { NextResponse } from "next/server"
import { PROPHETIC_EVENTS } from "../../../@core/db/data/prophetic-events.db"

export async function GET() {
  try {
    const today = new Date()
    const month = today.getMonth() + 1 // 1-12
    const year = today.getFullYear()

    // Fetch Aladhan Gregorian to Hijri calendar for this month
    const res = await fetch(
      `http://api.aladhan.com/v1/gToHCalendar/${month}/${year}`
    )

    if (!res.ok) {
      throw new Error(`Aladhan API Error: ${res.status}`)
    }

    const json = await res.json()
    const data = json.data

    const formattedDays = data.map((item: any) => {
      const hijriDay = parseInt(item.hijri.day, 10)
      const hijriMonthNumber = item.hijri.month.number
      const isAyyamulBidh =
        hijriDay === 13 || hijriDay === 14 || hijriDay === 15

      // Calculate Phase Approximations (since Aladhan doesn't provide phases)
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
        hijriMonthName: item.hijri.month.en,
        hijriYear: item.hijri.year,
        gregorianDate: item.gregorian.date, // DD-MM-YYYY
        gregorianDay: parseInt(item.gregorian.day, 10),
        gregorianMonthName: item.gregorian.month.en,
        gregorianYear: item.gregorian.year,
        phaseName,
        illumination,
        isAyyamulBidh,
        icon,
        holidays: item.hijri.holidays || [],
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
