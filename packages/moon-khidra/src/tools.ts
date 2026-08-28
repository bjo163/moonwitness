import { getModel, createCtx, SUPERUSER_ID } from '@moon/orm'
import { getDailyPrayerTimes } from '@moon/witness/dist/astronomy/prayer-times.js'
import { getMoonData } from '@moon/witness/dist/astronomy/moon-phase.js'

function env() {
  return createCtx(SUPERUSER_ID, {}, getModel as any)
}

export const toolDeclarations = [
  {
    type: "function",
    name: "searchQuran",
    description: "Mencari ayat Al-Qur'an di database berdasarkan kata kunci bahasa Indonesia atau Inggris.",
    parameters: {
      type: "object",
      properties: {
        keyword: { type: "string", description: "Kata kunci pencarian." },
        limit: { type: "integer", description: "Maksimal jumlah ayat. Default 3." },
      },
      required: ["keyword"],
    },
  },
  {
    type: "function",
    name: "searchHadith",
    description: "Mencari hadits berdasarkan kata kunci.",
    parameters: {
      type: "object",
      properties: {
        keyword: { type: "string" },
        limit: { type: "integer", description: "Default 3." },
      },
      required: ["keyword"],
    },
  },
  {
    type: "function",
    name: "getPrayerTimes",
    description: "Menghitung waktu shalat (Subuh, Dzuhur, Ashar, Maghrib, Isya) berdasarkan koordinat.",
    parameters: {
      type: "object",
      properties: {
        lat: { type: "number", description: "Latitude. Default -6.2 (Jakarta)." },
        lng: { type: "number", description: "Longitude. Default 106.8 (Jakarta)." },
      }
    },
  },
  {
    type: "function",
    name: "getMoonPhase",
    description: "Mendapatkan fase bulan (astronomi) untuk tanggal tertentu.",
    parameters: {
      type: "object",
      properties: {
        date: { type: "string", description: "Format YYYY-MM-DD. Default hari ini." },
      }
    },
  }
]

export const toolHandlers: Record<string, (args: any) => Promise<string>> = {
  searchQuran: async (args: any) => {
    try {
      const keyword = args.keyword
      const limit = typeof args.limit === 'number' ? args.limit : 3
      const Verse = getModel('wx.scripture.verse')
      if (!Verse) return "Error: Model wx.scripture.verse not found"
      
      const results = await (Verse as any).fetch(Verse, env(), [
        ['translationId', 'ilike', `%${keyword}%`]
      ], undefined, { limit })

      if (!results || results.length === 0) return `No Quranic verses found for keyword "${keyword}".`
      
      return results.map((r: any) => 
        `Surah ${r.bookId}, Ayah ${r.verseNumber}:\nArabic: ${r.textOriginal}\nTranslation: "${r.translationId}"`
      ).join("\n\n---\n\n")
    } catch (e: any) {
      return `Database error: ${e.message}`
    }
  },
  
  searchHadith: async (args: any) => {
    try {
      const keyword = args.keyword
      const limit = typeof args.limit === 'number' ? args.limit : 3
      const Item = getModel('wx.tradition.item')
      if (!Item) return "Error: Model wx.tradition.item not found"
      
      const results = await (Item as any).fetch(Item, env(), [
        ['textId', 'ilike', `%${keyword}%`]
      ], undefined, { limit })

      if (!results || results.length === 0) return `No hadith found for keyword "${keyword}".`
      
      return results.map((r: any) => 
        `Hadith #${r.number}:\nArabic: ${r.textOriginal}\nTranslation: "${r.textId}"`
      ).join("\n\n---\n\n")
    } catch (e: any) {
      return `Database error: ${e.message}`
    }
  },

  getPrayerTimes: async (args: any) => {
    const lat = typeof args.lat === 'number' ? args.lat : -6.2088
    const lng = typeof args.lng === 'number' ? args.lng : 106.8456
    const date = new Date()
    const times = getDailyPrayerTimes(lat, lng, date)
    return `Prayer times for ${date.toISOString()} at Lat ${lat}, Lng ${lng}:
Fajr: ${times.fajr.toISOString()}
Sunrise: ${times.sunrise.toISOString()}
Dhuhr: ${times.dhuhr.toISOString()}
Asr: ${times.asr.toISOString()}
Maghrib: ${times.maghrib.toISOString()}
Isha: ${times.isha.toISOString()}`
  },

  getMoonPhase: async (args: any) => {
    const date = args.date ? new Date(args.date) : new Date()
    const moon = getMoonData(date)
    return `Moon phase for ${date.toISOString()}:
Phase Name: ${moon.phaseName}
Illumination: ${moon.illumination}%
Distance: ${moon.distance} km`
  }
}
