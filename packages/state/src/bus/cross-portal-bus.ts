import type { CrossPortalEvents } from "./event-types"

const CHANNEL_NAME = "moonwitness_cross_portal_bus"

class CrossPortalEventBus {
  private channel: BroadcastChannel | null = null

  constructor() {
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      try {
        this.channel = new BroadcastChannel(CHANNEL_NAME)
      } catch (err) {
        console.warn("[CrossPortalBus] BroadcastChannel not available:", err)
      }
    }
  }

  emit<K extends keyof CrossPortalEvents>(event: K, data: CrossPortalEvents[K]): void {
    if (this.channel) {
      try {
        this.channel.postMessage({ event, data, timestamp: Date.now() })
      } catch (err) {
        console.warn(`[CrossPortalBus] Failed to emit ${String(event)}:`, err)
      }
    }
  }

  on<K extends keyof CrossPortalEvents>(
    event: K,
    handler: (data: CrossPortalEvents[K]) => void
  ): () => void {
    if (!this.channel) return () => {}

    const listener = (msgEvent: MessageEvent) => {
      if (msgEvent.data && msgEvent.data.event === event) {
        handler(msgEvent.data.data)
      }
    }

    this.channel.addEventListener("message", listener)
    return () => {
      this.channel?.removeEventListener("message", listener)
    }
  }
}

export const crossPortalBus = new CrossPortalEventBus()
