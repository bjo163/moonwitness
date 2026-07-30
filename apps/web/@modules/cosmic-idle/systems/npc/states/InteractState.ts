import { INpcStateBehavior, NpcFSM } from '../NpcFSM';
import { EventBus } from '../../../engine/core/EventBus';
import { DataManager } from '../../../engine/core/DataManager';

export class InteractState implements INpcStateBehavior {
  enter(fsm: NpcFSM): void {
    // Stop moving, face player
    // In a grid-based system, we would calculate direction to face player based on player position.
    
    // Trigger interaction logic based on NPC role
    this.triggerInteraction(fsm);
  }

  update(fsm: NpcFSM, delta: number): void {
    // Wait here until interaction is over.
    // The NpcSystem or UI will signal when the interaction is done to revert state.
  }

  exit(fsm: NpcFSM): void {
    // Resume previous activities
  }

  private triggerInteraction(fsm: NpcFSM) {
    const role = fsm.template.role;

    if (role === 'MERCHANT' && fsm.template.shopId) {
      EventBus.emit('ui:open_shop', fsm.template.shopId);
    } 
    else if (fsm.template.defaultDialogueId) {
      EventBus.emit('dialogue:start', fsm.template.defaultDialogueId);
    }
    else {
      // Fallback interaction
      EventBus.emit('ui:toast', `${fsm.template.name} has nothing to say right now.`);
    }
  }
}
