import { INpcStateBehavior, NpcFSM } from '../NpcFSM';

export class IdleState implements INpcStateBehavior {
  enter(fsm: NpcFSM): void {
    fsm.instance.isWaiting = false;
    // Play idle animation
    if (fsm.instance.sprite) {
      // fsm.instance.sprite.play('idle');
    }
  }

  update(fsm: NpcFSM, delta: number): void {
    // If the NPC has a default behavior of Patrol and it has waypoints, switch to patrol
    if (fsm.template.defaultBehavior === 'PATROL' && fsm.template.defaultWaypoints && fsm.template.defaultWaypoints.length > 0) {
      fsm.changeState('PATROL');
    }
  }

  exit(fsm: NpcFSM): void {
    // Cleanup if needed
  }
}
