import { Scene } from 'phaser';
import { EventBus, GameEvents } from '../engine/core/EventBus';
import { DataManager } from '../engine/core/DataManager';

export class BootScene extends Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    // Load minimal assets needed for startup
    this.load.image('battle_bg', '/assets/battle_bg.png');
    this.load.image('void_whisperer', '/assets/void_whisperer.png');
    // For now we'll draw shapes for paper doll components instead of loading non-existent SVGs
  }

  create() {
    DataManager.initialize();

    // Emit ready event
    EventBus.emit(GameEvents.SCENE_READY, this);

    // Default to WorldScene
    this.scene.start('WorldScene');
  }
}
