import { NpcFSM, INpcStateBehavior } from './NpcFSM';
import { NpcInstance, NpcState } from '../../types/npc';
import { IdleState } from './states/IdleState';
import { PatrolState } from './states/PatrolState';
import { InteractState } from './states/InteractState';
import { FollowState } from './states/FollowState';
import { DataManager } from '../../engine/core/DataManager';
import { EventBus } from '../../engine/core/EventBus';

export class NpcSystem {
  private static npcs: Map<string, NpcFSM> = new Map();
  private static states: Record<NpcState, INpcStateBehavior>;

  static initialize() {
    this.states = {
      IDLE: new IdleState(),
      PATROL: new PatrolState(),
      INTERACT: new InteractState(),
      FOLLOW: new FollowState(),
      BATTLE: new IdleState() // Placeholder for Battle AI state
    };

    EventBus.on('npc:interact', this.handleInteraction, this);
    EventBus.on('dialogue:ended', this.handleDialogueEnd, this);
  }

  static destroy() {
    EventBus.off('npc:interact', this.handleInteraction, this);
    EventBus.off('dialogue:ended', this.handleDialogueEnd, this);
    this.npcs.clear();
  }

  /**
   * Spawns an NPC into the scene. 
   * In a real game, Tiled object data would be passed here to set initial X/Y.
   */
  static spawnNpc(templateId: string, mapId: string, x: number, y: number): NpcFSM | null {
    const template = DataManager.getNpc(templateId);
    if (!template) return null;

    const instance: NpcInstance = {
      uuid: crypto.randomUUID(),
      templateId,
      mapId,
      x,
      y,
      currentState: template.defaultBehavior as NpcState,
      currentWaypointIndex: 0,
      isWaiting: false,
      waitTimerMs: 0
    };

    const fsm = new NpcFSM(instance, this.states);
    this.npcs.set(instance.uuid, fsm);
    return fsm;
  }

  static despawnNpc(uuid: string) {
    this.npcs.delete(uuid);
  }

  /**
   * Called every frame by the active Phaser Scene.
   */
  static update(delta: number) {
    for (const fsm of this.npcs.values()) {
      fsm.update(delta);
    }
  }

  private static handleInteraction(npcUuid: string) {
    const fsm = this.npcs.get(npcUuid);
    if (fsm) {
      fsm.changeState('INTERACT');
    }
  }

  private static handleDialogueEnd() {
    // Revert all interacting NPCs back to their previous state
    for (const fsm of this.npcs.values()) {
      if (fsm.instance.currentState === 'INTERACT') {
        fsm.revertToPreviousState();
      }
    }
  }
}
