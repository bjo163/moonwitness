export type ItemCategory = 'WEAPON' | 'ARMOR' | 'CONSUMABLE' | 'QUEST' | 'MATERIAL';
export type ItemRarity = 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';

export interface ItemTemplate {
  id: string;
  name: string;
  description: string;
  category: ItemCategory;
  rarity: ItemRarity;
  maxStack: number; // Usually 99 for generic, 1 for equippables
  sellPrice: number;
}

export interface EquippableStats {
  atkBonus?: number;
  defBonus?: number;
  hpBonus?: number;
  mpBonus?: number;
  agiBonus?: number;
}

export interface EquippableTemplate extends ItemTemplate {
  stats: EquippableStats;
}

export interface ConsumableTemplate extends ItemTemplate {
  healHp?: number;
  healMp?: number;
  // Further effects could be added here
}

export interface InventorySlot {
  slotId: string; // Unique ID for this bag slot
  itemId: string;
  quantity: number;
  
  // If we ever want unique instanced weapons (e.g. +5% Fire Damage prefix), 
  // we would store the specific modifiers here.
  // For now, it's generic.
}

export interface EquipmentDict {
  [monsterId: string]: {
    weaponSlot: string | null; // holds the slotId from inventory
    armorSlot: string | null;
  }
}
