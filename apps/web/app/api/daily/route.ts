import { NextRequest, NextResponse } from "next/server"
import { getDailyPrayerTimes } from "@moon/witness/dist/astronomy/prayer-times.js"
import { cleanHadithText } from "@core/utils/hadith-cleaner"
import { moonClientInstance } from "@core/store/moon-store"

function getSeedHash(seedStr: string): number {
  let hash = 0
  for (let i = 0; i < seedStr.length; i++) {
    const char = seedStr.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash |= 0
  }
  return Math.abs(hash)
}

type PrayerPeriodInfo = {
  code: string
  name: string
  icon: string
  timeRange: string
  periodIndex: number
}

function calculateDynamicPrayerPeriod(currentMins: number, todayPrayers: any): PrayerPeriodInfo {
  const formatTime = (d: Date) =>
    `${d.getHours().toString().padStart(2, "0")}.${d.getMinutes().toString().padStart(2, "0")}`
  const getMins = (d: Date) => d.getHours() * 60 + d.getMinutes()

  const fajr = getMins(todayPrayers.fajr)
  const sunrise = getMins(todayPrayers.sunrise)
  const dhuhr = getMins(todayPrayers.dhuhr)
  const asr = getMins(todayPrayers.asr)
  const maghrib = getMins(todayPrayers.maghrib)
  const isha = getMins(todayPrayers.isha)

  if (currentMins >= fajr && currentMins < sunrise) {
    return {
      code: "subuh",
      name: "Periode Shalat Subuh",
      icon: "🌅",
      timeRange: `${formatTime(todayPrayers.fajr)} - ${formatTime(todayPrayers.sunrise)} WIB`,
      periodIndex: 1,
    }
  } else if (currentMins >= sunrise && currentMins < dhuhr) {
    return {
      code: "dhuha",
      name: "Periode Dhuha & Pagi",
      icon: "☀️",
      timeRange: `${formatTime(todayPrayers.sunrise)} - ${formatTime(todayPrayers.dhuhr)} WIB`,
      periodIndex: 2,
    }
  } else if (currentMins >= dhuhr && currentMins < asr) {
    return {
      code: "zuhur",
      name: "Periode Shalat Zuhur",
      icon: "🕌",
      timeRange: `${formatTime(todayPrayers.dhuhr)} - ${formatTime(todayPrayers.asr)} WIB`,
      periodIndex: 3,
    }
  } else if (currentMins >= asr && currentMins < maghrib) {
    return {
      code: "asar",
      name: "Periode Shalat Asar",
      icon: "🌆",
      timeRange: `${formatTime(todayPrayers.asr)} - ${formatTime(todayPrayers.maghrib)} WIB`,
      periodIndex: 4,
    }
  } else if (currentMins >= maghrib && currentMins < isha) {
    return {
      code: "maghrib",
      name: "Periode Shalat Maghrib",
      icon: "🌇",
      timeRange: `${formatTime(todayPrayers.maghrib)} - ${formatTime(todayPrayers.isha)} WIB`,
      periodIndex: 5,
    }
  } else {
    return {
      code: "isya",
      name: "Periode Shalat Isya & Malam",
      icon: "🌙",
      timeRange: `${formatTime(todayPrayers.isha)} - ${formatTime(todayPrayers.fajr)} WIB`,
      periodIndex: 6,
    }
  }
}

const JAKARTA_LAT = -6.2088
const JAKARTA_LNG = 106.8456

