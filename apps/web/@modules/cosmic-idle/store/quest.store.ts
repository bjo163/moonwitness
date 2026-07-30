import { create } from 'zustand';
import { QuestInstance } from '../types/quest';

export type QuestStoreState = {
  quests: Record<string, QuestInstance>;
  
  // Actions
  setQuests: (quests: Record<string, QuestInstance>) => void;
  updateQuest: (questId: string, updates: Partial<QuestInstance>) => void;
  addQuest: (quest: QuestInstance) => void;
};

export const useQuestStore = create<QuestStoreState>((set) => ({
  quests: {},

  setQuests: (quests) => set({ quests }),
  
  updateQuest: (questId, updates) => set((state) => {
    const existing = state.quests[questId];
    if (!existing) return state;
    
    return {
      quests: {
        ...state.quests,
        [questId]: { ...existing, ...updates }
      }
    };
  }),

  addQuest: (quest) => set((state) => ({
    quests: {
      ...state.quests,
      [quest.id]: quest
    }
  }))
}));
