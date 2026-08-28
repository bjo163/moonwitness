import { apiGet, apiPost, apiPut, apiDelete } from "./api-client"
import type {
  HadithEntry,
  QuranAyahItem,
  UserEntity,
  PrayerData,
  ChatMessage,
  CabRfc,
  HadithListResponse,
  SurahDetailResponse,
  SurahListResponse,
  AsmaulHusnaResponse,
  DevotionListResponse,
  MoonPhaseResponse,
  CabSummaryResponse,
  HealthResponse,
  DbStatusResponse,
} from "@workspace/types"

export const API_ENDPOINTS = {
  ASTRONOMY: {
    MOON_PHASE: "/api/astronomy/moon-phase",
    ECLIPSES: "/api/astronomy/eclipses",
  },
  ISLAMIC: {
    PRAYER_TIMES: "/api/prayer-times",
    HIJRI_DATE: "/api/islamic/hijri-date",
    QIBLA: "/api/islamic/qibla",
  },
  SYSTEM: {
    HEALTH: "/api/system/health",
    METRICS: "/api/system/metrics",
  },
  SCRIPTURES: {
    QURAN_SURAHS: "/api/scriptures/quran/surahs",
    QURAN_AYAHS: (surahNumber: number) =>
      `/api/witness/quran/surah?number=${surahNumber}`,
  },
  HADITHS: {
    BOOKS: "/api/hadiths/books",
    LIST: (bookId: string, page = 1) =>
      `/api/witness/hadith?slug=${bookId}&page=${page}`,
  },
} as const

// ── COMMAND CENTER ENDPOINTS ────────────────────────────────────────────────
export async function fetchDashboardData(): Promise<any> {
  return await apiGet("/api/command-center/dashboard")
}

export async function fetchHadiths(): Promise<HadithEntry[]> {
  return await apiGet<HadithEntry[]>("/api/hadiths")
}

export async function saveHadith(hadith: Partial<HadithEntry>): Promise<HadithEntry> {
  return await apiPost<HadithEntry>("/api/hadiths", hadith)
}

export async function fetchScriptures(): Promise<QuranAyahItem[]> {
  return await apiGet<QuranAyahItem[]>("/api/scriptures")
}

export async function saveScripture(ayah: Partial<QuranAyahItem>): Promise<QuranAyahItem> {
  return await apiPost<QuranAyahItem>("/api/scriptures", ayah)
}

export async function fetchUsers(): Promise<UserEntity[]> {
  return await apiGet<UserEntity[]>("/api/users")
}

export async function saveUser(user: Partial<UserEntity>): Promise<UserEntity> {
  return await apiPost<UserEntity>("/api/users", user)
}

export async function fetchCabRfcs(): Promise<CabRfc[]> {
  return await apiGet<CabRfc[]>("/api/cab/rfcs")
}

export async function fetchCabSummary(): Promise<CabSummaryResponse> {
  return await apiGet<CabSummaryResponse>("/api/cab/summary")
}

// ── OBSERVATORY & KNOWLEDGE ENDPOINTS ───────────────────────────────────────
export async function fetchPrayerTimes(city = "Jakarta", country = "Indonesia"): Promise<PrayerData> {
  return await apiGet<PrayerData>(`/api/prayer-times?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}`)
}

export async function fetchMoonPhase(date?: string): Promise<MoonPhaseResponse> {
  const url = date ? `/api/witness/astronomy/moon-phase?date=${encodeURIComponent(date)}` : "/api/witness/astronomy/moon-phase"
  return await apiGet<MoonPhaseResponse>(url)
}

export async function fetchSurahDetail(surahNumber: number): Promise<SurahDetailResponse> {
  return await apiGet<SurahDetailResponse>(`/api/witness/quran/surah?number=${surahNumber}`)
}

export async function fetchSurahList(): Promise<SurahListResponse> {
  return await apiGet<SurahListResponse>("/api/witness/quran/surahs")
}

export async function fetchHadithList(slug: string, page = 1, limit = 20): Promise<HadithListResponse> {
  return await apiGet<HadithListResponse>(`/api/witness/hadith?slug=${encodeURIComponent(slug)}&page=${page}&limit=${limit}`)
}

export async function fetchAsmaulHusna(): Promise<AsmaulHusnaResponse> {
  return await apiGet<AsmaulHusnaResponse>("/api/witness/asmaul-husna")
}

export async function fetchDevotions(type?: string, category?: string): Promise<DevotionListResponse> {
  const params = new URLSearchParams()
  if (type) params.set("type", type)
  if (category) params.set("category", category)
  const qs = params.toString()
  return await apiGet<DevotionListResponse>(`/api/witness/devotions${qs ? `?${qs}` : ""}`)
}

export async function fetchSystemHealth(): Promise<HealthResponse> {
  return await apiGet<HealthResponse>("/api/system/health")
}

export async function fetchDbStatus(): Promise<DbStatusResponse> {
  return await apiGet<DbStatusResponse>("/db/status")
}

export async function fetchFigures(): Promise<any> {
  return await apiGet("/api/wx.figure?limit=100&order=id%20asc")
}

export async function fetchHadithBooks(): Promise<{ books: any[] }> {
  return await apiGet<{ books: any[] }>("/api/witness/hadith/books")
}

export async function fetchEarthquakes(): Promise<any> {
  return await apiGet("/api/external/usgs/earthquakes")
}

export async function fetchGoogleTrends(): Promise<any[]> {
  return await apiGet<any[]>("/api/external/trends")
}

export async function fetchExternalWeather(latitude = "-6.2", longitude = "106.8"): Promise<any> {
  return await apiGet(`/api/external/weather?latitude=${encodeURIComponent(latitude)}&longitude=${encodeURIComponent(longitude)}`)
}

export async function fetchSolarCme(startDate?: string): Promise<any> {
  const url = startDate ? `/api/external/nasa/donki/cme?startDate=${encodeURIComponent(startDate)}` : "/api/external/nasa/donki/cme"
  return await apiGet(url)
}

export async function fetchGoldPrice(): Promise<{ pricePerGramIdr: number; symbol: string; lastPrice: string }> {
  try {
    const ticker = await apiGet<any>("/api/external/binance/ticker?symbol=PAXGUSDT")
    const priceUsd = parseFloat(ticker?.lastPrice || "2400")
    const pricePerGramIdr = Math.round((priceUsd / 31.1035) * 16200)
    return { pricePerGramIdr: pricePerGramIdr || 1350000, symbol: "PAXGUSDT", lastPrice: ticker?.lastPrice || "2400" }
  } catch {
    return { pricePerGramIdr: 1350000, symbol: "FALLBACK", lastPrice: "2400" }
  }
}

export async function sendChatMessage(messages: ChatMessage[]): Promise<ChatMessage> {
  return await apiPost<ChatMessage>("/api/agent", { messages })
}
