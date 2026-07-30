export type TacticalBookmarkItem = {
  id: string
  type: "ayah" | "hadith" | "scripture"
  title: string
  subtitle: string
  textArabic?: string
  textTranslation?: string
  href: string
  timestamp: number
}

const STORAGE_KEY = "mw_tactical_bookmarks"

export function getBookmarks(): TacticalBookmarkItem[] {
  if (typeof window === "undefined") return []
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

export function isBookmarked(id: string): boolean {
  const list = getBookmarks()
  return list.some((b) => b.id === id)
}

export function toggleBookmark(item: TacticalBookmarkItem): boolean {
  if (typeof window === "undefined") return false
  const list = getBookmarks()
  const exists = list.some((b) => b.id === item.id)

  let updated: TacticalBookmarkItem[]
  if (exists) {
    updated = list.filter((b) => b.id !== item.id)
  } else {
    updated = [item, ...list]
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    window.dispatchEvent(
      new CustomEvent("mw_bookmarks_updated", { detail: updated })
    )
  } catch (e) {
    console.warn("Failed to update bookmarks in localStorage:", e)
  }

  return !exists
}
