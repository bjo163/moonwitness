import { create } from 'zustand';
import { InventorySlot, EquipmentDict } from '../types/inventory';

export type InventoryStoreState = {
  slots: InventorySlot[];
  equipment: EquipmentDict;
  
  // Basic mutators for the engine to use
  setSlots: (slots: InventorySlot[]) => void;
  setEquipment: (equipment: EquipmentDict) => void;
};

export const useInventoryStore = create<InventoryStoreState>((set) => ({
  slots: [],
  equipment: {},

  setSlots: (slots) => set({ slots }),
  setEquipment: (equipment) => set({ equipment })
}));
