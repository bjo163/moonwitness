import { NpcInstance, NpcState } from '../../types/npc';
import { DataManager } from '../../engine/core/DataManager';

export interface INpcStateBehavior {
  enter(fsm: NpcFSM): void;
  update(fsm: NpcFSM, delta: number): void;
  exit(fsm: NpcFSM): void;
}

export class NpcFSM {
  public instance: NpcInstance;
  public template: import('../../schemas/npc.schema').NpcTemplateType;
  
  private states: Record<NpcState, INpcStateBehavior>;
  private activeStateBehavior: INpcStateBehavior | null = null;
  private previousState: NpcState | null = null;

  constructor(instance: NpcInstance, states: Record<NpcState, INpcStateBehavior>) {
    this.instance = instance;
    this.states = states;
    
    const template = DataManager.getNpc(instance.templateId);
    if (!template) throw new Error(`NPC template ${instance.templateId} not found`);
    this.template = template;

    // Set initial state
    this.changeState(instance.currentState);
  }

  public update(delta: number) {
    if (this.activeStateBehavior) {
      this.activeStateBehavior.update(this, delta);
    }
  }

  public changeState(newState: NpcState) {
    if (this.instance.currentState === newState && this.activeStateBehavior) {
      return;
    }

    if (this.activeStateBehavior) {
      this.activeStateBehavior.exit(this);
    }

    this.previousState = this.instance.currentState;
    this.instance.currentState = newState;
    this.activeStateBehavior = this.states[newState];
    
    if (this.activeStateBehavior) {
      this.activeStateBehavior.enter(this);
    }
  }

  public revertToPreviousState() {
    if (this.previousState) {
      this.changeState(this.previousState);
    }
  }

  // --- Utility functions for states to use ---

  public moveTo(x: number, y: number, delta: number, speedMultiplier = 1): boolean {
    if (!this.instance.sprite) return true; // No visual to move

    const speed = this.template.moveSpeed * speedMultiplier * (delta / 1000);
    const dx = x - this.instance.x;
    const dy = y - this.instance.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance <= speed) {
      this.instance.x = x;
      this.instance.y = y;
      // Update sprite position
      this.instance.sprite.x = x;
      this.instance.sprite.y = y;
      return true; // Reached target
    }

    // Normalize and move
    const vx = (dx / distance) * speed;
    const vy = (dy / distance) * speed;

    this.instance.x += vx;
    this.instance.y += vy;
    
    // Update sprite
    this.instance.sprite.x = this.instance.x;
    this.instance.sprite.y = this.instance.y;
    
    return false; // Still moving
  }
}
