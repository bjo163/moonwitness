import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

interface InsightState {
  insights: Record<string, { text: string; timestamp: number }>
  getInsight: (
    verseKey: string,
    arabicText: string,
    translation: string
  ) => Promise<string>
}

export const useInsightStore = create<InsightState>()(
  persist(
    (set, get) => ({
      insights: {},
      getInsight: async (
        verseKey: string,
        arabicText: string,
        translation: string
      ) => {
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
          const data = await res.json()

          if (data?.insight) {
            set((state) => ({
              insights: {
                ...state.insights,
                [verseKey]: { text: data.insight as string, timestamp: now },
              },
            }))
            return data.insight
          }
        } catch (error) {
          console.error("Insight generation failed:", error)
        }

        return "Connection to Prophetic Intel failed. Retrying later..."
      },
    }),
    {
      name: "moon-insight-storage",
      storage: createJSONStorage(() =>
        typeof window !== "undefined"
          ? localStorage
          : {
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {},
            }
      ),
    }
  )
)
