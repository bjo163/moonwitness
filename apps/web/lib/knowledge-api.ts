import { apiGet } from "@moon/client"

export type WitnessContent = Record<string, any>

export type WitnessLookup = {
  reference: string
  resolved: boolean
  type?: string
  passage?: WitnessContent | null
  content?: WitnessContent[]
  translations?: WitnessContent[]
  tradition?: WitnessContent | null
}

export function field<T = any>(record: WitnessContent | null | undefined, ...names: string[]): T | undefined {
  if (!record) return undefined
  for (const name of names) {
    if (record[name] !== undefined && record[name] !== null) return record[name] as T
  }
  return undefined
}

export function apiRecords(payload: any): WitnessContent[] {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.data)) return payload.data
  if (Array.isArray(payload?.records)) return payload.records
  return []
}

export async function getLookup(reference: string): Promise<WitnessLookup> {
  return apiGet<WitnessLookup>(`/api/witness/lookup?ref=${encodeURIComponent(reference)}`)
}

export async function getSources(): Promise<WitnessContent[]> {
  const payload = await apiGet(`/api/wx.source?limit=100&page=1&order=id%20asc`)
  return apiRecords(payload).filter((source) => field(source, "active", "is_active") !== false)
}

export async function getSource(id: string): Promise<WitnessContent | null> {
  const payload = await apiGet(`/api/wx.source/${encodeURIComponent(id)}`)
  return payload?.data || payload?.record || payload || null
}

export function sourceFromContent(content: WitnessContent | undefined, sources: WitnessContent[]): WitnessContent | null {
  const sourceId = field(content, "sourceId", "source_id")
  return sources.find((source) => String(field(source, "id") ?? "") === String(sourceId ?? "")) || null
}

export function contentLanguage(content: WitnessContent): string {
  return String(field(content, "languageCode", "language_code", "language") || "")
}

export function contentType(content: WitnessContent): string {
  return String(field(content, "contentType", "content_type") || "")
}

export function contentText(content: WitnessContent): string {
  return String(field(content, "text") || "")
}

export function displaySource(source: WitnessContent | null): string {
  return String(field(source, "name", "stableKey", "stable_key") || "Source metadata unavailable")
}
