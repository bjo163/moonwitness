import { Scene, GameObjects } from 'phaser';
import { EventBus, GameEvents } from '../engine/core/EventBus';

export class BattleScene extends Scene {
  private playerContainer!: GameObjects.Container;
  private enemySprite!: GameObjects.Sprite;
  
  // Paper doll layers
  private armorLayer!: GameObjects.Rectangle;
  private headLayer!: GameObjects.Rectangle;
  private weaponLayer!: GameObjects.Rectangle;

  constructor() {
    super('BattleScene');
  }

  create() {
    const { width, height } = this.scale;

    // Background
    const bg = this.add.image(width/2, height/2, 'battle_bg');
    bg.setAlpha(0.5);
    bg.setDisplaySize(width, height);

    // Enemy
    this.enemySprite = this.add.sprite(width * 0.75, height * 0.6, 'void_whisperer');
    this.enemySprite.setScale(0.8);
    // Floating animation
    this.tweens.add({
      targets: this.enemySprite,
      y: '-=10',
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.inOut'
    });

    // Player Paper Doll Container
    this.playerContainer = this.add.container(width * 0.25, height * 0.6);
    this.buildPaperDoll();
    
    // Default floating animation
    this.tweens.add({
      targets: this.playerContainer,
      y: '-=5',
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.inOut'
    });

    // Event Listeners
    EventBus.on(GameEvents.PLAYER_ATTACK, this.handlePlayerAttack, this);
    EventBus.on(GameEvents.EQUIP_ITEM, this.handleEquipItem, this);

    this.events.on('shutdown', () => {
      EventBus.off(GameEvents.PLAYER_ATTACK, this.handlePlayerAttack, this);
      EventBus.off(GameEvents.EQUIP_ITEM, this.handleEquipItem, this);
    });
  }

  private buildPaperDoll() {
    // Base Body
    const body = this.add.rectangle(0, 0, 40, 50, 0x1e293b);
    const head = this.add.rectangle(0, -40, 40, 40, 0xfcd34d);
    head.setStrokeStyle(2, 0x000000);
    
    // Layers (initially hidden/transparent)
    this.armorLayer = this.add.rectangle(0, 0, 44, 54, 0xffffff);
    this.armorLayer.setAlpha(0);

    this.headLayer = this.add.rectangle(0, -45, 42, 20, 0xffffff);
    this.headLayer.setAlpha(0);

    this.weaponLayer = this.add.rectangle(30, 0, 8, 60, 0xffffff);
    this.weaponLayer.setAlpha(0);

    this.playerContainer.add([body, head, this.armorLayer, this.headLayer, this.weaponLayer]);
  }

  private handleEquipItem(equipment: any) {
    if (equipment.armor) {
      this.armorLayer.setFillStyle(parseInt(equipment.armor.color.replace('#', '0x')));
      this.armorLayer.setAlpha(1);
    } else {
      this.armorLayer.setAlpha(0);
    }

    if (equipment.head) {
      this.headLayer.setFillStyle(parseInt(equipment.head.color.replace('#', '0x')));
      this.headLayer.setAlpha(1);
    } else {
      this.headLayer.setAlpha(0);
    }

    if (equipment.weapon) {
      this.weaponLayer.setFillStyle(parseInt(equipment.weapon.color.replace('#', '0x')));
      this.weaponLayer.setAlpha(1);
    } else {
      this.weaponLayer.setAlpha(0);
    }
  }

  private handlePlayerAttack(damage: number) {
    // Attack Animation
    this.tweens.add({
      targets: this.playerContainer,
      x: '+=50',
      duration: 150,
      yoyo: true,
      onYoyo: () => {
        // Impact
        this.cameras.main.shake(100, 0.01);
        this.showDamageText(damage, this.enemySprite.x, this.enemySprite.y - 50);
        
        this.tweens.add({
          targets: this.enemySprite,
          alpha: 0.5,
          duration: 100,
          yoyo: true,
          repeat: 1
        });
      }
    });
  }

  private showDamageText(amount: number, x: number, y: number) {
    const text = this.add.text(x, y, `-${amount}`, {
      fontSize: '32px',
      fontStyle: 'bold',
      color: '#ef4444',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);

    this.tweens.add({
      targets: text,
      y: '-=50',
      scale: 1.5,
      alpha: 0,
      duration: 800,
      onComplete: () => text.destroy()
    });
  }
}
