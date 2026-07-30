import { useBattleStore } from '../../store/battle.store';
import { Battler, BattleState, TurnAction, Element } from '../../types/battle';
import { EventBus } from '../../engine/core/EventBus';
import { CombatMath } from './CombatMath';

const CTB_THRESHOLD = 1000;

export class BattleEngine {
  private static unsubscribe: (() => void) | null = null;
  private static isEngineRunning: boolean = false;

  static initialize() {
    if (this.isEngineRunning) return;
    this.isEngineRunning = true;
    
    // Subscribe to store changes to intercept UI inputs
    this.unsubscribe = useBattleStore.subscribe(
      (state) => {
        if (state.pendingAction && state.state === BattleState.AWAIT_INPUT) {
          this.executeTurn(state.pendingAction);
        }
      }
    );
  }

  static destroy() {
    if (this.unsubscribe) this.unsubscribe();
    this.isEngineRunning = false;
  }

  static startBattle(player: Battler, enemy: Battler) {
    const store = useBattleStore.getState();
    store.initBattle(player, enemy);
    
    // Reset CTB
    player.ctbValue = 0;
    enemy.ctbValue = 0;

    EventBus.emit('battle:start');
    
    this.tickTimeline();
  }

  /**
   * Advances time until a battler reaches the turn threshold (CTB_THRESHOLD).
   */
  private static tickTimeline() {
    const store = useBattleStore.getState();
    const { player, enemy } = store;
    
    if (!player || !enemy) return;
    
    // Check win/loss before continuing
    if (player.hp <= 0) {
      this.endBattle(BattleState.DEFEAT);
      return;
    }
    if (enemy.hp <= 0) {
      this.endBattle(BattleState.VICTORY);
      return;
    }

    store.setState(BattleState.DETERMINE_TURN);

    // Tick loop
    while (player.ctbValue < CTB_THRESHOLD && enemy.ctbValue < CTB_THRESHOLD) {
      player.ctbValue += player.baseAgi;
      enemy.ctbValue += enemy.baseAgi;
    }

    // Determine who goes next
    let activeBattler: Battler;
    if (player.ctbValue >= CTB_THRESHOLD && enemy.ctbValue >= CTB_THRESHOLD) {
      activeBattler = player.ctbValue >= enemy.ctbValue ? player : enemy;
    } else {
      activeBattler = player.ctbValue >= CTB_THRESHOLD ? player : enemy;
    }

    // Spend CTB
    activeBattler.ctbValue -= CTB_THRESHOLD;
    
    store.setActiveTurn(activeBattler.id);
    EventBus.emit('battle:turn_start', activeBattler.id);

    if (activeBattler.isPlayer) {
      // Await React UI input
      store.setState(BattleState.AWAIT_INPUT);
    } else {
      // Simple AI
      setTimeout(() => this.executeEnemyAI(), 1000);
    }
  }

  private static executeEnemyAI() {
    const store = useBattleStore.getState();
    if (!store.enemy || !store.player) return;

    const action: TurnAction = {
      actorId: store.enemy.id,
      targetId: store.player.id,
      type: 'ATTACK'
    };
    this.executeTurn(action);
  }

  private static executeTurn(action: TurnAction) {
    const store = useBattleStore.getState();
    store.clearPendingAction();
    store.setState(BattleState.EXECUTE_ACTION);

    const { player, enemy } = store;
    if (!player || !enemy) return;

    const attacker = action.actorId === player.id ? player : enemy;
    const defender = action.targetId === player.id ? player : enemy;

    if (action.type === 'ATTACK') {
      // Basic Attack Skill Mock
      const basicAttack = {
        id: 'attack', name: 'Attack', element: Element.PHYSICAL, power: 10, mpCost: 0, accuracy: 100
      };

      const result = CombatMath.calculateDamage(attacker, defender, basicAttack);
      const newHp = defender.hp - result.damage;
      
      // Update Store
      store.updateHp(defender.id, newHp);
      
      // Notify Visuals
      EventBus.emit('battle:attack_hit', {
        attackerId: attacker.id,
        targetId: defender.id,
        damage: result.damage,
        isCritical: result.isCritical,
        isWeakness: result.isWeakness
      });
    }

    // End Turn after short delay for animations
    setTimeout(() => {
      this.tickTimeline();
    }, 1500);
  }

  private static endBattle(result: BattleState) {
    const store = useBattleStore.getState();
    store.setState(result);
    EventBus.emit('battle:end', result);
    
    if (result === BattleState.VICTORY) {
      // Process EXP and drops
      console.log("Battle Won! Calculating Rewards...");
      
      // Notify Progression System
      EventBus.emit('progression:add_exp', 50); // Hardcoded mock EXP for now
      EventBus.emit('progression:achievement_event', { type: 'KILL_MONSTERS', amount: 1 });
      
      const enemy = store.enemy;
      if (enemy) {
        EventBus.emit('quest:progress', {
          type: 'KILL_MONSTER',
          targetId: enemy.templateId || enemy.id,
          amount: 1
        });
      }
    }
  }
}
