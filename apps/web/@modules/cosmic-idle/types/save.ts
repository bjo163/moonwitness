import { PlayerState } from '../store/player.store';
import { InventoryStoreState } from '../store/inventory.store';
import { ProgressionStoreState } from '../store/progression.store';
import { QuestStoreState } from '../store/quest.store';
// For monster state, we need to know the shape it's saved in, probably a list of SerializedMonster.
import { SerializedMonster } from './monster';

export const CURRENT_SAVE_VERSION = 'v1.0.0';

export interface SaveHeader {
  slotId: number;
  version: string;
  timestamp: number;
  playtime: number; // in seconds
  location: string;
  playerLevel: number;
}

export interface SavePayload {
  // Store States
  player: PlayerState;
  progression: ProgressionStoreState;
  inventory: InventoryStoreState;
  quests: QuestStoreState;
  
  // Custom serialized states
  monsters: SerializedMonster[];
  
  // Settings & Flags
  settings: Record<string, any>;
  worldFlags: Record<string, boolean>;
}

export interface SaveFile {
  header: SaveHeader;
  payload: SavePayload;
  hash: string; // Integrity checksum
}
