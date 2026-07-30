import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class HUD extends Scene {
    playerBar: Phaser.GameObjects.Container | null = null;
    healthBar: Phaser.GameObjects.Graphics | null = null;
    manaBar: Phaser.GameObjects.Graphics | null = null;
    levelText: Phaser.GameObjects.Text | null = null;
    goldText: Phaser.GameObjects.Text | null = null;
    minimap: Phaser.GameObjects.Graphics | null = null;
    questIndicator: Phaser.GameObjects.Text | null = null;

    constructor() {
        super('HUD');
    }

    create() {
        const { width, height } = this.scale;

        this.createPlayerBar(width, height);
        this.createMinimap(width, height);
        this.createQuestIndicator(width, height);

        EventBus.on('player-stats-update', (stats: { hp: number; maxHp: number; mp: number; maxMp: number; level: number; gold: number }) => {
            this.updatePlayerBar(stats);
        });

        EventBus.on('quest-progress', (data: { current: string; total: number }) => {
            this.updateQuestIndicator(data);
        });
    }

    createPlayerBar(width: number, height: number) {
        const barWidth = 200;
        const barHeight = 6;
        const x = 20;
        const y = 20;

        this.playerBar = this.add.container(x, y);

        this.add.text(x, y - 12, 'HP', { fontFamily: 'Arial Black', fontSize: 10, color: '#ff4444' }).setDepth(100);

        this.healthBar = this.add.graphics();
        this.healthBar.fillStyle(0xff4444);
        this.healthBar.fillRect(20, y, barWidth, barHeight);

        this.add.text(x, y + 8, 'MP', { fontFamily: 'Arial Black', fontSize: 10, color: '#4444ff' }).setDepth(100);

        this.manaBar = this.add.graphics();
        this.manaBar.fillStyle(0x4444ff);
        this.manaBar.fillRect(20, y + 18, barWidth, barHeight);

        this.levelText = this.add.text(x + barWidth + 10, y - 12, 'Lv 1', {
            fontFamily: 'Arial Black', fontSize: 12, color: '#ffd700',
        }).setDepth(100);

        this.goldText = this.add.text(x + barWidth + 10, y + 10, 'Gold: 0', {
            fontFamily: 'Arial', fontSize: 11, color: '#ffd700',
        }).setDepth(100);
    }

    createMinimap(width: number, height: number) {
        this.minimap = this.add.graphics();
        this.minimap.fillStyle(0x000000, 0.5);
        this.minimap.fillRoundedRect(width - 120, 10, 100, 100, 8);
        this.minimap.lineStyle(1, 0x4a90d9, 0.8);
        this.minimap.strokeRoundedRect(width - 120, 10, 100, 100, 8);

        this.minimap.fillStyle(0x1abc9c);
        this.minimap.fillCircle(width - 70, 60, 4);

        this.minimap.setDepth(100);
    }

    createQuestIndicator(width: number, height: number) {
        this.questIndicator = this.add.text(width - 200, height - 40, '', {
            fontFamily: 'Arial', fontSize: 11, color: '#ffffff',
            backgroundColor: 'rgba(0,0,0,0.6)',
        }).setPadding(8).setDepth(100);

        EventBus.emit('current-scene-ready', this);
    }

    updatePlayerBar(stats: { hp: number; maxHp: number; mp: number; maxMp: number; level: number; gold: number }) {
        if (!this.healthBar || !this.manaBar) return;

        this.healthBar.clear();
        this.healthBar.fillStyle(0xff4444);
        const hpWidth = 200 * (stats.hp / Math.max(1, stats.maxHp));
        this.healthBar.fillRect(20, 20, hpWidth, 6);

        this.manaBar.clear();
        this.manaBar.fillStyle(0x4444ff);
        const mpWidth = 200 * (stats.mp / Math.max(1, stats.maxMp));
        this.manaBar.fillRect(20, 38, mpWidth, 6);

        if (this.levelText) {
            this.levelText.setText(`Lv ${stats.level}`);
        }
        if (this.goldText) {
            this.goldText.setText(`Gold: ${stats.gold}`);
        }
    }

    updateQuestIndicator(data: { current: string; total: number }) {
        if (this.questIndicator) {
            this.questIndicator.setText(`${data.current} / ${data.total}`);
        }
    }

    update() {
        if (this.minimap) {
            this.minimap.clear();
            const { width } = this.scale;
            this.minimap.fillStyle(0x000000, 0.5);
            this.minimap.fillRoundedRect(width - 120, 10, 100, 100, 8);
        this.minimap.lineStyle(1, 0x4a90d9, 0.8);
            this.minimap.strokeRoundedRect(width - 120, 10, 100, 100, 8);

            this.minimap.fillStyle(0x1abc9c);
            this.minimap.fillCircle(width - 70, 60, 4);
        }
    }
}
