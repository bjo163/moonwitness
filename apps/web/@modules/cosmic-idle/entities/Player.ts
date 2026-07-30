import Phaser from 'phaser';
import { InputManager, InputAction } from '../engine/managers/InputManager';
import { EventBus } from '../engine/core/EventBus';

export class Player extends Phaser.GameObjects.Container {
  declare public body: Phaser.Physics.Arcade.Body;
  private moveSpeed: number = 150;
  
  // Visual representation for framework mock
  private graphic: Phaser.GameObjects.Rectangle;
  private directionIndicator: Phaser.GameObjects.Triangle;

  public facing: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' = 'DOWN';

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    
    // Framework Mock: A cyan box for the player
    this.graphic = scene.add.rectangle(0, 0, 32, 32, 0x06b6d4);
    this.add(this.graphic);

    // Indicator for facing direction
    this.directionIndicator = scene.add.triangle(0, 16, 0, 0, 8, 8, -8, 8, 0xffffff);
    this.add(this.directionIndicator);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Physics settings
    this.body.setSize(32, 32);
    this.body.setOffset(-16, -16);
    this.body.setCollideWorldBounds(true);
  }

  update(dt: number) {
    this.handleMovement();
    this.handleInteraction();
  }

  private handleMovement() {
    this.body.setVelocity(0);

    let isMoving = false;

    if (InputManager.isActionDown(InputAction.LEFT)) {
      this.body.setVelocityX(-this.moveSpeed);
      this.facing = 'LEFT';
      isMoving = true;
    } else if (InputManager.isActionDown(InputAction.RIGHT)) {
      this.body.setVelocityX(this.moveSpeed);
      this.facing = 'RIGHT';
      isMoving = true;
    }

    if (InputManager.isActionDown(InputAction.UP)) {
      this.body.setVelocityY(-this.moveSpeed);
      this.facing = 'UP';
      isMoving = true;
    } else if (InputManager.isActionDown(InputAction.DOWN)) {
      this.body.setVelocityY(this.moveSpeed);
      this.facing = 'DOWN';
      isMoving = true;
    }

    // Normalize diagonal movement
    if (this.body.velocity.x !== 0 && this.body.velocity.y !== 0) {
      this.body.velocity.normalize().scale(this.moveSpeed);
    }

    this.updateFacingIndicator();
  }

  private handleInteraction() {
    if (InputManager.isActionJustPressed(InputAction.ACTION)) {
      // Fire an interaction event. InteractionSystem will listen and raycast.
      EventBus.emit('player:interact', {
        x: this.x,
        y: this.y,
        facing: this.facing
      });
    }
  }

  private updateFacingIndicator() {
    switch (this.facing) {
      case 'UP':
        this.directionIndicator.setPosition(0, -16);
        this.directionIndicator.setRotation(Math.PI);
        break;
      case 'DOWN':
        this.directionIndicator.setPosition(0, 16);
        this.directionIndicator.setRotation(0);
        break;
      case 'LEFT':
        this.directionIndicator.setPosition(-16, 0);
        this.directionIndicator.setRotation(Math.PI / 2);
        break;
      case 'RIGHT':
        this.directionIndicator.setPosition(16, 0);
        this.directionIndicator.setRotation(-Math.PI / 2);
        break;
    }
  }
}
