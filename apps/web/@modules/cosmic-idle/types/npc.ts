import { NpcTemplateType, NpcWaypointType } from '../schemas/npc.schema';

export type NpcState = 'IDLE' | 'PATROL' | 'FOLLOW' | 'INTERACT' | 'BATTLE';

export interface NpcInstance {
  uuid: string;
  templateId: string;
  mapId: string;
  x: number;
  y: number;
  
  // Runtime AI State
  currentState: NpcState;
  
  // Patrol State Data
  currentWaypointIndex: number;
  isWaiting: boolean;
  waitTimerMs: number;
  
  // Follow State Data
  targetEntityId?: string;
  
  // References to Phaser objects (populated by renderer)
  sprite?: any; // Phaser.GameObjects.Sprite
}