export async function GET(req: NextRequest) {
  const now = new Date()
  const jakartaParts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now)

  const pObj = Object.fromEntries(jakartaParts.map((p) => [p.type, p.value]))
  const hour = parseInt(pObj.hour || "0", 10) % 24
  const minute = parseInt(pObj.minute || "0", 10)
  const currentMins = hour * 60 + minute

  const todayPrayers = getDailyPrayerTimes(JAKARTA_LAT, JAKARTA_LNG, now)
  const prayerPeriod = calculateDynamicPrayerPeriod(currentMins, todayPrayers)

  const fajrMins = todayPrayers.fajr.getHours() * 60 + todayPrayers.fajr.getMinutes()

  let targetYear = pObj.year || "2026"
  let targetMonth = pObj.month || "07"
  let targetDay = pObj.day || "26"

  if (currentMins < fajrMins) {
    const prevDate = new Date(
      Date.UTC(
        parseInt(targetYear, 10),
        parseInt(targetMonth, 10) - 1,
        parseInt(targetDay, 10) - 1
      )
    )
    targetYear = prevDate.getUTCFullYear().toString()
    targetMonth = String(prevDate.getUTCMonth() + 1).padStart(2, "0")
    targetDay = String(prevDate.getUTCDate()).padStart(2, "0")
  }

  const dateStr = `${targetYear}-${targetMonth}-${targetDay}`
  const globalSeedStr = `global_mw_${dateStr}_${prayerPeriod.code}`
  const dailySeed = getSeedHash(globalSeedStr)

  const launchDateOnly = new Date("2026-07-26T00:00:00Z")
  const prayerDateOnly = new Date(`${dateStr}T00:00:00Z`)

  const elapsedDays = Math.max(0, Math.floor((prayerDateOnly.getTime() - launchDateOnly.getTime()) / (24 * 3600 * 1000)))
  const elapsedPeriods = elapsedDays * 6 + prayerPeriod.periodIndex
  const totalAyahCount = 6236
  const globalSeenCount = Math.min(totalAyahCount, Math.max(1, elapsedPeriods))
  const remainingCount = Math.max(0, totalAyahCount - globalSeenCount)

  try {
    const baseUrl = "http://localhost:4000/api/witness"
    let ayahData: any = null
    let asmaulSurahData: any = null
    let asmaulAyahData: any = null
    let hadithData: any = null

    try {
      const todayAyahId = (dailySeed % totalAyahCount) + 1
      
      const approxSurah = Math.max(1, Math.min(114, Math.floor(todayAyahId / 54) + 1))
      const json = await moonClientInstance.request("GET", `/api/witness/quran/surah?number=${approxSurah}`)
      if (json.ayahs && json.ayahs.length > 0) {
         const idx = (todayAyahId - 1) % json.ayahs.length
         const a = json.ayahs[idx]
         ayahData = {
            surah_number: approxSurah,
            surah_name_latin: json.surah.name,
            ayah_number: a.number,
            text_arabic: a.textArabic,
            text_latin: a.textLatin,
            translation_id: a.textId,
            translation_en: a.textEn
         }
      }
    } catch (e) {
      console.warn("Failed to fetch daily ayah", e)
    }

    try {
      const json = await moonClientInstance.request("GET", "/api/witness/asmaul-husna")
      const asmaul = json.data || []
      if (asmaul.length > 0) {
         const surahNum = ayahData?.surah_number || 1
         const ayahNum = ayahData?.ayah_number || 1
         asmaulSurahData = asmaul[(surahNum - 1) % 99] || asmaul[0]
         asmaulAyahData = asmaul[(ayahNum - 1) % 99] || asmaul[1]
      }
    } catch (e) {
      console.warn("Failed to fetch daily asmaul husna", e)
    }

    try {
      const randomPage = Math.max(1, (dailySeed * 7) % 500)
      const json = await moonClientInstance.request("GET", `/api/witness/hadith?slug=bukhari&page=${randomPage}&limit=1`)
      if (json.hadiths && json.hadiths.length > 0) {
         hadithData = json.hadiths[0]
      }
    } catch (e) {
      console.warn("Failed to fetch daily hadith", e)
    }

    return NextResponse.json({
      formattedDate: new Intl.DateTimeFormat("id-ID", {
        dateStyle: "full",
        timeZone: "Asia/Jakarta",
      }).format(now),
      dateStr,
      prayerPeriod,
      globalStats: {
        totalAyahs: totalAyahCount,
        seenAyahsCount: globalSeenCount,
        remainingAyahsCount: remainingCount,
      },
      ayah: {
        id: dailySeed % totalAyahCount,
        surahNumber: ayahData?.surah_number || 1,
        surahName: ayahData?.surah_name_latin || "Al-Fatihah",
        ayahNumber: ayahData?.ayah_number || 1,
        textArabic: ayahData?.text_arabic || "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
        textLatin: ayahData?.text_latin || "Bismillāhir-raḥmānir-raḥīm",
        translationId: ayahData?.translation_id || "Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.",
        translationEn: ayahData?.translation_en || "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
      },
      asmaulSurah: asmaulSurahData ? {
        number: asmaulSurahData.number || 1,
        nameArabic: asmaulSurahData.arabic || "",
        nameLatin: asmaulSurahData.latin || "",
        translationId: asmaulSurahData.translationId || "",
      } : undefined,
      asmaulAyah: asmaulAyahData ? {
        number: asmaulAyahData.number || 2,
        nameArabic: asmaulAyahData.arabic || "",
        nameLatin: asmaulAyahData.latin || "",
        translationId: asmaulAyahData.translationId || "",
      } : undefined,
      hadith: {
        id: hadithData?.number || 1,
        bookName: "Shahih Bukhari",
        number: hadithData?.number || 1,
        textId: cleanHadithText(hadithData?.textId || "Sesungguhnya amalan itu tergantung niatnya."),
        textEn: hadithData?.textEn || "Actions are judged by intentions.",
        levelBadge: "Shahih",
      },
      wisdom: {
        id: 1,
        title: "Perenungan Khazanah Kitab Suci",
        quote: "Sungguh petunjuk Allah adalah sebaik-baik petunjuk.",
        quoteEn: "Indeed, the guidance of Allah is the best guidance.",
        source: "Khazanah Kitab Suci Global",
        sourceEn: "Global Scripture Treasury",
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
