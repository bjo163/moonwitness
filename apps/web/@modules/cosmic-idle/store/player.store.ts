import { create } from "zustand"
import { persist } from "zustand/middleware"

export type PlayerState = {
  nur: number
  level: number
  basePlayerHp: number
  playerHp: number
  basePlayerAtk: number
  basePlayerDef: number
  currentScene: "map" | "battle" | "inventory"
  
  addNur: (amount: number) => void
  setScene: (scene: "map" | "battle" | "inventory") => void
  takeDamage: (amount: number, defBonus: number) => void
  heal: (amount: number) => void
}

const INITIAL_PLAYER_HP = 150

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set) => ({
      nur: 0,
      level: 1,
      basePlayerHp: INITIAL_PLAYER_HP,
      playerHp: INITIAL_PLAYER_HP,
      basePlayerAtk: 15,
      basePlayerDef: 5,
      currentScene: "map",

      addNur: (amount) => set((state) => ({ nur: state.nur + amount })),
      setScene: (scene) => set({ currentScene: scene }),
      
      takeDamage: (amount, defBonus) => set((state) => {
        const totalDef = state.basePlayerDef + defBonus
        const actualDamage = Math.max(1, amount - Math.floor(totalDef / 2))
        return { playerHp: Math.max(0, state.playerHp - actualDamage) }
      }),
      
      heal: (amount) => set((state) => ({
        playerHp: Math.min(state.basePlayerHp, state.playerHp + amount)
      }))
    }),
    { name: "moonwitness-player-store" }
  )
)
