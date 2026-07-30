import Phaser from 'phaser';
import { NPC } from '../entities/NPC';
import { EventBus } from '../engine/core/EventBus';

export class MapSystem {
  public scene: Phaser.Scene;
  public npcs: Phaser.GameObjects.Group;
  public collisionLayer: Phaser.GameObjects.Group;
  public triggerZones: Phaser.GameObjects.Group;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.npcs = scene.physics.add.staticGroup();
    this.collisionLayer = scene.physics.add.staticGroup();
    this.triggerZones = scene.physics.add.staticGroup();
  }

  /**
   * Loads a map. If Tiled JSON is provided, it parses it.
   * For the framework, if no tilemap exists, it generates a mock map.
   */
  buildMap(mapKey: string) {
    // Check if tilemap data exists in cache
    if (this.scene.cache.tilemap.exists(mapKey)) {
      this.parseTiledMap(mapKey);
    } else {
      console.warn(`Tilemap ${mapKey} not found. Building mock map.`);
      this.buildMockMap();
    }
  }

  private parseTiledMap(mapKey: string) {
    // In production, this would:
    // 1. Create tilemap: const map = this.scene.make.tilemap({ key: mapKey });
    // 2. Add tileset: const tileset = map.addTilesetImage('tilesetName', 'tilesetKey');
    // 3. Create layers: map.createLayer('Ground', tileset, 0, 0);
    // 4. Set collisions: map.setCollisionByProperty({ collides: true });
    // 5. Parse ObjectLayer for NPCs and Triggers
    console.log("Tiled map parsing logic placeholder");
  }

  private buildMockMap() {
    const width = 800;
    const height = 600;

    // Draw floor grid
    const graphics = this.scene.add.graphics();
    graphics.lineStyle(1, 0x334155, 0.5);
    for (let x = 0; x <= width; x += 32) {
      graphics.moveTo(x, 0);
      graphics.lineTo(x, height);
    }
    for (let y = 0; y <= height; y += 32) {
      graphics.moveTo(0, y);
      graphics.lineTo(width, y);
    }

    // Border collisions (Walls)
    this.createCollisionWall(width/2, -16, width, 32); // Top
    this.createCollisionWall(width/2, height+16, width, 32); // Bottom
    this.createCollisionWall(-16, height/2, 32, height); // Left
    this.createCollisionWall(width+16, height/2, 32, height); // Right

    // Obstacle
    this.createCollisionWall(400, 300, 128, 64);
    const obsGraphic = this.scene.add.rectangle(400, 300, 128, 64, 0x475569);

    // Spawn an NPC
    const guideNpc = new NPC(this.scene, 300, 200, 'guide_01', 'welcome_dialogue');
    this.npcs.add(guideNpc);

    // Trigger Zone
    const zone = this.scene.add.rectangle(600, 400, 64, 64, 0x10b981, 0.3);
    this.scene.physics.add.existing(zone, true);
    // @ts-ignore attaching custom data to game object
    zone.triggerData = { type: 'transition', target: 'forest_map' };
    this.triggerZones.add(zone);
  }

  private createCollisionWall(x: number, y: number, w: number, h: number) {
    const wall = this.scene.add.rectangle(x, y, w, h, 0x000000, 0); // invisible
    this.scene.physics.add.existing(wall, true);
    this.collisionLayer.add(wall);
  }
}
