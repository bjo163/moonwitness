import { useProgressionStore } from '../../store/progression.store';
import { DataManager } from '../../engine/core/DataManager';
import { EventBus } from '../../engine/core/EventBus';
import { PlayerAttributes } from '../../types/progression';

export class ProgressionSystem {
  
  static initialize() {
    EventBus.on('progression:add_exp', this.onAddExp, this);
    EventBus.on('progression:achievement_event', this.onAchievementEvent, this);
    EventBus.on('equipment:changed', this.recalculateStats, this); // Recalculate if we had player equipment
  }

  static destroy() {
    EventBus.off('progression:add_exp', this.onAddExp, this);
    EventBus.off('progression:achievement_event', this.onAchievementEvent, this);
    EventBus.off('equipment:changed', this.recalculateStats, this);
  }

  static getExpForNextLevel(level: number): number {
    const curve = DataManager.getProgression().expCurve;
    return Math.floor(curve.base * Math.pow(curve.multiplier, level - 1));
  }

  private static onAddExp(amount: number) {
    const store = useProgressionStore.getState();
    const curve = DataManager.getProgression().expCurve;
    if (store.level >= curve.maxLevel) return;

    let newExp = store.exp + amount;
    let newLevel = store.level;
    let levelUpOccurred = false;

    while (newLevel < curve.maxLevel) {
      const required = this.getExpForNextLevel(newLevel);
      if (newExp >= required) {
        newExp -= required;
        newLevel++;
        levelUpOccurred = true;
      } else {
        break;
      }
    }

    store.setExp(newExp);
    
    if (levelUpOccurred) {
      const levelsGained = newLevel - store.level;
      store.setLevel(newLevel);
      // Give 5 AP and 1 SP per level
      store.setAp(store.ap + (levelsGained * 5));
      store.setSp(store.sp + (levelsGained * 1));
      
      this.recalculateStats();
      EventBus.emit('ui:toast', `Level Up! Reached Level ${newLevel}`);
    }
  }

  static allocateAttribute(attr: keyof PlayerAttributes, points: number): boolean {
    const store = useProgressionStore.getState();
    if (store.ap < points) return false;

    store.setAp(store.ap - points);
    store.setAttributes({
      ...store.attributes,
      [attr]: store.attributes[attr] + points
    });

    this.recalculateStats();
    return true;
  }

  static recalculateStats() {
    const store = useProgressionStore.getState();
    const playerClass = DataManager.getProgression().classes[store.classId];
    if (!playerClass) return;

    // 1. Base Stats + Growth
    const hp = playerClass.baseStats.hp + (playerClass.statGrowth.hp * (store.level - 1));
    const mp = playerClass.baseStats.mp + (playerClass.statGrowth.mp * (store.level - 1));
    let atk = playerClass.baseStats.atk + (playerClass.statGrowth.atk * (store.level - 1));
    let def = playerClass.baseStats.def + (playerClass.statGrowth.def * (store.level - 1));
    let mag = playerClass.baseStats.mag + (playerClass.statGrowth.mag * (store.level - 1));
    let mdef = playerClass.baseStats.mdef + (playerClass.statGrowth.mdef * (store.level - 1));
    let spd = playerClass.baseStats.spd + (playerClass.statGrowth.spd * (store.level - 1));
    let luk = playerClass.baseStats.luk + (playerClass.statGrowth.luk * (store.level - 1));

    // 2. Attributes (Custom Math)
    const attrs = store.attributes;
    const finalHp = hp + (attrs.vit * 10);
    const finalDef = def + (attrs.vit * 1);
    
    const finalAtk = atk + (attrs.str * 2);
    
    const finalMag = mag + (attrs.int * 2);
    const finalMp = mp + (attrs.int * 5);
    
    const finalMdef = mdef + (attrs.spr * 2);
    
    const finalSpd = spd + (attrs.agi * 1);
    
    const finalLuk = luk + (attrs.luk * 1);

    const calculated = {
      hp: finalHp,
      mp: finalMp,
      atk: finalAtk,
      def: finalDef,
      mag: finalMag,
      mdef: finalMdef,
      spd: finalSpd,
      luk: finalLuk
    };

    // 3. Title Passives
    if (store.activeTitle) {
      const title = DataManager.getProgression().titles[store.activeTitle];
      if (title && title.bonuses) {
        if (title.bonuses.hp) calculated.hp += title.bonuses.hp;
        if (title.bonuses.mp) calculated.mp += title.bonuses.mp;
        if (title.bonuses.atk) calculated.atk += title.bonuses.atk;
        if (title.bonuses.def) calculated.def += title.bonuses.def;
        if (title.bonuses.mag) calculated.mag += title.bonuses.mag;
        if (title.bonuses.mdef) calculated.mdef += title.bonuses.mdef;
        if (title.bonuses.spd) calculated.spd += title.bonuses.spd;
        if (title.bonuses.luk) calculated.luk += title.bonuses.luk;
      }
    }

    // 4. Update Store
    store.setStats(calculated);
  }

  private static onAchievementEvent(payload: { type: string, amount: number }) {
    const store = useProgressionStore.getState();
    const achievements = DataManager.getProgression().achievements;
    
    Object.values(achievements).forEach((ach: any) => {
      if (ach.type === payload.type) {
        const progress = store.achievements[ach.id] || { id: ach.id, currentAmount: 0, isUnlocked: false };
        if (progress.isUnlocked) return;

        progress.currentAmount += payload.amount;
        if (progress.currentAmount >= ach.targetAmount) {
          progress.currentAmount = ach.targetAmount;
          progress.isUnlocked = true;
          
          EventBus.emit('ui:toast', `Achievement Unlocked: ${ach.name}`);
          
          if (ach.rewardTitleId) {
            this.unlockTitle(ach.rewardTitleId);
          }
        }
        
        store.updateAchievement(ach.id, { ...progress });
      }
    });
  }

  static unlockTitle(titleId: string) {
    const title = DataManager.getProgression().titles[titleId];
    if (title) {
      useProgressionStore.getState().addTitle(titleId);
      EventBus.emit('ui:toast', `Title Unlocked: ${title.name}`);
    }
  }

  // --- NG+ ---
  static newGamePlus() {
    const store = useProgressionStore.getState();
    
    // Keep titles, achievements, increase NG+ count.
    // Reset Level, EXP, Attributes (refund AP).
    const refundedAp = (store.level - 1) * 5;
    
    store.setNgPlusCount(store.ngPlusCount + 1);
    store.setLevel(1);
    store.setExp(0);
    store.setAp(refundedAp); // Or reset to 0 based on design
    store.setAttributes({ str: 0, vit: 0, int: 0, spr: 0, agi: 0, luk: 0 });
    
    this.recalculateStats();
    EventBus.emit('ui:toast', `Entered New Game+ ${store.ngPlusCount}`);
  }

  static getEnemyDifficultyMultiplier(): number {
    const ngPlus = useProgressionStore.getState().ngPlusCount;
    // Every NG+ adds 50% to enemy stats
    return 1 + (ngPlus * 0.5);
  }
}
