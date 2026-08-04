import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

export type Quest = {
  id: string
  title: string
  rewardXP: number
  completed: boolean
}

interface QuestState {
  quests: Quest[]
  lastRefresh: number
  completeQuest: (questId: string) => void
  refreshQuests: () => void
}

const generateDailyQuests = (): Quest[] => [
  { id: "q1", title: "Read 10 Verses", rewardXP: 150, completed: false },
  { id: "q2", title: "Listen to Surah Al-Kahf", rewardXP: 300, completed: false },
  { id: "q3", title: "Share 1 Reflection", rewardXP: 200, completed: false },
]

export const useQuestStore = create<QuestState>()(
  persist(
    (set, get) => ({
      quests: generateDailyQuests(),
      lastRefresh: Date.now(),
      completeQuest: (questId) => set((state) => {
        const newQuests = state.quests.map(q => 
          q.id === questId ? { ...q, completed: true } : q
        )
        return { quests: newQuests }
      }),
      refreshQuests: () => {
        const now = Date.now()
        // Refresh if more than 24h passed
        if (now - get().lastRefresh > 1000 * 60 * 60 * 24) {
          set({ quests: generateDailyQuests(), lastRefresh: now })
        }
      }
    }),
    {
      name: "moon-quest-storage",
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
      })),
    }
  )
)
