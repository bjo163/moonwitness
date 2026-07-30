import Phaser from 'phaser';
import { EventBus } from '../core/EventBus';

export class AssetManager {
  /**
   * Helper to load a dynamic asset pack and report progress to React.
   */
  static loadPack(
    scene: Phaser.Scene, 
    packKey: string, 
    packUrl: string, 
    onComplete?: () => void
  ) {
    scene.load.pack(packKey, packUrl);

    scene.load.on('progress', (value: number) => {
      EventBus.emit('asset:progress', value);
    });

    scene.load.on('complete', () => {
      EventBus.emit('asset:complete', packKey);
      if (onComplete) onComplete();
    });

    // Start loading immediately if not already doing so
    if (!scene.load.isLoading()) {
      scene.load.start();
    }
  }

  /**
   * Helper to load a Tiled tilemap JSON dynamically.
   */
  static loadTilemap(scene: Phaser.Scene, key: string, url: string) {
    scene.load.tilemapTiledJSON(key, url);
  }
}
