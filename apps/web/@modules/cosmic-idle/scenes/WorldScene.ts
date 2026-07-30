import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { MapSystem } from '../systems/MapSystem';
import { InteractionSystem } from '../systems/InteractionSystem';
import { InputManager } from '../engine/managers/InputManager';
import { CameraManager } from '../engine/managers/CameraManager';
import { EventBus } from '../engine/core/EventBus';

export class WorldScene extends Phaser.Scene {
  private player!: Player;
  private mapSystem!: MapSystem;
  private interactionSystem!: InteractionSystem;
  private cameraManager!: CameraManager;

  constructor() {
    super('WorldScene');
  }

  private handleTransition = (target: string) => {
    console.log(`Transitioning to ${target}`);
    this.cameraManager.fade(500, 0, 0, 0, () => {
      this.player.setPosition(400, 500);
      this.cameras.main.fadeIn(500);
    });
  }

  create() {
    // 1. Initialize Engine Managers for this scene
    InputManager.initialize(this);
    this.cameraManager = new CameraManager(this.cameras.main);

    // 2. Build World Map
    this.mapSystem = new MapSystem(this);
    this.mapSystem.buildMap('starting_village'); // This will fallback to mock map for now

    // 3. Spawn Player
    this.player = new Player(this, 400, 500);

    // 4. Setup Collision
    this.physics.add.collider(this.player, this.mapSystem.collisionLayer);
    this.physics.add.collider(this.player, this.mapSystem.npcs);

    // 5. Setup Interaction
    this.interactionSystem = new InteractionSystem(this, this.player, this.mapSystem);

    // 6. Setup Camera
    this.cameraManager.follow(this.player);
    this.cameraManager.setBounds(0, 0, 800, 600); // Should match map dimensions

    // Temporary listener for map transition
    EventBus.on('trigger:transition', this.handleTransition, this);
  }

  update(time: number, delta: number) {
    if (this.player) this.player.update(delta);
    if (this.interactionSystem) this.interactionSystem.update(delta);
  }

  shutdown() {
    if (this.interactionSystem) this.interactionSystem.destroy();
    EventBus.off('trigger:transition', this.handleTransition, this);
  }
}
