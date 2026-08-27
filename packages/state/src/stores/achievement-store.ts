import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

export interface Achievement {
  id: string
  title: string
  description: string
  points: number
  icon: string
  unlockedAt?: Date
}

export const ACHIEVEMENTS: Record<string, Achievement> = {
  first_login: {
    id: "first_login",
    title: "Initiate Sequence",
    description: "Enter the MoonWitness system for the first time.",
    points: 10,
    icon: "Terminal",
  },
  dzikir_master: {
    id: "dzikir_master",
    title: "Dzikir Master",
    description: "Complete 33 counts of Dzikir.",
    points: 50,
    icon: "Shield",
  },
  quran_explorer: {
    id: "quran_explorer",
    title: "Divine Explorer",
    description: "Listen to an audio recitation.",
    points: 25,
    icon: "Music",
  },
}

interface AchievementState {
  points: number
  unlockedIds: string[]
  unlockAchievement: (id: string, triggerToast?: (msg: any) => void) => void
  hasAchievement: (id: string) => boolean
}

export const useAchievementStore = create<AchievementState>()(
  persist(
    (set, get) => ({
      points: 0,
      unlockedIds: [],

      unlockAchievement: (id, triggerToast) => {
        const state = get()
        if (state.unlockedIds.includes(id)) return // Already unlocked

        const achievement = ACHIEVEMENTS[id]
        if (!achievement) return

        set({
          points: state.points + achievement.points,
          unlockedIds: [...state.unlockedIds, id],
        })

        if (triggerToast) {
          triggerToast({
            variant: "success",
            title: "ACHIEVEMENT UNLOCKED",
            description: `+${achievement.points} XP : ${achievement.title}`,
          })
        }
      },

      hasAchievement: (id) => get().unlockedIds.includes(id),
    }),
    {
      name: "moon_achievements",
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
