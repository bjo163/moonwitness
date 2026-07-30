import { INpcStateBehavior, NpcFSM } from '../NpcFSM';

export class PatrolState implements INpcStateBehavior {
  enter(fsm: NpcFSM): void {
    if (!fsm.template.defaultWaypoints || fsm.template.defaultWaypoints.length === 0) {
      fsm.changeState('IDLE');
      return;
    }
    fsm.instance.isWaiting = false;
    fsm.instance.waitTimerMs = 0;
  }

  update(fsm: NpcFSM, delta: number): void {
    const waypoints = fsm.template.defaultWaypoints;
    if (!waypoints || waypoints.length === 0) return;

    // Handle waiting at a waypoint
    if (fsm.instance.isWaiting) {
      fsm.instance.waitTimerMs -= delta;
      if (fsm.instance.waitTimerMs <= 0) {
        fsm.instance.isWaiting = false;
        // Next waypoint
        fsm.instance.currentWaypointIndex = (fsm.instance.currentWaypointIndex + 1) % waypoints.length;
      }
      return;
    }

    // Move to current waypoint
    const target = waypoints[fsm.instance.currentWaypointIndex];
    if (!target) return;

    const reached = fsm.moveTo(target.x, target.y, delta);

    if (reached) {
      fsm.instance.isWaiting = true;
      fsm.instance.waitTimerMs = target.waitTimeMs || 0;
    }
  }

  exit(fsm: NpcFSM): void {
    fsm.instance.isWaiting = false;
  }
}
