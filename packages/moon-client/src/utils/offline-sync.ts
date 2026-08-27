export const OFFLINE_QUEUE_KEY = "mw_offline_queue"

export interface SyncJob {
  id: string
  url: string
  method: string
  body: any
  timestamp: number
}

export function queueOfflineSync(url: string, method: string, body: any) {
  if (typeof window === "undefined") return
  try {
    const queue: SyncJob[] = JSON.parse(
      localStorage.getItem(OFFLINE_QUEUE_KEY) || "[]"
    )
    queue.push({
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
      url,
      method,
      body,
      timestamp: Date.now(),
    })
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue))
  } catch (e) {
    console.error("[OfflineSync] Failed to queue offline job", e)
  }
}

export async function flushOfflineQueue() {
  if (typeof window === "undefined") return
  try {
    const queue: SyncJob[] = JSON.parse(
      localStorage.getItem(OFFLINE_QUEUE_KEY) || "[]"
    )
    if (queue.length === 0) return

    const remainingQueue: SyncJob[] = []

    for (const job of queue) {
      try {
        const res = await fetch(job.url, {
          method: job.method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(job.body),
        })
        if (!res.ok) {
          remainingQueue.push(job)
        }
      } catch {
        remainingQueue.push(job)
      }
    }

    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(remainingQueue))

    if (remainingQueue.length === 0) {
      window.dispatchEvent(new Event("mw_offline_sync_complete"))
    }
  } catch (e) {
    console.error("[OfflineSync] Failed to flush offline queue", e)
  }
}
