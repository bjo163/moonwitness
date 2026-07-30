import { create } from 'zustand';
import { Battler, BattleState, TurnAction } from '../types/battle';

export type BattleStoreState = {
  state: BattleState;
  
  player: Battler | null;
  enemy: Battler | null;
  
  turnQueue: string[]; // Array of Battler IDs in order of turn
  activeTurnId: string | null;
  
  // Actions
  initBattle: (player: Battler, enemy: Battler) => void;
  setState: (state: BattleState) => void;
  setTurnQueue: (queue: string[]) => void;
  setActiveTurn: (id: string) => void;
  
  // Health updates
  updateHp: (battlerId: string, hp: number) => void;
  
  // Action Submission (from UI to Engine)
  pendingAction: TurnAction | null;
  submitAction: (action: TurnAction) => void;
  clearPendingAction: () => void;
};

export const useBattleStore = create<BattleStoreState>((set) => ({
  state: BattleState.INIT,
  
  player: null,
  enemy: null,
  
  turnQueue: [],
  activeTurnId: null,
  
  pendingAction: null,

  initBattle: (player, enemy) => set({
    player,
    enemy,
    state: BattleState.INIT,
    turnQueue: [],
    activeTurnId: null,
    pendingAction: null
  }),

  setState: (state) => set({ state }),
  
  setTurnQueue: (queue) => set({ turnQueue: queue }),
  
  setActiveTurn: (id) => set({ activeTurnId: id }),
  
  updateHp: (id, hp) => set((state) => {
    if (state.player && state.player.id === id) {
      return { player: { ...state.player, hp: Math.max(0, Math.min(state.player.maxHp, hp)) } };
    }
    if (state.enemy && state.enemy.id === id) {
      return { enemy: { ...state.enemy, hp: Math.max(0, Math.min(state.enemy.maxHp, hp)) } };
    }
    return state;
  }),

  submitAction: (action) => set({ pendingAction: action }),
  clearPendingAction: () => set({ pendingAction: null })
}));
