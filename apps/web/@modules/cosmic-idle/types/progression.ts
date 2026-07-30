export interface PlayerAttributes {
  str: number; // Strength -> ATK
  vit: number; // Vitality -> HP, DEF
  int: number; // Intelligence -> MAG, MP
  spr: number; // Spirit -> MDEF, MP Regen
  agi: number; // Agility -> SPD, Dodge
  luk: number; // Luck -> Crit, Drops
}

export interface PlayerStats {
  hp: number;
  mp: number;
  atk: number;
  def: number;
  mag: number;
  mdef: number;
  spd: number;
  luk: number;
}

export interface PlayerClass {
  id: string;
  name: string;
  description: string;
  
  // Starting core stats at level 1
  baseStats: PlayerStats;
  
  // Stat growth per level (e.g. +5 HP per level)
  statGrowth: PlayerStats;
}

export interface Title {
  id: string;
  name: string;
  description: string;
  bonuses: Partial<PlayerStats>;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  type: 'KILL_MONSTERS' | 'COLLECT_NUR' | 'REACH_LEVEL' | 'CRAFT_ITEMS';
  targetAmount: number;
  rewardTitleId?: string;
}

export interface AchievementProgress {
  id: string;
  currentAmount: number;
  isUnlocked: boolean;
}

export interface Reputation {
  factionId: string;
  name: string;
  value: number; // -100 to 100
}
