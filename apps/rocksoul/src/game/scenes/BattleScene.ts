import { Scene } from 'phaser';
import { EventBus } from '../EventBus';
import { Enemy } from '../data/enemies';

type PlayerBattleStats = {
    hp: number;
    maxHp: number;
    mp: number;
    maxMp: number;
    level: number;
    xp: number;
    gold: number;
    attack: number;
    defense: number;
    speed: number;
};

export class BattleScene extends Scene {
    private enemyData: Enemy | null = null;
    private playerStats: PlayerBattleStats | null = null;
    private playerHp = 0;
    private enemyHp = 0;
    private battleLog: Phaser.GameObjects.Text | null = null;
    private actionTexts: Phaser.GameObjects.Text[] = [];
    private selectedAction = 0;
    private battleOver = false;
    private playerDefending = false;
    private heroSprite: Phaser.GameObjects.Container | null = null;
    private enemySprite: Phaser.GameObjects.Container | null = null;
    private playerBar: Phaser.GameObjects.Graphics | null = null;
    private enemyBar: Phaser.GameObjects.Graphics | null = null;

    constructor() {
        super('BattleScene');
    }

    init(data: { enemyData: Enemy; playerStats: PlayerBattleStats }) {
        this.enemyData = data.enemyData;
        this.playerStats = data.playerStats;
        this.playerHp = data.playerStats.hp;
        this.enemyHp = data.enemyData.hp;
    }

    create() {
        this.cameras.main.setBackgroundColor(0x050510);
        this.createBackground();
        this.createArena();
        this.createSprites();
        this.createActions();
        this.createBattleLog();
        this.createStatusPanels();

        this.input.keyboard?.on('keydown-UP', () => this.changeSelection(-1));
        this.input.keyboard?.on('keydown-DOWN', () => this.changeSelection(1));
        this.input.keyboard?.on('keydown-ENTER', () => this.performAction(this.selectedAction));

        this.updateHud();
        this.setLog(`Encounter: ${this.enemyData?.name || 'Enemy'} appears!`);
        this.showTurnBanner('Your turn');
    }

    createBackground() {
        const { width, height } = this.scale;
        this.add.rectangle(width / 2, height / 2, width, height, 0x0a0a1a).setAlpha(0.95);

        for (let i = 0; i < 60; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const size = Math.random() * 2 + 0.5;
            const star = this.add.circle(x, y, size, 0xffffff);
            star.setAlpha(Math.random() * 0.5 + 0.2);
        }
    }

    createArena() {
        const { width, height } = this.scale;
        const panel = this.add.rectangle(width / 2, height * 0.2, width * 0.9, 140, 0x111133).setStrokeStyle(2, 0x4a90d9);
        panel.setAlpha(0.95);
        this.add.text(width / 2, height * 0.12, 'BATTLE', {
            fontFamily: 'Arial Black', fontSize: 18, color: '#ffd700',
        }).setOrigin(0.5);
        this.add.text(width / 2, height * 0.16, 'Choose your action', {
            fontFamily: 'Arial', fontSize: 12, color: 'rgba(255,255,255,0.75)',
        }).setOrigin(0.5);
    }

    createSprites() {
        const { width, height } = this.scale;

        this.heroSprite = this.add.container(width * 0.32, height * 0.52);
        this.drawPixelSprite(this.heroSprite, 0x4a90d9, 0x8b5cf6);

        this.enemySprite = this.add.container(width * 0.7, height * 0.52);
        this.drawPixelSprite(this.enemySprite, 0xff4d4d, 0x7f1d1d);
    }

    drawPixelSprite(container: Phaser.GameObjects.Container, accent: number, shadow: number) {
        const size = 8;
        const pixels: Phaser.GameObjects.Rectangle[] = [];
        const pattern = [
            [0, 0, 1, 0, 0],
            [0, 1, 1, 1, 0],
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1],
            [0, 1, 1, 1, 0],
        ];

        pattern.forEach((row, y) => {
            row.forEach((value, x) => {
                if (!value) return;
                const pixel = this.add.rectangle(x * size, y * size, size, size, x === 2 ? accent : shadow);
                pixel.setOrigin(0.5);
                container.add(pixel);
                pixels.push(pixel);
            });
        });

