import { NextRequest, NextResponse } from "next/server"
import { getSupabaseClient, getDailyPrayerTimes } from "@workspace/quran-core"
import { cleanHadithText } from "@core/utils/hadith-cleaner"

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

type PrayerPeriodInfo = {
  code: string
  name: string
  icon: string
  timeRange: string
  periodIndex: number
}

function parseMins(timeStr: string): number {
  if (!timeStr) return 0
  const [h, m] = timeStr.split(":").map(Number)
  return (h || 0) * 60 + (m || 0)
}

/**
 * Dynamic Calculation of Current Prayer Period based on quran-core math
 */
function calculateDynamicPrayerPeriod(
  currentMins: number,
  todayPrayers: any
): PrayerPeriodInfo {
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

// Canonical Global Coordinates (Jakarta, Indonesia)
const JAKARTA_LAT = -6.2088
const JAKARTA_LNG = 106.8456

export async function GET(req: NextRequest) {
  const sb = getSupabaseClient()

  // Universal Global Date & Time (Asia/Jakarta WIB - Canonical Timezone)
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

  // Fetch Live Prayer Timings dynamically using our internal quran-core Math Engine
  const todayPrayers = getDailyPrayerTimes(JAKARTA_LAT, JAKARTA_LNG, now)
  const prayerPeriod = calculateDynamicPrayerPeriod(currentMins, todayPrayers)

  // Subuh (Fajr) threshold check: Before Subuh (~04:35 AM), we are still in yesterday's Isya cycle!
  const fajrMins =
    todayPrayers.fajr.getHours() * 60 + todayPrayers.fajr.getMinutes()

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

  // GLOBAL UNIVERSAL SEED
  const globalSeedStr = `global_mw_${dateStr}_${prayerPeriod.code}`
  const dailySeed = getSeedHash(globalSeedStr)

  // Calculate Global Progress starting from Official Launch Date (July 26, 2026)
  const launchDateOnly = new Date("2026-07-26T00:00:00Z")
  const prayerDateOnly = new Date(`${dateStr}T00:00:00Z`)

  const elapsedDays = Math.max(
    0,
    Math.floor(
      (prayerDateOnly.getTime() - launchDateOnly.getTime()) / (24 * 3600 * 1000)
    )
  )
  const elapsedPeriods = elapsedDays * 6 + prayerPeriod.periodIndex
  const totalAyahCount = 6236
  const globalSeenCount = Math.min(totalAyahCount, Math.max(1, elapsedPeriods))
  const remainingCount = Math.max(0, totalAyahCount - globalSeenCount)

  try {
    // 1. Universal Global Ayah from Supabase Cloud
    const todayAyahId = (dailySeed % totalAyahCount) + 1

    const { data: ayahData } = await sb
      .from("ayahs")
      .select(
        "id, surah_number, ayah_number, text_arabic, text_latin, translation_id, translation_en, audio_url"
      )
      .eq("id", todayAyahId)
      .single()

    let surahName = ""
    let surahTranslationId = ""
    let surahTranslationEn = ""
    if (ayahData) {
      const { data: surahData } = await sb
        .from("surahs")
        .select("name_latin, translation_id, translation_en")
        .eq("number", ayahData.surah_number)
        .single()
      if (surahData) {
        surahName = surahData.name_latin
        surahTranslationId = surahData.translation_id
        surahTranslationEn = surahData.translation_en
      }

      await sb.from("user_daily_history").upsert(
        {
          session_id: "global-launch-history",
          item_type: "AYAH",
          item_id: ayahData.id,
        },
        { onConflict: "session_id,item_type,item_id" }
      )
    }

    const surahNum = ayahData?.surah_number || 1
    const ayahNum = ayahData?.ayah_number || 1

    // Dynamic Ayah Translation Fetch & Auto-Save to DB if missing
    let ayahTranslationEn = ayahData?.translation_en || ""
    if (!ayahTranslationEn && ayahData) {
      try {
        const apiRes = await fetch(
          `https://api.alquran.cloud/v1/ayah/${surahNum}:${ayahNum}/en.sahih`
        )
        if (apiRes.ok) {
          const apiJson = await apiRes.json()
          if (apiJson?.data?.text) {
            ayahTranslationEn = apiJson.data.text
            // Auto-cache into Supabase DB asynchronously
            sb.from("ayahs")
              .update({ translation_en: ayahTranslationEn })
              .eq("id", ayahData.id)
              .then(() => {})
          }
        }
      } catch (e) {
        console.warn("Failed to fetch dynamic Ayah English translation:", e)
      }
    }

    // 2. Fetch Asmaul Husna Pair 1 (Based on Surah Number)
    const asmaulSurahNum = ((surahNum - 1) % 99) + 1
    const { data: asmaulSurahData } = await sb
      .from("asmaul_husna")
      .select(
        "number, name_arabic, name_latin, translation_id, quran_reference"
      )
      .eq("number", asmaulSurahNum)
      .single()

    // 3. Fetch Asmaul Husna Pair 2 (Based on Ayah Number)
    const asmaulAyahNum = ((ayahNum - 1) % 99) + 1
    const { data: asmaulAyahData } = await sb
      .from("asmaul_husna")
      .select(
        "number, name_arabic, name_latin, translation_id, quran_reference"
      )
      .eq("number", asmaulAyahNum)
      .single()

    // 4. Universal Global Hadith from Supabase Cloud
    const totalHadithCount = 30800
    const todayHadithId = ((dailySeed * 7 + 13) % totalHadithCount) + 1

    const { data: hadithData } = await sb
      .from("hadiths")
      .select("id, book_slug, number, text_id, text_en, grade")
      .eq("id", todayHadithId)
      .single()

    let bookName = ""
    if (hadithData) {
      const { data: bookData } = await sb
        .from("hadith_books")
        .select("name")
        .eq("slug", hadithData.book_slug)
        .single()
      if (bookData) bookName = bookData.name
    }

    // Dynamic Hadith Text Fetch & Auto-Save to DB if missing
    let hadithTextEn = hadithData?.text_en || ""
    if (!hadithTextEn && hadithData) {
      try {
        const bookSlugMap: Record<string, string> = {
          bukhari: "eng-bukhari",
          muslim: "eng-muslim",
          abudawud: "eng-abudawud",
          tirmidzi: "eng-tirmidhi",
          nasai: "eng-nasai",
          ibnumajah: "eng-ibnmajah",
          darimi: "eng-darimi",
          ahmad: "eng-ahmad",
          malik: "eng-malik",
        }
        const apiEdition = bookSlugMap[hadithData.book_slug] || "eng-bukhari"
        const apiRes = await fetch(
          `https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/${apiEdition}/${hadithData.number}.json`
        )
        if (apiRes.ok) {
          const apiJson = await apiRes.json()
          const fetchedText = apiJson?.hadiths?.[0]?.text || apiJson?.text
          if (fetchedText) {
            hadithTextEn = fetchedText
            // Auto-cache into Supabase DB asynchronously
            sb.from("hadiths")
              .update({ text_en: hadithTextEn })
              .eq("id", hadithData.id)
              .then(() => {})
          }
        }
      } catch (e) {
        console.warn("Failed to fetch dynamic Hadith English text:", e)
      }
    }

    // 5. Universal Global Scripture Wisdom from Supabase Cloud
    const totalVerseCount = 15
    const todayVerseId = ((dailySeed * 13 + 29) % totalVerseCount) + 1

    const { data: scriptureData } = await sb
      .from("scripture_verses")
      .select(
        "id, scripture_id, text_original, text_transliteration, translation_id, translation_en, notes, notes_en"
      )
      .eq("id", todayVerseId)
      .single()

    const scriptureQuoteEn = scriptureData?.translation_en || ""
    const scriptureSourceEn = scriptureData?.notes_en || ""

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
        id: ayahData?.id || 1,
        surahNumber: surahNum,
        surahName: surahName || "Al-Fatihah",
        surahTranslationId: surahTranslationId || "",
        surahTranslationEn: surahTranslationEn || "",
        ayahNumber: ayahNum,
        textArabic:
          ayahData?.text_arabic || "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
        textLatin: ayahData?.text_latin || "Bismillāhir-raḥmānir-raḥīm",
        translationId:
          ayahData?.translation_id ||
          "Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.",
        translationEn: ayahTranslationEn,
        audioUrl: ayahData?.audio_url || undefined,
      },

      asmaulSurah: asmaulSurahData
        ? {
            number: asmaulSurahData.number,
            nameArabic: asmaulSurahData.name_arabic,
            nameLatin: asmaulSurahData.name_latin,
            translationId: asmaulSurahData.translation_id,
          }
        : undefined,

      asmaulAyah: asmaulAyahData
        ? {
            number: asmaulAyahData.number,
            nameArabic: asmaulAyahData.name_arabic,
            nameLatin: asmaulAyahData.name_latin,
            translationId: asmaulAyahData.translation_id,
          }
        : undefined,

      hadith: {
        id: hadithData?.id || 1,
        bookName: bookName || "Shahih Bukhari",
        number: hadithData?.number || 1,
        textId: cleanHadithText(
          hadithData?.text_id || "Sesungguhnya amalan itu tergantung niatnya."
        ),
        textEn: hadithTextEn,
        levelBadge: hadithData?.grade || "Shahih",
      },

      wisdom: {
        id: scriptureData?.id || 1,
        title: "Perenungan Khazanah Kitab Suci",
        quote:
          scriptureData?.translation_id ||
          "Sungguh petunjuk Allah adalah sebaik-baik petunjuk.",
        quoteEn: scriptureQuoteEn,
        source: scriptureData?.notes || "Khazanah Kitab Suci Global",
        sourceEn: scriptureSourceEn,
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
