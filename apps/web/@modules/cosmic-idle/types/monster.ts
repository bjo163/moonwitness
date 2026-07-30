import { Element, Skill } from './battle';

export type GrowthRate = 'FAST' | 'MEDIUM_FAST' | 'MEDIUM_SLOW' | 'SLOW';

export interface BaseStats {
  hp: number;
  mp: number;
  atk: number;
  def: number;
  agi: number;
}

export interface EvolutionRequirement {
  level?: number;
  item?: string;
  affinity?: number;
}

export interface EvolutionNode {
  targetSpeciesId: string;
  requirements: EvolutionRequirement;
}

/**
 * MonsterSpecies (The Pokedex Data)
 * Read-only template for all monsters of this type.
 */
export interface MonsterSpecies {
  id: string;
  name: string;
  description: string;
  baseElement: Element;
  
  // Base Stats (used as a multiplier for growth)
  baseStats: BaseStats;
  growthRate: GrowthRate;
  
  weaknesses: Element[];
  resistances: Element[];
  absorbs: Element[];

  // Skill pool learned by leveling up
  learnset: { level: number; skillId: string }[];
  
  evolutions: EvolutionNode[];
}

/**
 * MonsterInstance (The Player's Pet)
 * Mutable state representing a specific captured monster.
 */
export interface MonsterInstance {
  uuid: string; // For multiplayer/save uniqueness
  speciesId: string;
  nickname: string;
  
  level: number;
  exp: number;
  affinity: number; // 0-100 bonding stat
  
  // Dynamic Stats
  currentHp: number;
  currentMp: number;
  
  // Genetic/Effort values for unique math (0-31 IV, 0-255 EV)
  ivs: BaseStats;
  evs: BaseStats;
  
  // Calculated Final Stats (Base + IV + EV + Level Curve)
  stats: BaseStats;

  // Active Skills (Up to 4)
  activeSkillIds: string[];
  
  // Equipment
  heldItemId: string | null;
}

/**
 * Payload for network sync or saving
 */
export interface SerializedMonster {
  uuid: string;
  speciesId: string;
  nickname: string;
  level: number;
  exp: number;
  affinity: number;
  currentHp: number;
  currentMp: number;
  ivs: BaseStats;
  evs: BaseStats;
  activeSkillIds: string[];
  heldItemId: string | null;
}
