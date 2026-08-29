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
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(getWhisperStorageKey(requestId))
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
  if (typeof window === "undefined") return
  try {
    const now = Date.now()
    const active = whispers.filter((w) => w.expiresAt > now)
    window.localStorage.setItem(
      getWhisperStorageKey(requestId),
      JSON.stringify(active)
    )
    window.dispatchEvent(new Event("storage"))
  } catch {}
}
