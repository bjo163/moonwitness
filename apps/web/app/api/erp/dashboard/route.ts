import { NextRequest, NextResponse } from "next/server"
import { MOCK_ERP_DASHBOARD } from "@core/db/data/erp-dashboard.db"
import { getSupabaseClient, getDailyPrayerTimes } from "@workspace/quran-core"

const JAKARTA_LAT = -6.2088
const JAKARTA_LNG = 106.8456

export async function GET(req: NextRequest) {
  const dashboardData = { ...MOCK_ERP_DASHBOARD }

  try {
    // 1. Real Prayer Times from Internal Math Engine (quran-core)
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

    dashboardData.todayPrayer = prayerSchedule.map(p => {
      const pmins = getMins(p.timeObj)
      let status = "pending"
      if (currentMins >= pmins) status = "done"
      // Simplistic check for 'next'
      if (status === "pending" && prayerSchedule.find(x => getMins(x.timeObj) > currentMins)?.name === p.name) {
        status = "next"
      }
      return {
        name: p.name,
        time: formatTime(p.timeObj),
        status,
        countdown: status === "next" ? "LIVE" : undefined
      }
    })

    // 2. Real Knowledge Feed from Supabase DB (Internal API)
    const sb = getSupabaseClient()
    
    // Fetch a real Ayah for the knowledge feed
    const randomAyahId = Math.floor(Math.random() * 6236) + 1
    const { data: ayahData } = await sb
      .from("quran_verses")
      .select("surah_id, verse_number, text_uthmani, translation_id, surahs(name_latin)")
      .eq("id", randomAyahId)
      .single()

    if (ayahData) {
      // Replace the first mock feed with real Ayah
      dashboardData.knowledgeFeed[0] = {
        id: "kf1",
        category: "Qur'an",
        title: ayahData.text_uthmani,
        subtitle: `Surah ${(ayahData.surahs as any)?.name_latin} (${ayahData.surah_id}:${ayahData.verse_number})`,
        time: "Just Now",
      }
    }

    // Fetch a real Hadith
    const { data: hadithData } = await sb
      .from("hadiths")
      .select("book_slug, number, text_en, hadith_books(name)")
      .eq("id", Math.floor(Math.random() * 30000) + 1)
      .single()

    if (hadithData && hadithData.text_en) {
      // Replace the second mock feed with real Hadith
      dashboardData.knowledgeFeed[1] = {
        id: "kf2",
        category: "Hadith",
        title: hadithData.text_en.substring(0, 100) + "...",
        subtitle: `${(hadithData.hadith_books as any)?.name || hadithData.book_slug} ${hadithData.number}`,
        time: "Just Now",
      }
    }

  } catch (error) {
    console.error("Failed to fetch real data for ERP Dashboard:", error)
  }

  return NextResponse.json({
    success: true,
    data: dashboardData,
  })
}
