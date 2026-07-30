export type QuestType = 'STORY' | 'SIDE' | 'DAILY';
export type QuestStatus = 'INACTIVE' | 'ACTIVE' | 'COMPLETED' | 'REWARD_CLAIMED';
export type ObjectiveType = 'KILL_MONSTER' | 'COLLECT_ITEM' | 'TALK_NPC' | 'REACH_NODE';

export interface QuestReward {
  type: 'NUR' | 'EXP' | 'ITEM' | 'MONSTER';
  id?: string; // e.g., itemId or monsterId
  amount: number;
}

export interface QuestObjective {
  id: string; // e.g., "obj_kill_slime_1"
  type: ObjectiveType;
  targetId: string; // e.g., "m_001"
  requiredAmount: number;
  description: string;
}

export interface QuestTemplate {
  id: string;
  type: QuestType;
  title: string;
  description: string;
  objectives: QuestObjective[];
  rewards: QuestReward[];
  nextQuestId?: string; // For story chains
}

export interface ObjectiveProgress {
  id: string;
  currentAmount: number;
}

export interface QuestInstance {
  id: string; // Matches template ID
  status: QuestStatus;
  progress: Record<string, ObjectiveProgress>; // Keyed by Objective ID
  timestamp?: number; // Used for Daily Quests to track reset time
}

// Global Event payload shapes
export interface QuestEventPayload {
  type: ObjectiveType;
  targetId: string;
  amount: number;
}
