export type DialogueActionType = 'GIVE_ITEM' | 'START_QUEST' | 'EMIT_EVENT' | 'ADD_NUR';

export interface DialogueAction {
  type: DialogueActionType;
  payload?: any;
}

export interface DialogueChoice {
  text: string;
  nextNodeId: string;
  triggers?: DialogueAction[];
}

export interface DialogueNode {
  id: string;
  speakerName: string;
  portraitIcon?: string; // We'll use lucide icon names for now
  text: string;
  choices?: DialogueChoice[];
  nextNodeId?: string; // If no choices, it can linearly progress to this node
  endDialogue?: boolean; // Set to true to close the overlay
  triggers?: DialogueAction[]; // Actions to trigger when this node is READ
}

export interface DialogueTree {
  id: string;
  nodes: Record<string, DialogueNode>;
  startNodeId: string;
}
