import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

export type Guild = {
  id: string
  name: string
  xp: number
  members: number
  icon: string
}

interface GuildState {
  currentGuildId: string | null
  guilds: Guild[]
  joinGuild: (guildId: string) => void
  leaveGuild: () => void
  addXP: (amount: number) => void
}

const DEFAULT_GUILDS: Guild[] = [
  { id: "g1", name: "Alpha Squadron", xp: 12500, members: 42, icon: "🦅" },
  { id: "g2", name: "Badr Vanguard", xp: 18900, members: 313, icon: "⚔️" },
  { id: "g3", name: "Cordoba Scholars", xp: 9800, members: 15, icon: "📚" },
]

export const useGuildStore = create<GuildState>()(
  persist(
    (set, get) => ({
      currentGuildId: null,
      guilds: DEFAULT_GUILDS,
      joinGuild: (guildId) => set({ currentGuildId: guildId }),
      leaveGuild: () => set({ currentGuildId: null }),
      addXP: (amount) => set((state) => {
        if (!state.currentGuildId) return state
        const updatedGuilds = state.guilds.map((g) => {
          if (g.id === state.currentGuildId) {
            return { ...g, xp: g.xp + amount }
          }
          return g
        })
        return { guilds: updatedGuilds }
      })
    }),
    {
      name: "moon-guild-storage",
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
      })),
    }
  )
)
