import { INpcStateBehavior, NpcFSM } from '../NpcFSM';

export class FollowState implements INpcStateBehavior {
  enter(fsm: NpcFSM): void {
    // Determine target
  }

  update(fsm: NpcFSM, delta: number): void {
    if (!fsm.instance.targetEntityId) {
      fsm.revertToPreviousState();
      return;
    }

    // In a full game, we would query the global ECS or Scene for the target's position
    // and move towards it. For this framework, we'll just log it.
  }

  exit(fsm: NpcFSM): void {
    fsm.instance.targetEntityId = undefined;
  }
}
