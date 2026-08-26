import { apiGet, apiPost, apiPut, apiDelete } from "./api-client"
import type {
  HadithEntry,
  QuranAyahItem,
  UserEntity,
  PrayerData,
  ChatMessage,
  CabRfc,
} from "@workspace/types"

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

// ── OBSERVATORY & KNOWLEDGE ENDPOINTS ───────────────────────────────────────
export async function fetchPrayerTimes(city = "Jakarta", country = "Indonesia"): Promise<PrayerData> {
  return await apiGet<PrayerData>(`/api/prayer-times?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}`)
}

export async function fetchAdhkar(): Promise<any[]> {
  return await apiGet<any[]>("/api/adhkar")
}

export async function fetchComments(targetId: string): Promise<any[]> {
  return await apiGet<any[]>(`/api/comments?targetId=${encodeURIComponent(targetId)}`)
}

export async function postComment(data: { targetId: string; author: string; content: string }): Promise<any> {
  return await apiPost("/api/comments", data)
}

export async function sendChatMessage(messages: ChatMessage[]): Promise<ChatMessage> {
  return await apiPost<ChatMessage>("/api/agent", { messages })
}