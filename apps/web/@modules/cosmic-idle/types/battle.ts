export enum Element {
  PHYSICAL = 'PHYSICAL',
  FIRE = 'FIRE',
  WATER = 'WATER',
  LIGHT = 'LIGHT',
  DARK = 'DARK',
  VOID = 'VOID'
}

export enum StatusEffect {
  POISON = 'POISON',
  STUN = 'STUN',
  ATK_UP = 'ATK_UP',
  DEF_DOWN = 'DEF_DOWN',
  AGI_UP = 'AGI_UP'
}

export interface Skill {
  id: string;
  name: string;
  element: Element;
  power: number;
  mpCost: number;
  accuracy: number;
  statusEffect?: {
    type: StatusEffect;
    chance: number;
    duration: number; // Turns
  };
}

export interface ActiveStatus {
  type: StatusEffect;
  duration: number;
}

export interface Battler {
  id: string;
  templateId?: string; // e.g. speciesId or npcId
  isPlayer: boolean;
  name: string;
  level: number;
  
  // Base Stats
  maxHp: number;
  maxMp: number;
  hp: number;
  mp: number;
  baseAtk: number;
  baseDef: number;
  baseAgi: number;
  
  // Dynamic Battle Data
  statuses: ActiveStatus[];
  skills: Skill[];
  
  // Weakness System (Persona Style)
  weaknesses: Element[];
  resistances: Element[];
  absorbs: Element[];

  // Timeline
  ctbValue: number; // For Conditional Turn Battle queue
}

export enum BattleState {
  INIT = 'INIT',
  DETERMINE_TURN = 'DETERMINE_TURN',
  AWAIT_INPUT = 'AWAIT_INPUT',
  EXECUTE_ACTION = 'EXECUTE_ACTION',
  CHECK_WIN_LOSS = 'CHECK_WIN_LOSS',
  VICTORY = 'VICTORY',
  DEFEAT = 'DEFEAT'
}

export interface TurnAction {
  actorId: string;
  targetId: string;
  type: 'ATTACK' | 'SKILL' | 'ITEM' | 'DEFEND';
  skillId?: string; // If type is SKILL
}
