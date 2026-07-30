import { Scene } from 'phaser';
import { EventBus } from '../EventBus';
import { COSMOS_NARRATIVE } from '../narrative/lore';

export class GameOver extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameOverText: Phaser.GameObjects.Text;
    reasonText: Phaser.GameObjects.Text;
    finalScore: Phaser.GameObjects.Text;
    highScore: Phaser.GameObjects.Text;

    constructor ()
    {
        super('GameOver');
    }

    create ()
    {
        const { width, height } = this.scale;
        this.cameras.main.setBackgroundColor(0x050005);

        this.createBackground();
        this.createTitle(width, height);
        this.createReason(width, height);
        this.createScore(width, height);
        this.createButtons(width, height);
        this.createCredits(width, height);

        EventBus.emit('current-scene-ready', this);
    }

    createBackground() {
        const { width, height } = this.scale;

        this.background = this.add.image(512, 384, 'background');
        this.background.setAlpha(0.6);

        for (let i = 0; i < 100; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const size = Math.random() * 2;
            const star = this.add.circle(x, y, size, 0xff4444);
            star.setAlpha(Math.random() * 0.5 + 0.3);
        }

        const vignette = this.add.graphics();
        vignette.fillStyle(0x000000, 0.4);
        vignette.fillRect(0, 0, width, height);
        vignette.setDepth(-1);
    }

    createTitle(width: number, height: number) {
        this.gameOverText = this.add.text(width / 2, height * 0.25, 'JOURNEY ENDED', {
            fontFamily: 'Arial Black', fontSize: 48, color: '#ff4444',
            stroke: '#000000', strokeThickness: 6,
            align: 'center',
        }).setOrigin(0.5).setDepth(100);

        this.tweens.add({
            targets: this.gameOverText,
            alpha: 0.7,
            duration: 800,
            yoyo: true,
            repeat: -1,
        });
    }

    createReason(width: number, height: number) {
        this.reasonText = this.add.text(width / 2, height * 0.38, 'Your life force has been consumed by the Void', {
            fontFamily: 'Arial', fontSize: 14, color: 'rgba(255,255,255,0.5)',
        }).setOrigin(0.5).setDepth(100);
    }

    createScore(width: number, height: number) {
        const score = Math.floor((Date.now() % 100000) / 100);

        this.finalScore = this.add.text(width / 2, height * 0.48, `Score: ${score}`, {
            fontFamily: 'Arial Black', fontSize: 20, color: '#ffd700',
        }).setOrigin(0.5).setDepth(100);

        this.highScore = this.add.text(width / 2, height * 0.53, 'High Score: ---', {
            fontFamily: 'Arial', fontSize: 12, color: 'rgba(255,255,255,0.4)',
        }).setOrigin(0.5).setDepth(100);
    }

    createButtons(width: number, height: number) {
        const buttons = [
            { text: 'Rise Again', action: () => this.restart() },
            { text: 'Return to Title', action: () => this.returnToMenu() },
        ];

        buttons.forEach((btn, index) => {
            const y = height * 0.63 + index * 45;
            const text = this.add.text(width / 2, y, btn.text, {
                fontFamily: 'Arial Black', fontSize: 16, color: '#ffffff',
                backgroundColor: 'rgba(255,255,255,0.05)',
                stroke: '#4a90d9', strokeThickness: 1,
            }).setOrigin(0.5).setDepth(100);

            text.setInteractive();
            text.on('pointerover', () => {
                text.setColor('#ffd700');
                text.setStroke('#ffd700', 1);
            });
            text.on('pointerout', () => {
                text.setColor('#ffffff');
                text.setStroke('#4a90d9', 1);
            });
            text.on('pointerdown', btn.action);
        });
    }

    createCredits(width: number, height: number) {
        this.add.text(width / 2, height * 0.85, 'Rocksoul: Celitereal Chronicles — A Cosmic MMORPG', {
            fontFamily: 'Arial', fontSize: 9, color: 'rgba(255,255,255,0.3)',
        }).setOrigin(0.5).setDepth(100);
    }

    restart() {
        EventBus.emit('scene-change', { targetScene: 'PlayScene' });
    }

    returnToMenu() {
        EventBus.emit('scene-change', { targetScene: 'MainMenu' });
    }
}