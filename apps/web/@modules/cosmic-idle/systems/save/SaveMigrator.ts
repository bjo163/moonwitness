import { CURRENT_SAVE_VERSION, SavePayload } from '../../types/save';

export class SaveMigrator {
  /**
   * Applies sequential migrations to bring old save data up to the current version.
   */
  static migrate(version: string, payload: any): SavePayload {
    let currentVersion = version;
    let data = { ...payload };

    // Example Migration Chain
    if (currentVersion === 'v0.9.0') {
      data = this.migrate_v0_9_to_v1_0(data);
      currentVersion = 'v1.0.0';
    }

    if (currentVersion !== CURRENT_SAVE_VERSION) {
      console.warn(`Unrecognized save version: ${currentVersion}. Attempting to load anyway.`);
    }

    return data as SavePayload;
  }

  private static migrate_v0_9_to_v1_0(data: any) {
    // Example: Inventory format changed
    if (data.inventory && data.inventory.items) {
      data.inventory.slots = data.inventory.items; // Rename field
      delete data.inventory.items;
    }
    return data;
  }
}
