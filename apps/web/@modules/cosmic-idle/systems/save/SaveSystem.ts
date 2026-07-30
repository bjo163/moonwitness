import { EventBus } from '../../engine/core/EventBus';
import { usePlayerStore } from '../../store/player.store';
import { useInventoryStore } from '../../store/inventory.store';
import { useProgressionStore } from '../../store/progression.store';
import { useQuestStore } from '../../store/quest.store';
import { useSaveStore } from '../../store/save.store';
import { SaveFile, SaveHeader, SavePayload, CURRENT_SAVE_VERSION } from '../../types/save';
import { SaveMigrator } from './SaveMigrator';

const SAVE_KEY_PREFIX = 'moonwitness_save_';
const HASH_SALT = 'c0sm1c_s3cr3t_v1';

export class SaveSystem {
  private static autoSaveTimer: any = null;
  private static sessionStartTime: number = Date.now();
  private static accumulatedPlaytime: number = 0; // Loaded from save

  static initialize() {
    EventBus.on('save:auto_request', this.handleAutoSave, this);
    this.refreshHeaders();
  }

  static destroy() {
    EventBus.off('save:auto_request', this.handleAutoSave, this);
    if (this.autoSaveTimer) clearTimeout(this.autoSaveTimer);
  }

  // --- Core Engine ---

  static saveToSlot(slotId: number) {
    try {
      const payload = this.collectPayload();
      
      const currentSessionPlaytime = Math.floor((Date.now() - this.sessionStartTime) / 1000);
      const totalPlaytime = this.accumulatedPlaytime + currentSessionPlaytime;

      const header: SaveHeader = {
        slotId,
        version: CURRENT_SAVE_VERSION,
        timestamp: Date.now(),
        playtime: totalPlaytime,
        location: usePlayerStore.getState().currentScene,
        playerLevel: useProgressionStore.getState().level,
      };

      const file: SaveFile = {
        header,
        payload,
        hash: ''
      };

      // Generate hash (A real production game would use SHA-256 via SubtleCrypto)
      file.hash = this.generateHash(JSON.stringify(header) + JSON.stringify(payload));

      const serialized = JSON.stringify(file);
      
      // Create Backup of existing before overwrite
      this.createBackup(slotId);

      // Save new
      localStorage.setItem(`${SAVE_KEY_PREFIX}${slotId}`, serialized);

      // Update UI Store
      useSaveStore.getState().updateHeader(slotId, header);
      
      EventBus.emit('ui:toast', `Game Saved to Slot ${slotId}`);
      console.log(`[SaveSystem] Successfully wrote to slot ${slotId}`);
      return true;
    } catch (error) {
      console.error("[SaveSystem] Save failed", error);
      EventBus.emit('ui:toast', `Save Failed!`);
      return false;
    }
  }

  static loadFromSlot(slotId: number): boolean {
    try {
      const serialized = localStorage.getItem(`${SAVE_KEY_PREFIX}${slotId}`);
      if (!serialized) return false;

      const file: SaveFile = JSON.parse(serialized);

      // 1. Validate Hash
      const expectedHash = this.generateHash(JSON.stringify(file.header) + JSON.stringify(file.payload));
      if (file.hash !== expectedHash) {
        console.error(`[SaveSystem] Hash mismatch on slot ${slotId}. Save file may be corrupted or tampered with.`);
        EventBus.emit('ui:toast', 'Save Corrupted! Attempting to restore backup...');
        return this.restoreBackup(slotId);
      }

      // 2. Migrate Version
      const migratedPayload = SaveMigrator.migrate(file.header.version, file.payload);

      // 3. Inject State
      this.injectPayload(migratedPayload);

      // 4. Update Session Data
      this.accumulatedPlaytime = file.header.playtime;
      this.sessionStartTime = Date.now();

      EventBus.emit('ui:toast', `Game Loaded from Slot ${slotId}`);
      EventBus.emit('save:load_success');
      return true;

    } catch (error) {
      console.error(`[SaveSystem] Load failed for slot ${slotId}`, error);
      return this.restoreBackup(slotId);
    }
  }

  // --- Auto Save ---

  private static handleAutoSave() {
    if (this.autoSaveTimer) clearTimeout(this.autoSaveTimer);
    
    // Debounce autosave to prevent spamming IO
    this.autoSaveTimer = setTimeout(() => {
      console.log("[SaveSystem] Executing Auto-Save...");
      this.saveToSlot(0); // Slot 0 is reserved for Auto-Save
    }, 2000);
  }

  // --- Backups ---

  private static createBackup(slotId: number) {
    const existing = localStorage.getItem(`${SAVE_KEY_PREFIX}${slotId}`);
    if (existing) {
      localStorage.setItem(`${SAVE_KEY_PREFIX}${slotId}_bak`, existing);
    }
  }

  private static restoreBackup(slotId: number): boolean {
    const backup = localStorage.getItem(`${SAVE_KEY_PREFIX}${slotId}_bak`);
    if (!backup) {
      console.error(`[SaveSystem] No backup found for slot ${slotId}.`);
      return false;
    }

    try {
      localStorage.setItem(`${SAVE_KEY_PREFIX}${slotId}`, backup);
      console.log(`[SaveSystem] Restored backup for slot ${slotId}. Trying load again...`);
      // We don't loop indefinitely, just one attempt
      const file: SaveFile = JSON.parse(backup);
      const migrated = SaveMigrator.migrate(file.header.version, file.payload);
      this.injectPayload(migrated);
      EventBus.emit('ui:toast', 'Backup Restored Successfully.');
      return true;
    } catch (e) {
      console.error("[SaveSystem] Backup is also corrupted.", e);
      return false;
    }
  }

  // --- Utils ---

  static refreshHeaders() {
    const headers: Record<number, SaveHeader> = {};
    for (let i = 0; i < 10; i++) {
      const serialized = localStorage.getItem(`${SAVE_KEY_PREFIX}${i}`);
      if (serialized) {
        try {
          const file: SaveFile = JSON.parse(serialized);
          headers[i] = file.header;
        } catch (e) {}
      }
    }
    useSaveStore.getState().setHeaders(headers);
  }

  private static collectPayload(): SavePayload {
    return {
      player: usePlayerStore.getState(),
      progression: useProgressionStore.getState(),
      inventory: useInventoryStore.getState(),
      quests: useQuestStore.getState(),
      monsters: [], // We would call MonsterSystem.serializeAll() here
      settings: {},
      worldFlags: {}
    };
  }

  private static injectPayload(payload: SavePayload) {
    if (payload.player) usePlayerStore.setState(payload.player);
    if (payload.progression) useProgressionStore.setState(payload.progression);
    if (payload.inventory) useInventoryStore.setState(payload.inventory);
    if (payload.quests) useQuestStore.setState(payload.quests);
    
    // For monsters, we would deserialize and inject into MonsterStore (which doesn't exist yet, we only have MonsterSystem logic)
  }

  /**
   * Simple hashing function for integrity check. (Base64 encoding of a simple string manipulation).
   * In a real production app, use crypto.subtle.digest('SHA-256', data).
   */
  private static generateHash(data: string): string {
    const combined = data + HASH_SALT;
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit int
    }
    return btoa(hash.toString());
  }
}
