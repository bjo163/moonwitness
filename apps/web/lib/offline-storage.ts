/**
 * ◈ MoonWitness — Client-Side Offline Storage Layer (IndexedDB)
 *
 * Provides persistent offline storage for Quran scriptures, Hadith collections,
 * prayer times, and celestial calculations when disconnected from the network.
 */

const DB_NAME = "moonwitness_offline_v1"
const DB_VERSION = 1

export type OfflineStoreName = "scriptures" | "hadiths" | "celestial" | "prayers"

interface OfflineEntry<T = unknown> {
  key: string
  data: T
  savedAt: number
  expiresAt: number
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      return reject(new Error("IndexedDB is unavailable in this environment"))
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      const stores: OfflineStoreName[] = ["scriptures", "hadiths", "celestial", "prayers"]
      for (const store of stores) {
        if (!db.objectStoreNames.contains(store)) {
          db.createObjectStore(store, { keyPath: "key" })
        }
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

/**
 * Save an item to the offline IndexedDB store with optional TTL (default 30 days).
 */
export async function saveOfflineData<T>(
  store: OfflineStoreName,
  key: string,
  data: T,
  ttlMs = 30 * 24 * 60 * 60 * 1000
): Promise<void> {
  try {
    const db = await openDatabase()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(store, "readwrite")
      const objectStore = tx.objectStore(store)
      const entry: OfflineEntry<T> = {
        key,
        data,
        savedAt: Date.now(),
        expiresAt: Date.now() + ttlMs,
      }
      const request = objectStore.put(entry)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  } catch (err) {
    console.warn(`[OfflineStorage] Failed to save ${store}/${key}:`, err)
  }
}

/**
 * Retrieve an item from the offline store. Returns null if expired or missing.
 */
export async function getOfflineData<T>(
  store: OfflineStoreName,
  key: string
): Promise<T | null> {
  try {
    const db = await openDatabase()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(store, "readonly")
      const objectStore = tx.objectStore(store)
      const request = objectStore.get(key)

      request.onsuccess = () => {
        const entry = request.result as OfflineEntry<T> | undefined
        if (!entry) return resolve(null)
        if (Date.now() > entry.expiresAt) {
          // Expired: prune in background
          saveOfflineData(store, key, null, 0).catch(() => {})
          return resolve(null)
        }
        resolve(entry.data)
      }
      request.onerror = () => reject(request.error)
    })
  } catch {
    return null
  }
}

/**
 * Check if the browser is currently online.
 */
export function isBrowserOnline(): boolean {
  if (typeof navigator === "undefined") return true
  return navigator.onLine !== false
}
