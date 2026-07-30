import { create } from 'zustand';
import { PlayerAttributes, PlayerStats, AchievementProgress, Reputation } from '../types/progression';

export type ProgressionStoreState = {
  // Core
  level: number;
  exp: number;
  classId: string;
  ap: number; // Attribute Points
  sp: number; // Skill Points
  
  // Custom Attributes
  attributes: PlayerAttributes;
  
  // Final calculated stats (updated by engine)
  stats: PlayerStats;
  
  // Collectibles
  unlockedTitles: string[];
  activeTitle: string | null;
  achievements: Record<string, AchievementProgress>;
  reputation: Record<string, Reputation>;
  
  // NG+
  ngPlusCount: number;

  // Mutators
  setLevel: (level: number) => void;
  setExp: (exp: number) => void;
  setAp: (ap: number) => void;
  setSp: (sp: number) => void;
  setAttributes: (attrs: PlayerAttributes) => void;
  setStats: (stats: PlayerStats) => void;
  addTitle: (titleId: string) => void;
  setActiveTitle: (titleId: string | null) => void;
  updateAchievement: (id: string, progress: AchievementProgress) => void;
  setNgPlusCount: (count: number) => void;
};

export const useProgressionStore = create<ProgressionStoreState>((set) => ({
  level: 1,
  exp: 0,
  classId: 'c_novice', // Default class
  ap: 0,
  sp: 0,
  
  attributes: { str: 0, vit: 0, int: 0, spr: 0, agi: 0, luk: 0 },
  
  stats: { hp: 0, mp: 0, atk: 0, def: 0, mag: 0, mdef: 0, spd: 0, luk: 0 },
  
  unlockedTitles: [],
  activeTitle: null,
  achievements: {},
  reputation: {},
  
  ngPlusCount: 0,

  setLevel: (level) => set({ level }),
  setExp: (exp) => set({ exp }),
  setAp: (ap) => set({ ap }),
  setSp: (sp) => set({ sp }),
  setAttributes: (attributes) => set({ attributes }),
  setStats: (stats) => set({ stats }),
  addTitle: (titleId) => set((state) => ({ 
    unlockedTitles: state.unlockedTitles.includes(titleId) ? state.unlockedTitles : [...state.unlockedTitles, titleId]
  })),
  setActiveTitle: (activeTitle) => set({ activeTitle }),
  updateAchievement: (id, progress) => set((state) => ({
    achievements: { ...state.achievements, [id]: progress }
  })),
  setNgPlusCount: (ngPlusCount) => set({ ngPlusCount })
}));
