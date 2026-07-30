import Phaser from 'phaser';
import { EventBus } from '../core/EventBus';

export class SceneManager {
  private static game: Phaser.Game | null = null;

  static initialize(gameInstance: Phaser.Game) {
    this.game = gameInstance;
  }

  static transitionTo(sceneKey: string, data?: any) {
    if (!this.game) return;

    const activeScenes = this.game.scene.getScenes(true);
    
    // Stop all currently active scenes
    activeScenes.forEach((scene) => {
      this.game!.scene.stop(scene.scene.key);
    });

    // Start the new scene
    this.game.scene.start(sceneKey, data);
    
    EventBus.emit('scene:transition', sceneKey);
  }

  static sleep(sceneKey: string) {
    if (this.game) {
      this.game.scene.sleep(sceneKey);
    }
  }

  static wake(sceneKey: string) {
    if (this.game) {
      this.game.scene.wake(sceneKey);
    }
  }
}
