// Singleton Event Bus for Cross-Boundary Communication (React <-> Phaser)
// We use a custom emitter to avoid importing Phaser (and 'window') in SSR environments.

type Callback = (...args: any[]) => void;

class CustomEventEmitter {
  private events: Map<string, Callback[]> = new Map();

  on(event: string, callback: Callback, context?: any) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    // Bind context if provided, otherwise keep as is
    const boundCallback = context ? callback.bind(context) : callback;
    // Store original callback for off() comparison
    (boundCallback as any)._original = callback;
    this.events.get(event)!.push(boundCallback);
  }

  off(event: string, callback: Callback, context?: any) {
    if (!this.events.has(event)) return;
    const callbacks = this.events.get(event)!;
    this.events.set(
      event,
      callbacks.filter((cb) => cb !== callback && (cb as any)._original !== callback)
    );
  }

  emit(event: string, ...args: any[]) {
    if (!this.events.has(event)) return;
    this.events.get(event)!.forEach((callback) => {
      callback(...args);
    });
  }
}

export const EventBus = new CustomEventEmitter();

// Strongly typed event names
export const GameEvents = {
  // Phaser -> React
  SCENE_READY: 'SCENE_READY',
  UPDATE_PLAYER_HP: 'UPDATE_PLAYER_HP',
  UPDATE_ENEMY_HP: 'UPDATE_ENEMY_HP',
  BATTLE_START: 'BATTLE_START',
  BATTLE_END: 'BATTLE_END',
  
  // React -> Phaser
  EQUIP_ITEM: 'EQUIP_ITEM',
  PLAYER_ATTACK: 'PLAYER_ATTACK',
  PLAYER_SKILL: 'PLAYER_SKILL',
  PLAYER_DEFEND: 'PLAYER_DEFEND',
  PLAYER_RUN: 'PLAYER_RUN',
} as const;
