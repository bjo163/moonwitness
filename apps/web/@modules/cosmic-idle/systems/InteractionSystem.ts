import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { NPC } from '../entities/NPC';
import { EventBus } from '../engine/core/EventBus';
import { MapSystem } from './MapSystem';

export class InteractionSystem {
  private scene: Phaser.Scene;
  private player: Player;
  private mapSystem: MapSystem;

  constructor(scene: Phaser.Scene, player: Player, mapSystem: MapSystem) {
    this.scene = scene;
    this.player = player;
    this.mapSystem = mapSystem;

    EventBus.on('player:interact', this.handleInteract, this);
  }

  update(dt: number) {
    // Check overlaps with trigger zones (e.g. map transitions)
    this.scene.physics.overlap(this.player, this.mapSystem.triggerZones, (player, zone) => {
      // @ts-ignore
      const data = zone.triggerData;
      if (data && data.type === 'transition') {
        EventBus.emit('trigger:transition', data.target);
        // Disable zone temporarily to prevent spam
        zone.destroy();
      }
    });
  }

  private handleInteract(data: { x: number, y: number, facing: string }) {
    // Calculate an interaction point slightly ahead of the player
    let ix = data.x;
    let iy = data.y;
    const offset = 40;

    switch (data.facing) {
      case 'UP': iy -= offset; break;
      case 'DOWN': iy += offset; break;
      case 'LEFT': ix -= offset; break;
      case 'RIGHT': ix += offset; break;
    }

    // Create a temporary small physics rect to check overlap
    const hitBox = this.scene.add.rectangle(ix, iy, 20, 20);
    this.scene.physics.add.existing(hitBox);

    let interacted = false;

    this.scene.physics.overlap(hitBox, this.mapSystem.npcs, (box, npcObj) => {
      const npc = npcObj as NPC;
      npc.interact();
      EventBus.emit('ui:show_dialogue', npc.dialogueKey);
      interacted = true;
    });

    // Cleanup hitBox immediately after check
    setTimeout(() => hitBox.destroy(), 50);
  }

  destroy() {
    EventBus.off('player:interact', this.handleInteract, this);
  }
}
