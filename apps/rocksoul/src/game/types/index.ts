export type PlayerStats = {
  name: string;
  level: number;
  xp: number;
  xpToNext: number;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  attack: number;
  defense: number;
  speed: number;
};

export type QuestStatus = 'available' | 'active' | 'completed';

export type Quest = {
  id: string;
  title: string;
  description: string;
  lore: string;
  status: QuestStatus;
  objectives: QuestObjective[];
  rewards: { xp: number; gold: number; item?: string };
};

export type QuestObjective = {
  type: 'kill' | 'collect' | 'talk' | 'explore';
  target: string;
  current: number;
  required: number;
};

export type Npc = {
  id: string;
  name: string;
  title: string;
  faction: string;
  dialogue: string[];
  quests: string[];
  position: { x: number; y: number };
};

export type Item = {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'accessory' | 'consumable' | 'material';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  description: string;
  stats: Partial<PlayerStats>;
  value: number;
};

export type Enemy = {
  id: string;
  name: string;
  hp: number;
  attack: number;
  defense: number;
  xpReward: number;
  goldReward: number;
  dropTable: string[];
};

export type Faction = {
  id: string;
  name: string;
  description: string;
  color: string;
  homeworld: string;
};

export type WorldEvent = {
  id: string;
  name: string;
  description: string;
  epoch: number;
  impact: string;
};

export type GameState = {
  player: PlayerStats | null;
  currentScene: string;
  quests: Quest[];
  inventory: Item[];
  gold: number;
  worldEvents: WorldEvent[];
  factionReputation: Record<string, number>;
};