        container.setScale(2.5);
    }

    createActions() {
        const { width, height } = this.scale;
        const actions = ['Attack', 'Defend', 'Focus'];
        const panel = this.add.rectangle(width * 0.74, height * 0.82, 180, 120, 0x101028).setStrokeStyle(2, 0x4a90d9);
        panel.setAlpha(0.95);

        actions.forEach((action, index) => {
            const y = height * 0.78 + index * 34;
            const text = this.add.text(width * 0.74, y, action, {
                fontFamily: 'Arial Black', fontSize: 16, color: index === 0 ? '#ffd700' : '#ffffff',
            }).setOrigin(0.5);
            text.setInteractive();
            text.on('pointerdown', () => this.performAction(index));
            this.actionTexts.push(text);
        });
    }

    createBattleLog() {
        const { width, height } = this.scale;
        const panel = this.add.rectangle(width * 0.5, height * 0.92, width * 0.82, 58, 0x101028).setStrokeStyle(1, 0x4a90d9);
        panel.setAlpha(0.9);
        this.battleLog = this.add.text(width * 0.5, height * 0.92, '', {
            fontFamily: 'Arial', fontSize: 13, color: '#dbeafe',
            wordWrap: { width: width * 0.75 },
            align: 'center',
        }).setOrigin(0.5);
    }

    createStatusPanels() {
        const { width, height } = this.scale;
        this.playerBar = this.add.graphics();
        this.enemyBar = this.add.graphics();

        this.add.text(width * 0.18, height * 0.22, 'Hero', {
            fontFamily: 'Arial Black', fontSize: 14, color: '#ffffff',
        }).setOrigin(0.5);
        this.add.text(width * 0.78, height * 0.22, this.enemyData?.name || 'Enemy', {
            fontFamily: 'Arial Black', fontSize: 14, color: '#ffffff',
        }).setOrigin(0.5);
    }

    setLog(message: string) {
        if (this.battleLog) {
            this.battleLog.setText(message);
        }
    }

    showTurnBanner(message: string) {
        const banner = this.add.text(this.scale.width / 2, this.scale.height * 0.68, message, {
            fontFamily: 'Arial Black', fontSize: 16, color: '#ffd700',
            backgroundColor: 'rgba(0,0,0,0.45)',
            padding: { x: 8, y: 4 },
        }).setOrigin(0.5);

        this.tweens.add({
            targets: banner,
            alpha: 0,
            duration: 1200,
            onComplete: () => banner.destroy(),
        });
    }

    changeSelection(direction: number) {
        if (this.battleOver) return;
        this.selectedAction = Phaser.Math.Wrap(this.selectedAction + direction, 0, this.actionTexts.length - 1);
        this.updateActionHighlight();
    }

    updateActionHighlight() {
        this.actionTexts.forEach((text, index) => {
            text.setColor(index === this.selectedAction ? '#ffd700' : '#ffffff');
            text.setScale(index === this.selectedAction ? 1.1 : 1);
        });
    }

    updateHud() {
        this.updateActionHighlight();
        if (this.playerBar) this.drawHpBar(this.playerBar, 0.18, 0.28, this.playerHp, this.playerStats?.maxHp || 100, 0xff4d4d);
        if (this.enemyBar) this.drawHpBar(this.enemyBar, 0.78, 0.28, this.enemyHp, this.enemyData?.hp || 100, 0x4a90d9);

        const heroLabel = this.add.text(0, 0, '');
        heroLabel.setText(`HP ${this.playerHp}/${this.playerStats?.maxHp || 100}`);
        heroLabel.destroy();
    }

    drawHpBar(graphics: Phaser.GameObjects.Graphics, xRatio: number, yRatio: number, current: number, max: number, color: number) {
        const { width, height } = this.scale;
        const barWidth = 140;
        const barHeight = 10;
        const x = width * xRatio - barWidth / 2;
        const y = height * yRatio;
        graphics.clear();
        graphics.fillStyle(0x111111, 0.9);
        graphics.fillRect(x, y, barWidth, barHeight);
        graphics.fillStyle(color, 1);
        graphics.fillRect(x, y, Math.max(2, (current / Math.max(1, max)) * barWidth), barHeight);
        graphics.lineStyle(1, 0xffffff, 0.4);
        graphics.strokeRect(x, y, barWidth, barHeight);
    }

    performAction(index: number) {
        if (!this.playerStats || !this.enemyData || this.battleOver) return;

        const action = ['Attack', 'Defend', 'Focus'][index] || 'Attack';
        let message = '';

        switch (action) {
            case 'Attack': {
                const damage = Math.max(1, this.playerStats.attack + 2 - Math.max(0, this.enemyData.defense - 2));
                this.enemyHp = Math.max(0, this.enemyHp - damage);
                message = `You strike for ${damage} damage.`;
                break;
            }
            case 'Defend': {
                this.playerDefending = true;
                message = 'You brace yourself for the next hit.';
                break;
            }
            case 'Focus': {
                const heal = 12;
                this.playerHp = Math.min(this.playerStats.maxHp, this.playerHp + heal);
                this.playerStats.mp = Math.min(this.playerStats.maxMp, this.playerStats.mp + 8);
                message = `You focus and recover ${heal} HP.`;
                break;
            }
        }

        this.updateHud();
        this.setLog(message);
        this.showTurnBanner('Enemy turn');

        if (this.enemyHp <= 0) {
            this.finishBattle(true);
            return;
        }

        this.time.delayedCall(700, () => this.enemyTurn());
    }

    enemyTurn() {
        if (this.battleOver || !this.playerStats || !this.enemyData) return;

        let damage = Math.max(1, this.enemyData.attack - Math.max(0, this.playerStats.defense - 2));
        if (this.playerDefending) {
            this.playerDefending = false;
            damage = Math.max(1, Math.floor(damage / 2));
        }

        this.playerHp = Math.max(0, this.playerHp - damage);
        this.updateHud();
        this.setLog(`${this.enemyData.name} hits for ${damage} damage.`);
        this.showTurnBanner('Your turn');

        if (this.playerHp <= 0) {
            this.finishBattle(false, damage);
            return;
        }

        this.time.delayedCall(400, () => {
            this.setLog('Your turn...');
        });
    }

    finishBattle(victory: boolean, damageTaken = 0) {
        if (this.battleOver) return;
        this.battleOver = true;
        this.setLog(victory ? 'Victory! The foe falls.' : 'You were defeated.');

        this.time.delayedCall(900, () => {
            EventBus.emit('battle-result', {
                victory,
                enemyData: this.enemyData,
                damageTaken,
                reward: victory ? {
                    xp: this.enemyData?.xpReward || 25,
                    gold: this.enemyData?.goldReward || 10,
                } : undefined,
            });
            this.scene.stop('BattleScene');
            this.scene.resume('PlayScene');
        });
    }
}
