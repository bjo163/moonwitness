import { MonsterInstance, SerializedMonster, BaseStats } from '../../types/monster';
import { DataManager } from '../../engine/core/DataManager';
import { useInventoryStore } from '../../store/inventory.store';


export class MonsterSystem {
  /**
   * Generates a brand new monster instance with random IVs (0-31) and 0 EVs.
   */
  static generateInstance(speciesId: string, level: number, nickname?: string): MonsterInstance | null {
    const species = DataManager.getMonster(speciesId);
    if (!species) return null;

    const ivs: BaseStats = {
      hp: Math.floor(Math.random() * 32),
      mp: Math.floor(Math.random() * 32),
      atk: Math.floor(Math.random() * 32),
      def: Math.floor(Math.random() * 32),
      agi: Math.floor(Math.random() * 32),
    };

    const evs: BaseStats = { hp: 0, mp: 0, atk: 0, def: 0, agi: 0 };

    // Resolve initial skills based on level
    const activeSkillIds = species.skills.slice(-4); // Keep latest 4 skills

    const instance: MonsterInstance = {
      uuid: crypto.randomUUID(),
      speciesId,
      nickname: nickname || species.name,
      level,
      exp: this.getExpForLevel(level),
      affinity: 50,
      ivs,
      evs,
      stats: { hp: 0, mp: 0, atk: 0, def: 0, agi: 0 }, // Will be calculated below
      currentHp: 0,
      currentMp: 0,
      activeSkillIds,
      heldItemId: null
    };

    this.recalculateStats(instance);
    
    // Fully heal on generate
    instance.currentHp = instance.stats.hp;
    instance.currentMp = instance.stats.mp;

    return instance;
  }

  /**
   * Recalculates stats based on Base Stats, IVs, EVs, and Level.
   * Formula inspired by Gen 3+ Pokemon math.
   */
  static recalculateStats(instance: MonsterInstance) {
    const species = DataManager.getMonster(instance.speciesId);
    if (!species) return;

    const level = instance.level;

    // Base math...
    const baseHp = Math.floor(
      ((2 * species.baseStats.hp + instance.ivs.hp + Math.floor(instance.evs.hp / 4)) * level) / 100
    ) + level + 10;

    const calcStat = (base: number, iv: number, ev: number) => {
      return Math.floor(
        ((2 * base + iv + Math.floor(ev / 4)) * level) / 100
      ) + 5;
    };

    let atk = calcStat(species.baseStats.atk, instance.ivs.atk, instance.evs.atk);
    let def = calcStat(species.baseStats.def, instance.ivs.def, instance.evs.def);
    let agi = calcStat(species.baseStats.spd, instance.ivs.agi, instance.evs.agi);
    let mp = calcStat(species.baseStats.mp, instance.ivs.mp, instance.evs.mp);
    let hp = baseHp;

    // Fetch equipment bonuses dynamically from InventoryStore
    try {
      const equipment = useInventoryStore.getState().equipment[instance.uuid];
      if (equipment) {
        const slots = useInventoryStore.getState().slots;
        const addBonus = (slotId: string | null) => {
          if (!slotId) return;
          const slot = slots.find((s: any) => s.slotId === slotId);
          if (!slot) return;
          const template = DataManager.getItem(slot.itemId) as any;
          if (template && template.stats) {
            if (template.stats.atkBonus) atk += template.stats.atkBonus;
            if (template.stats.defBonus) def += template.stats.defBonus;
            if (template.stats.agiBonus) agi += template.stats.agiBonus;
            if (template.stats.hpBonus) hp += template.stats.hpBonus;
            if (template.stats.mpBonus) mp += template.stats.mpBonus;
          }
        };
        addBonus(equipment.weaponSlot);
        addBonus(equipment.armorSlot);
      }
    } catch (e) {
      // Inventory might not be initialized yet
    }

    instance.stats.hp = hp;
    instance.stats.mp = mp;
    instance.stats.atk = atk;
    instance.stats.def = def;
    instance.stats.agi = agi;
  }

