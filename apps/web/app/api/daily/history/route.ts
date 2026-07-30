import { NextRequest, NextResponse } from "next/server"
import { getSupabaseClient } from "@workspace/quran-core"

/**
 * Deterministic Hash Function for a Global Seed String
 */
function getSeedHash(seedStr: string): number {
  let hash = 0
  for (let i = 0; i < seedStr.length; i++) {
    const char = seedStr.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash |= 0
  }
  return Math.abs(hash)
}

const PRAYER_PERIODS = [
  {
    code: "subuh",
    name: "Periode Shalat Subuh",
    icon: "🌅",
    timeRange: "04.00 - 06.00 WIB",
    periodIndex: 1,
  },
  {
    code: "dhuha",
    name: "Periode Dhuha & Pagi",
    icon: "☀️",
    timeRange: "06.00 - 11.45 WIB",
    periodIndex: 2,
  },
  {
    code: "zuhur",
    name: "Periode Shalat Zuhur",
    icon: "🕌",
    timeRange: "11.45 - 15.15 WIB",
    periodIndex: 3,
  },
  {
    code: "asar",
    name: "Periode Shalat Asar",
    icon: "🌆",
    timeRange: "15.15 - 18.00 WIB",
    periodIndex: 4,
  },
  {
    code: "maghrib",
    name: "Periode Shalat Maghrib",
    icon: "🌇",
    timeRange: "18.00 - 19.15 WIB",
    periodIndex: 5,
  },
  {
    code: "isya",
    name: "Periode Shalat Isya & Malam",
    icon: "🌙",
    timeRange: "19.15 - 04.00 WIB",
    periodIndex: 6,
  },
]

export async function GET(req: NextRequest) {
  const sb = getSupabaseClient()

  // Calculate Global Progress starting from Official Launch Date (July 26, 2026)
  const now = new Date()
  const localDate = new Date(now.getTime() + 7 * 3600 * 1000)
  const launchDateOnly = new Date("2026-07-26T00:00:00Z")

  // Determine current period index
  const totalMins = localDate.getUTCHours() * 60 + localDate.getUTCMinutes()
  let currentPeriodIdx = 6
  if (totalMins >= 275 && totalMins < 360) currentPeriodIdx = 1
  else if (totalMins >= 360 && totalMins < 705) currentPeriodIdx = 2
  else if (totalMins >= 705 && totalMins < 915) currentPeriodIdx = 3
  else if (totalMins >= 915 && totalMins < 1080) currentPeriodIdx = 4
  else if (totalMins >= 1080 && totalMins < 1145) currentPeriodIdx = 5

  const prayerDate = new Date(localDate.getTime())
  if (totalMins < 275) {
    prayerDate.setDate(prayerDate.getDate() - 1)
  }

  const dateStr = prayerDate.toISOString().split("T")[0] || "2026-07-26"
  const prayerDateOnly = new Date(`${dateStr}T00:00:00Z`)

  const elapsedDays = Math.max(
    0,
    Math.floor(
      (prayerDateOnly.getTime() - launchDateOnly.getTime()) / (24 * 3600 * 1000)
    )
  )
  const totalPeriodsElapsed = elapsedDays * 6 + currentPeriodIdx
  const totalAyahCount = 6236

  const historyItems = []

  // Generate list of revealed periods (newest first)
  for (let p = totalPeriodsElapsed; p >= 1; p--) {
    const dayOffset = Math.floor((p - 1) / 6)
    const periodInDayIdx = (p - 1) % 6

    const periodObj = PRAYER_PERIODS[periodInDayIdx] ?? PRAYER_PERIODS[0]!

    const itemDate = new Date(
      launchDateOnly.getTime() + dayOffset * 24 * 3600 * 1000
    )
    const dateStr = itemDate.toISOString().split("T")[0]

    const seedStr = `global_mw_${dateStr}_${periodObj.code}`
    const seedHash = getSeedHash(seedStr)
    const ayahId = (seedHash % totalAyahCount) + 1

    const formattedDate = new Intl.DateTimeFormat("id-ID", {
      dateStyle: "full",
      timeZone: "Asia/Jakarta",
    }).format(itemDate)

    historyItems.push({
      sequenceNumber: p,
      dateStr,
      formattedDate,
      period: periodObj,
      ayahId,
    })
  }

  try {
    // Fetch full Ayah details from Supabase Cloud
    const ayahIds = historyItems.map((h) => h.ayahId)
    const { data: ayahsData } = await sb
      .from("ayahs")
      .select(
        "id, surah_number, ayah_number, text_arabic, text_latin, translation_id, audio_url"
      )
      .in("id", ayahIds)

    const ayahsMap = new Map(
      ayahsData ? ayahsData.map((a: any) => [a.id, a]) : []
    )

    // Fetch Surahs names map
    const { data: surahsData } = await sb
      .from("surahs")
      .select("number, name_latin")
    const surahsMap = new Map(
      surahsData ? surahsData.map((s: any) => [s.number, s.name_latin]) : []
    )

    // Fetch Asmaul Husna map
    const { data: asmaulData } = await sb
      .from("asmaul_husna")
      .select("number, name_arabic, name_latin, translation_id")
    const asmaulMap = new Map(
      asmaulData ? asmaulData.map((m: any) => [m.number, m]) : []
    )

    const enrichedHistory = historyItems.map((item) => {
      const ayah = ayahsMap.get(item.ayahId)
      const surahName = ayah ? surahsMap.get(ayah.surah_number) || "" : ""

      const surahNum = ayah?.surah_number || 1
      const ayahNum = ayah?.ayah_number || 1

      const asmaulSurahNum = ((surahNum - 1) % 99) + 1
      const asmaulAyahNum = ((ayahNum - 1) % 99) + 1

      return {
        ...item,
        ayah: ayah
          ? {
              id: ayah.id,
              surahNumber: surahNum,
              surahName,
              ayahNumber: ayahNum,
              textArabic: ayah.text_arabic,
              textLatin: ayah.text_latin || "",
              translationId: ayah.translation_id,
              audioUrl:
                ayah.audio_url ||
                `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayah.id}.mp3`,
            }
          : null,
        asmaulSurah: asmaulMap.get(asmaulSurahNum) || null,
        asmaulAyah: asmaulMap.get(asmaulAyahNum) || null,
      }
    })

    return NextResponse.json({
      totalPeriodsElapsed,
      history: enrichedHistory,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
