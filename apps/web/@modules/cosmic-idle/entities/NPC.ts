import Phaser from 'phaser';

export class NPC extends Phaser.GameObjects.Container {
  declare public body: Phaser.Physics.Arcade.Body;
  public id: string;
  public dialogueKey: string;

  private graphic: Phaser.GameObjects.Rectangle;

  constructor(scene: Phaser.Scene, x: number, y: number, id: string, dialogueKey: string) {
    super(scene, x, y);
    
    this.id = id;
    this.dialogueKey = dialogueKey;

    // Framework Mock: A yellow box for NPCs
    this.graphic = scene.add.rectangle(0, 0, 32, 32, 0xfacc15);
    this.add(this.graphic);

    scene.add.existing(this);
    scene.physics.add.existing(this, true); // true = static body

    this.body.setSize(32, 32);
    this.body.setOffset(-16, -16);
  }

  interact() {
    // In the future, this might change NPC facing direction or play an animation
    this.scene.tweens.add({
      targets: this.graphic,
      y: -10,
      duration: 150,
      yoyo: true,
    });
  }
}
