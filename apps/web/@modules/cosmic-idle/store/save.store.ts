import { create } from 'zustand';
import { SaveHeader } from '../types/save';

export type SaveStoreState = {
  headers: Record<number, SaveHeader>;
  setHeaders: (headers: Record<number, SaveHeader>) => void;
  updateHeader: (slotId: number, header: SaveHeader) => void;
};

export const useSaveStore = create<SaveStoreState>((set) => ({
  headers: {},
  setHeaders: (headers) => set({ headers }),
  updateHeader: (slotId, header) => set((state) => ({
    headers: { ...state.headers, [slotId]: header }
  }))
}));