  /**
   * Adds EXP and handles leveling up.
   */
  static addExp(instance: MonsterInstance, amount: number): boolean {
    instance.exp += amount;
    const species = DataManager.getMonster(instance.speciesId);
    if (!species) return false;
    
    let leveledUp = false;

    // Check for level ups
    while (instance.level < 100) {
      const nextLevelExp = this.getExpForLevel(instance.level + 1);
      if (instance.exp >= nextLevelExp) {
        instance.level++;
        leveledUp = true;
      } else {
        break;
      }
    }

    if (leveledUp) {
      this.recalculateStats(instance);
      // In a real engine, we'd also check if new skills are learned here and emit an event
    }

    return leveledUp;
  }

  /**
   * Checks if evolution is possible and returns the target species ID if true.
   */
  static checkEvolution(instance: MonsterInstance): string | null {
    const species = DataManager.getMonster(instance.speciesId);
    if (!species) return null;

    if (!species.evolutions) return null;

    for (const evo of species.evolutions) {
      let canEvolve = true;
      if (evo.levelReq && instance.level < evo.levelReq) canEvolve = false;
      // Item checking would go here
      
      if (canEvolve) return evo.targetId;
    }
    return null;
  }

  /**
   * Evolves the instance into a new species.
   */
  static evolve(instance: MonsterInstance, targetSpeciesId: string): boolean {
    const newSpecies = DataManager.getMonster(targetSpeciesId);
    if (!newSpecies) return false;

    // Change species
    instance.speciesId = targetSpeciesId;

    // If nickname is default old species name, update to new species name
    const oldSpecies = DataManager.getMonster(instance.speciesId);
    if (oldSpecies && instance.nickname === oldSpecies.name) {
      instance.nickname = newSpecies.name;
    }

    // Recalculate stats with new base stats
    this.recalculateStats(instance);
    return true;
  }

  /**
   * Pack for Multiplayer / Save
   */
  static serialize(instance: MonsterInstance): string {
    const payload: SerializedMonster = {
      uuid: instance.uuid,
      speciesId: instance.speciesId,
      nickname: instance.nickname,
      level: instance.level,
      exp: instance.exp,
      affinity: instance.affinity,
      currentHp: instance.currentHp,
      currentMp: instance.currentMp,
      ivs: instance.ivs,
      evs: instance.evs,
      activeSkillIds: instance.activeSkillIds,
      heldItemId: instance.heldItemId
    };
    return JSON.stringify(payload);
  }

  /**
   * Unpack from Multiplayer / Save
   */
  static deserialize(jsonString: string): MonsterInstance {
    const payload: SerializedMonster = JSON.parse(jsonString);
    const instance: MonsterInstance = {
      ...payload,
      stats: { hp: 0, mp: 0, atk: 0, def: 0, agi: 0 }
    };
    this.recalculateStats(instance);
    return instance;
  }

  private static getExpForLevel(level: number): number {
    // Simplified EXP math for the framework
    // e.g., MEDIUM_FAST: level^3
    return Math.pow(level, 3);
  }

  /**
   * Adapts a MonsterInstance into a Battler for the Battle Engine.
   */
  static toBattler(instance: MonsterInstance, isPlayer: boolean): import('../../types/battle').Battler {
    const species = DataManager.getMonster(instance.speciesId);
    return {
      id: instance.uuid,
      templateId: instance.speciesId,
      isPlayer,
      name: instance.nickname,
      level: instance.level,
      maxHp: instance.stats.hp,
      maxMp: instance.stats.mp,
      hp: instance.currentHp,
      mp: instance.currentMp,
      baseAtk: instance.stats.atk,
      baseDef: instance.stats.def,
      baseAgi: instance.stats.agi,
      statuses: [],
      skills: [], // We'd populate this from activeSkillIds looking up a SKILL_DB
      weaknesses: [], // Resolve from species.affinities in the future
      resistances: [],
      absorbs: [],
      ctbValue: 0
    };
  }
}
