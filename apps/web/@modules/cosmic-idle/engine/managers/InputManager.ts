import Phaser from 'phaser';
import { EventBus } from '../core/EventBus';

export enum InputAction {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  ACTION = 'ACTION',
  CANCEL = 'CANCEL',
  MENU = 'MENU'
}

export class InputManager {
  private static scene: Phaser.Scene | null = null;
  private static keyBinds: Map<InputAction, Phaser.Input.Keyboard.Key> = new Map();

  static initialize(scene: Phaser.Scene) {
    this.scene = scene;
    if (!scene.input.keyboard) return;

    // Default bindings
    this.keyBinds.set(InputAction.UP, scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W));
    this.keyBinds.set(InputAction.DOWN, scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S));
    this.keyBinds.set(InputAction.LEFT, scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A));
    this.keyBinds.set(InputAction.RIGHT, scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D));
    this.keyBinds.set(InputAction.ACTION, scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E));
    this.keyBinds.set(InputAction.CANCEL, scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC));
    this.keyBinds.set(InputAction.MENU, scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TAB));
  }

  static isActionDown(action: InputAction): boolean {
    const key = this.keyBinds.get(action);
    return key ? key.isDown : false;
  }

  static isActionJustPressed(action: InputAction): boolean {
    const key = this.keyBinds.get(action);
    return key ? Phaser.Input.Keyboard.JustDown(key) : false;
  }

  // Future feature: Gamepad and Mobile On-Screen controls
}
