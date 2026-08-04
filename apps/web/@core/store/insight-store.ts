import { create } from "zustand"
import { persist } from "zustand/middleware"

interface InsightState {
  insights: Record<string, { text: string; timestamp: number }>
  getInsight: (verseKey: string, arabicText: string, translation: string) => Promise<string>
}

export const useInsightStore = create<InsightState>()(
  persist(
    (set, get) => ({
      insights: {},
      getInsight: async (verseKey: string, arabicText: string, translation: string) => {
        const { insights } = get()
        const now = Date.now()
        const cached = insights[verseKey]

        // Cache TTL 24 hours
        if (cached && now - cached.timestamp < 1000 * 60 * 60 * 24) {
          return cached.text
        }

        try {
          const res = await fetch("/api/ai/insight", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ verseKey, arabicText, translation }),
          })

          if (res.ok) {
            const data = await res.json()
            if (data.insight) {
              set((state) => ({
                insights: {
                  ...state.insights,
                  [verseKey]: { text: data.insight, timestamp: now },
                },
              }))
              return data.insight
            }
          }
        } catch (e) {
          console.error("Failed to fetch insight:", e)
        }

        return "Connection to Prophetic Intel failed. Retrying later..."
      },
    }),
    {
      name: "moon-insight-storage",
    }
  )
)
