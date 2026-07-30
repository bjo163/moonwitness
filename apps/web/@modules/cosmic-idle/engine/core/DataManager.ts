import { monsterDatabaseSchema, MonsterTemplateType } from '../../schemas/monster.schema';
import { itemDatabaseSchema, ItemType } from '../../schemas/item.schema';
import { questDatabaseSchema, QuestTemplateType } from '../../schemas/quest.schema';
import { progressionDatabaseSchema } from '../../schemas/progression.schema';
import { npcDatabaseSchema, NpcTemplateType } from '../../schemas/npc.schema';

// We import JSON files directly. Webpack/Turbopack handles this perfectly,
// giving us hot-reloading for free during dev!
import monstersJson from '../../data/monsters.json';
import itemsJson from '../../data/items.json';
import questsJson from '../../data/quests.json';
import progressionJson from '../../data/progression.json';
import npcsJson from '../../data/npcs.json';

export class DataManager {
  private static monsters: Record<string, MonsterTemplateType> = {};
  private static items: Record<string, ItemType> = {};
  private static quests: Record<string, QuestTemplateType> = {};
  private static npcs: Record<string, NpcTemplateType> = {};
  private static progression: any = {};
  
  private static initialized = false;

  static initialize() {
    if (this.initialized) return;

    try {
      console.log("[DataManager] Validating external JSON data with Zod...");
      
      // The parse() function will throw an error if the JSON is malformed
      // or doesn't match the strict schema.
      this.monsters = monsterDatabaseSchema.parse(monstersJson);
      this.items = itemDatabaseSchema.parse(itemsJson);
      this.quests = questDatabaseSchema.parse(questsJson);
      this.npcs = npcDatabaseSchema.parse(npcsJson);
      this.progression = progressionDatabaseSchema.parse(progressionJson);

      this.initialized = true;
      console.log("[DataManager] All data loaded and validated successfully!");
      
    } catch (error) {
      console.error("[DataManager] FATAL ERROR: Invalid Game Data!");
      console.error(error);
      // In a real app we might show a fatal error screen here
    }
  }

  // --- Getters ---

  static getMonster(id: string): MonsterTemplateType | undefined {
    return this.monsters[id];
  }
  
  static getAllMonsters(): MonsterTemplateType[] {
    return Object.values(this.monsters);
  }

  static getItem(id: string): ItemType | undefined {
    return this.items[id];
  }
  
  static getAllItems(): ItemType[] {
    return Object.values(this.items);
  }

  static getQuest(id: string): QuestTemplateType | undefined {
    return this.quests[id];
  }
  
  static getAllQuests(): QuestTemplateType[] {
    return Object.values(this.quests);
  }

  static getProgression() {
    return this.progression;
  }

  static getNpc(id: string): NpcTemplateType | undefined {
    return this.npcs[id];
  }

  static getAllNpcs(): NpcTemplateType[] {
    return Object.values(this.npcs);
  }
}
