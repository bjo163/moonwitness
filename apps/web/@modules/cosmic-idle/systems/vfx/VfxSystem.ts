import { Scene } from 'phaser';
import { EventBus } from '../../engine/core/EventBus';

export interface DamageNumberConfig {
  x: number;
  y: number;
  amount: number;
  isCritical: boolean;
  isHeal?: boolean;
}

export class VfxSystem {
  private static currentScene: Scene | null = null;
  private static originalTimeScale = 1;

  static initialize() {
    EventBus.on('scene:ready', this.onSceneReady, this);

    // Subscribe to gameplay events to trigger VFX
    EventBus.on('battle:attack_hit', this.onBattleDamage, this);
    EventBus.on('map:transition', this.onMapTransition, this);
  }

  static destroy() {
    EventBus.off('scene:ready', this.onSceneReady, this);
    EventBus.off('battle:attack_hit', this.onBattleDamage, this);
    EventBus.off('map:transition', this.onMapTransition, this);
    this.currentScene = null;
  }

  // --- Screen & Camera Effects ---

  static cameraShake(intensity = 0.01, duration = 200) {
    if (!this.currentScene) return;
    this.currentScene.cameras.main.shake(duration, intensity);
  }

  static screenFlash(color = 0xffffff, duration = 100) {
    if (!this.currentScene) return;
    this.currentScene.cameras.main.flash(duration, (color >> 16) & 255, (color >> 8) & 255, color & 255);
  }

  // --- Time Manipulation ---

  static hitStop(durationMs = 100) {
    if (!this.currentScene) return;
    
    // Pause physics and animations
    this.currentScene.physics?.world?.pause();
    this.currentScene.anims?.pauseAll();
    
    // Resume after duration
    this.currentScene.time.delayedCall(durationMs, () => {
      if (!this.currentScene) return;
      this.currentScene.physics?.world?.resume();
      this.currentScene.anims?.resumeAll();
    });
  }

  static slowMotion(scale = 0.5, durationMs = 1000) {
    if (!this.currentScene) return;
    
    this.originalTimeScale = this.currentScene.time.timeScale;
    this.currentScene.time.timeScale = scale;

    this.currentScene.time.delayedCall(durationMs * scale, () => {
      if (!this.currentScene) return;
      this.currentScene.time.timeScale = this.originalTimeScale;
    });
  }

  // --- Floating Text ---

  static spawnDamageNumber(config: DamageNumberConfig) {
    if (!this.currentScene) return;

    let color = '#ffffff';
    let fontSize = '24px';
    let textStr = `-${config.amount}`;

    if (config.isHeal) {
      color = '#00ff00';
      textStr = `+${config.amount}`;
    } else if (config.isCritical) {
      color = '#ffaa00';
      fontSize = '32px';
      textStr = `${config.amount}!`;
    }

    const text = this.currentScene.add.text(config.x, config.y, textStr, {
      fontFamily: 'monospace',
      fontSize: fontSize,
      color: color,
      stroke: '#000000',
      strokeThickness: 4,
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Float up and fade out animation
    this.currentScene.tweens.add({
      targets: text,
      y: config.y - 50,
      alpha: 0,
      duration: config.isCritical ? 1000 : 800,
      ease: 'Cubic.easeOut',
      onComplete: () => text.destroy()
    });
  }

  // --- Scene Transitions ---

  static fadeOut(duration = 500, callback?: () => void) {
    if (!this.currentScene) return;
    this.currentScene.cameras.main.fadeOut(duration, 0, 0, 0);
    if (callback) {
      this.currentScene.cameras.main.once('camerafadeoutcomplete', callback);
    }
  }

  static fadeIn(duration = 500) {
    if (!this.currentScene) return;
    this.currentScene.cameras.main.fadeIn(duration, 0, 0, 0);
  }

  // --- Event Handlers (Decoupled Links) ---

  private static onBattleDamage(payload: any) {
    if (!payload) return;
    
    // In a real game we would get x/y from the sprite position based on targetId.
    // We'll mock it for now.
    const mockX = payload.targetId === 'player_id' ? 200 : 600;
    const mockY = 300;

    this.spawnDamageNumber({
      x: mockX,
      y: mockY,
      amount: payload.damage,
      isCritical: payload.isCritical
    });

    if (payload.isCritical) {
      this.hitStop(150);
      this.screenFlash(0xffffff, 200);
      this.cameraShake(0.02, 300);
    }
  }

  private static onMapTransition() {
    this.fadeOut(500);
  }

  private static onSceneReady(scene: Scene) {
    this.currentScene = scene;
  }
}
