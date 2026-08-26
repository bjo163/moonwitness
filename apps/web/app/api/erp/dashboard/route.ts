import { NextRequest, NextResponse } from "next/server"
import { MOCK_ERP_DASHBOARD } from "@core/db/data/erp-dashboard.db"
import { moonClientInstance } from "@core/store/moon-store"
import { getDailyPrayerTimes } from "@moon/witness/dist/astronomy/prayer-times.js"

const JAKARTA_LAT = -6.2088
const JAKARTA_LNG = 106.8456

export async function GET(req: NextRequest) {
  const dashboardData = { ...MOCK_ERP_DASHBOARD }

  try {
    // 1. Real Prayer Times from Internal Math Engine (@moon/witness)
    const now = new Date()
    const todayPrayers = getDailyPrayerTimes(JAKARTA_LAT, JAKARTA_LNG, now)

    const formatTime = (d: Date) =>
      `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`

    const currentMins = now.getHours() * 60 + now.getMinutes()
    const getMins = (d: Date) => d.getHours() * 60 + d.getMinutes()

    const prayerSchedule = [
      { name: "Fajr", timeObj: todayPrayers.fajr },
      { name: "Dhuhr", timeObj: todayPrayers.dhuhr },
      { name: "Asr", timeObj: todayPrayers.asr },
      { name: "Maghrib", timeObj: todayPrayers.maghrib },
      { name: "Isha", timeObj: todayPrayers.isha },
    ]

    dashboardData.todayPrayer = prayerSchedule.map((p) => {
      const pmins = getMins(p.timeObj)
      let status = "pending"
      if (currentMins >= pmins) status = "done"
      if (
        status === "pending" &&
        prayerSchedule.find((x) => getMins(x.timeObj) > currentMins)?.name ===
          p.name
      ) {
        status = "next"
      }
      return {
        name: p.name,
        time: formatTime(p.timeObj),
        status,
        countdown: status === "next" ? "LIVE" : undefined,
      }
    })

    // 2. Real Knowledge Feed from Witness API
    try {
      const randomSurah = Math.floor(Math.random() * 114) + 1
      const surahJson = await moonClientInstance.request(
        "GET",
        `/api/witness/quran/surah?number=${randomSurah}`
      )
      const ayahs = surahJson.ayahs || []
      if (ayahs.length > 0) {
        const randomAyah = ayahs[Math.floor(Math.random() * ayahs.length)]
        dashboardData.knowledgeFeed[0] = {
          id: "kf1",
          category: "Qur'an",
          title: randomAyah.textArabic,
          subtitle: `Surah ${surahJson.surah.name} (${surahJson.surah.number}:${randomAyah.number})`,
          time: "Just Now",
        }
      }
    } catch (e) {
      console.error("Failed to fetch random surah", e)
    }

    try {
      const randomPage = Math.floor(Math.random() * 500) + 1
      const hadithJson = await moonClientInstance.request(
        "GET",
        `/api/witness/hadith?slug=bukhari&page=${randomPage}&limit=1`
      )
      const hadiths = hadithJson.hadiths || []
      if (hadiths.length > 0) {
        const h = hadiths[0]
        dashboardData.knowledgeFeed[1] = {
          id: "kf2",
          category: "Hadith",
          title: (h.textId || h.textEn || "").substring(0, 100) + "...",
          subtitle: `Bukhari ${h.number}`,
          time: "Just Now",
        }
      }
    } catch (e) {
      console.error("Failed to fetch random hadith", e)
    }
  } catch (error) {
    console.error("Failed to fetch real data for ERP Dashboard:", error)
  }

  return NextResponse.json({
    success: true,
    data: dashboardData,
  })
}
