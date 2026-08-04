export const OFFLINE_QUEUE_KEY = "mw_offline_queue"

interface SyncJob {
  id: string
  url: string
  method: string
  body: any
  timestamp: number
}

export function queueOfflineSync(url: string, method: string, body: any) {
  if (typeof window === "undefined") return
  try {
    const queue: SyncJob[] = JSON.parse(localStorage.getItem(OFFLINE_QUEUE_KEY) || "[]")
    queue.push({
      id: crypto.randomUUID(),
      url,
      method,
      body,
      timestamp: Date.now()
    })
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue))
    console.log("[OfflineSync] Job queued for", url)
  } catch (e) {
    console.error("Failed to queue offline job", e)
  }
}

export async function flushOfflineQueue() {
  if (typeof window === "undefined") return
  try {
    const queue: SyncJob[] = JSON.parse(localStorage.getItem(OFFLINE_QUEUE_KEY) || "[]")
    if (queue.length === 0) return

    console.log(`[OfflineSync] Flushing ${queue.length} jobs...`)
    const remainingQueue: SyncJob[] = []

    for (const job of queue) {
      try {
        const res = await fetch(job.url, {
          method: job.method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(job.body)
        })
        if (!res.ok) {
          console.warn("[OfflineSync] Job failed, requeueing...", job.id)
          remainingQueue.push(job)
        }
      } catch (err) {
        remainingQueue.push(job)
      }
    }

    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(remainingQueue))
    
    if (remainingQueue.length === 0) {
      console.log("[OfflineSync] Queue flushed successfully.")
      // Trigger a custom event so UI can react (e.g. show toast)
      window.dispatchEvent(new Event("mw_offline_sync_complete"))
    }
  } catch (e) {
    console.error("Failed to flush offline queue", e)
  }
}
