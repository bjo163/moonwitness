import { safeGetStorage, safeSetStorage } from "@workspace/hooks"

export interface StoredWhisper {
  id: string
  requestId: string
  tier: "DIVINE" | "SHADOW" | "HUMAN"
  content: string
  createdAt: number
  expiresAt: number
  isRead: boolean
}

export function getWhisperStorageKey(requestId: string): string {
  return `mw_whisper_${requestId}`
}

export function readStoredWhispers(requestId: string): StoredWhisper[] {
  try {
    const raw = safeGetStorage(getWhisperStorageKey(requestId))
    if (!raw) return []
    const all: StoredWhisper[] = JSON.parse(raw)
    const now = Date.now()
    return Array.isArray(all) ? all.filter((w) => w.expiresAt > now) : []
  } catch {
    return []
  }
}

export function writeStoredWhispers(
  requestId: string,
  whispers: StoredWhisper[]
): void {
  try {
    const now = Date.now()
    const active = whispers.filter((w) => w.expiresAt > now)
    safeSetStorage(
      getWhisperStorageKey(requestId),
      JSON.stringify(active)
    )
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("storage"))
    }
  } catch {}
}

