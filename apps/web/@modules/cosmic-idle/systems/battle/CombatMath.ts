import { Battler, Element, Skill } from '../../types/battle';

export interface DamageResult {
  damage: number;
  isCritical: boolean;
  isWeakness: boolean;
  isResisted: boolean;
  isAbsorbed: boolean;
}

export class CombatMath {
  /**
   * Core Damage Formula
   */
  static calculateDamage(attacker: Battler, defender: Battler, skill: Skill): DamageResult {
    const isPhysical = skill.element === Element.PHYSICAL;
    
    // In many RPGs, magic scales differently, but we'll use a unified ATK for this framework
    const atk = attacker.baseAtk; 
    const def = defender.baseDef;

    // Base damage formula (similar to Golden Sun / Final Fantasy)
    // Damage = (Power * Atk / Def) * RandomVariance
    let baseDamage = (skill.power * (atk / def)) * 1.5;

    // Variance 85% to 115%
    const variance = (Math.random() * 0.3) + 0.85;
    baseDamage *= variance;

    let isCritical = false;
    let isWeakness = false;
    let isResisted = false;
    let isAbsorbed = false;

    // Critical Hit (only on physical, base 5% + Agi diff)
    if (isPhysical) {
      const critChance = 0.05 + Math.max(0, (attacker.baseAgi - defender.baseAgi) / 1000);
      if (Math.random() < critChance) {
        baseDamage *= 1.5;
        isCritical = true;
      }
    }

    // Elemental Multipliers (Persona Style)
    if (defender.absorbs.includes(skill.element)) {
      isAbsorbed = true;
      baseDamage = -baseDamage; // Heals instead
    } else if (defender.weaknesses.includes(skill.element)) {
      isWeakness = true;
      baseDamage *= 2.0; // 200% Damage
    } else if (defender.resistances.includes(skill.element)) {
      isResisted = true;
      baseDamage *= 0.5; // 50% Damage
    }

    // Return integer damage
    return {
      damage: Math.round(baseDamage),
      isCritical,
      isWeakness,
      isResisted,
      isAbsorbed
    };
  }

  /**
   * Experience Curve
   */
  static expForLevel(level: number): number {
    // Exponential curve: e.g. Lv 1 = 0, Lv 2 = 100, Lv 3 = 250, Lv 4 = 475
    return Math.floor(100 * Math.pow(level - 1, 1.5));
  }
}
