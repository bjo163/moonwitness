import { EventBus } from '../engine/core/EventBus';
import { useDialogueStore } from '../store/dialogue.store';
import { usePlayerStore } from '../store/player.store';
import { DIALOGUE_DB } from '../data/dialogues';
import { DialogueAction, DialogueNode } from '../types/dialogue';

export class DialogueSystem {
  static initialize() {
    EventBus.on('ui:show_dialogue', this.handleShowDialogue, this);
    EventBus.on('dialogue:process_triggers', this.processTriggers, this);
  }

  static destroy() {
    EventBus.off('ui:show_dialogue', this.handleShowDialogue, this);
    EventBus.off('dialogue:process_triggers', this.processTriggers, this);
  }

  static handleShowDialogue(dialogueKey: string) {
    const tree = DIALOGUE_DB[dialogueKey];
    if (tree) {
      // Setup the store to display it
      useDialogueStore.getState().openDialogue(tree);
      
      // Process initial node triggers
      const startNode = tree.nodes[tree.startNodeId];
      if (startNode) {
        this.processTriggers(startNode.triggers);
      }
    } else {
      console.warn(`Dialogue key ${dialogueKey} not found.`);
    }
  }

  static processTriggers(triggers?: DialogueAction[]) {
    if (!triggers || triggers.length === 0) return;

    triggers.forEach(trigger => {
      switch (trigger.type) {
        case 'ADD_NUR':
          usePlayerStore.getState().addNur(trigger.payload);
          break;
        case 'START_QUEST':
          // The payload is the quest ID
          EventBus.emit('quest:start', trigger.payload);
          // And we also want to dynamically import QuestSystem if we need to call it directly, 
          // or better yet, QuestSystem should listen to 'quest:start'. Let's do that!
          break;
        case 'EMIT_EVENT':
          EventBus.emit(trigger.payload);
          break;
        // Future: GIVE_ITEM, START_QUEST, etc.
      }
    });
  }
}
