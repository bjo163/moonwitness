import { NextRequest, NextResponse } from "next/server"
import { moonClientInstance } from "@moon/client"
export const dynamic = "force-dynamic"

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
  const now = new Date()
  const localDate = new Date(now.getTime() + 7 * 3600 * 1000)
  const launchDateOnly = new Date("2026-07-26T00:00:00Z")

  const totalMins = localDate.getUTCHours() * 60 + localDate.getUTCMinutes()
  let currentPeriodIdx = 6
  if (totalMins >= 275 && totalMins < 360) currentPeriodIdx = 1
  else if (totalMins >= 360 && totalMins < 705) currentPeriodIdx = 2
  else if (totalMins >= 705 && totalMins < 915) currentPeriodIdx = 3
  else if (totalMins >= 915 && totalMins < 1080) currentPeriodIdx = 4
  else if (totalMins >= 1080 && totalMins < 1145) currentPeriodIdx = 5

  const prayerDate = new Date(localDate.getTime())
  if (totalMins < 275) prayerDate.setDate(prayerDate.getDate() - 1)

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
  for (let p = totalPeriodsElapsed; p >= 1; p--) {
    const dayOffset = Math.floor((p - 1) / 6)
    const periodInDayIdx = (p - 1) % 6
    const periodObj = PRAYER_PERIODS[periodInDayIdx] ?? PRAYER_PERIODS[0]!
    const itemDate = new Date(
      launchDateOnly.getTime() + dayOffset * 24 * 3600 * 1000
    )
    const dStr = itemDate.toISOString().split("T")[0]
    const seedStr = `global_mw_${dStr}_${periodObj.code}`
    const ayahId = (getSeedHash(seedStr) % totalAyahCount) + 1

    historyItems.push({
      sequenceNumber: p,
      dateStr: dStr,
      formattedDate: new Intl.DateTimeFormat("id-ID", {
        dateStyle: "full",
        timeZone: "Asia/Jakarta",
      }).format(itemDate),
      period: periodObj,
      ayahId,
    })
  }

  try {
    // For Witness API history, we mock enriched data based on generic formulas since we don't have batch endpoints
    const asmaulMap = new Map()
    try {
      const json = await moonClientInstance.request(
        "GET",
        "/api/wx.asmaul.husna?limit=100"
      )
      for (const item of json.data || []) {
        asmaulMap.set(item.number || item.id, item)
      }
    } catch (e) {
      console.error("Failed to fetch asmaul husna", e)
    }

    const recentHistory = historyItems.slice(0, 15)

    const fetchAyah = async (id: number) => {
      try {
        const res = await moonClientInstance.request(
          "GET",
          `/api/wx.scripture.verse/${id}`
        )
        return res.data
      } catch (e) {
        return null
      }
    }

    const ayahsData = await Promise.all(
      recentHistory.map((h) => fetchAyah(h.ayahId))
    )

    const enrichedHistory = recentHistory.map((item, idx) => {
      const dbAyah = ayahsData[idx]
      // ORM returns snake_case. book_id = [surahNum, "SurahName"]
      const bookId =
        dbAyah && Array.isArray(dbAyah.book_id)
          ? dbAyah.book_id[0]
          : Math.max(1, Math.floor(item.ayahId / 54) + 1)
      const bookName =
        dbAyah && Array.isArray(dbAyah.book_id)
          ? dbAyah.book_id[1]
          : "Surah " + bookId
      const ayahNum = dbAyah ? dbAyah.verse_number : item.ayahId % 54 || 1
      const asmaulSurahNum = ((bookId - 1) % 99) + 1
      const asmaulAyahNum = ((ayahNum - 1) % 99) + 1

      return {
        ...item,
        ayah: {
          id: item.ayahId,
          surahNumber: bookId,
          surahName: bookName,
          ayahNumber: ayahNum,
          textArabic: dbAyah
            ? dbAyah.text_original
            : "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
          textLatin: dbAyah
            ? dbAyah.text_transliteration || ""
            : "Bismillāhir-raḥmānir-raḥīm",
          translationId: dbAyah
            ? dbAyah.translation_id
            : "Ayah history from witness.",
          audioUrl:
            dbAyah?.audio_url ||
            `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${item.ayahId}.mp3`,
        },
        asmaulSurah: asmaulMap.get(asmaulSurahNum)
          ? {
              number: asmaulSurahNum,
              name_arabic: asmaulMap.get(asmaulSurahNum).name_arabic,
              name_latin: asmaulMap.get(asmaulSurahNum).name_latin,
              translation_id: asmaulMap.get(asmaulSurahNum).translation_id,
            }
          : null,
        asmaulAyah: asmaulMap.get(asmaulAyahNum)
          ? {
              number: asmaulAyahNum,
              name_arabic: asmaulMap.get(asmaulAyahNum).name_arabic,
              name_latin: asmaulMap.get(asmaulAyahNum).name_latin,
              translation_id: asmaulMap.get(asmaulAyahNum).translation_id,
            }
          : null,
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
