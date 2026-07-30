import { GameObjects, Scene, Math as PhaserMath } from 'phaser';
import { EventBus } from '../EventBus';
import { COSMOS_NARRATIVE } from '../narrative/lore';

export class MainMenu extends Scene
{
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;
    logoTween: Phaser.Tweens.Tween | null;
    menuItems: GameObjects.Text[] = [];
    selectedIndex: number = 0;
    player: GameObjects.Image | null = null;

    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        const { width, height } = this.scale;
        this.cameras.main.setBackgroundColor(0x020210);

        this.createBackground();
        this.createLogo(width, height);
        this.createTitle(width, height);
        this.createMenuItems(width, height);
        this.createPlayer(width, height);
        this.handleInput();

        EventBus.emit('current-scene-ready', this);
    }

    createBackground() {
        const { width, height } = this.scale;
        this.background = this.add.image(512, 384, 'background');
        this.background.setAlpha(0.35);
        this.background.setScale(1.15);

        for (let i = 0; i < 100; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const star = this.add.circle(x, y, Math.random() * 1.3 + 0.4, 0xffffff);
            star.setAlpha(Math.random() * 0.7 + 0.2);
        }

        const nebula = this.add.graphics();
        nebula.fillStyle(0x1a0a3e, 0.2);
        nebula.fillCircle(width * 0.7, height * 0.3, 220);
        nebula.fillStyle(0x0a1a3e, 0.15);
        nebula.fillCircle(width * 0.2, height * 0.7, 160);

        const frame = this.add.rectangle(width / 2, height / 2, width * 0.86, height * 0.84, 0x000000, 0.12)
            .setStrokeStyle(2, 0x4a90d9, 0.6);
        frame.setDepth(-1);
    }

    createLogo(width: number, height: number) {
        this.logo = this.add.image(width / 2, height * 0.22, 'logo').setDepth(100);
        this.logo.setScale(1.5);
        this.logo.setAlpha(0.9);

        this.tweens.add({
            targets: this.logo,
            y: { value: height * 0.20, duration: 1500, ease: 'Back.easeOut' },
            alpha: 1,
            duration: 1000,
        });
    }

    createTitle(width: number, height: number) {
        const panel = this.add.rectangle(width / 2, height * 0.3, width * 0.7, 120, 0x0a0a1a, 0.7)
            .setStrokeStyle(2, 0x4a90d9, 0.8);
        panel.setDepth(90);

        this.title = this.add.text(width / 2, height * 0.27, 'ROCKSOUL', {
            fontFamily: 'Arial Black', fontSize: 52, color: '#ffd700',
            stroke: '#000000', strokeThickness: 6,
            align: 'center',
        }).setOrigin(0.5).setDepth(100);

        this.add.text(width / 2, height * 0.34, 'Celitereal Chronicles', {
            fontFamily: 'Arial', fontSize: 14, color: 'rgba(255,255,255,0.75)',
        }).setOrigin(0.5).setDepth(100);

        this.add.text(width / 2, height * 0.38, 'A Cosmic MMORPG Adventure', {
            fontFamily: 'Arial', fontSize: 11, color: 'rgba(255,255,255,0.5)',
        }).setOrigin(0.5).setDepth(100);
    }

    createMenuItems(width: number, height: number) {
        const items = ['New Journey', 'Continue', 'World Map', 'Quests', 'Settings', 'Quit'];
        const startY = height * 0.56;
        const spacing = 38;
        const menuPanel = this.add.rectangle(width / 2, startY + 2.5 * spacing, 220, 240, 0x0a0a1a, 0.65)
            .setStrokeStyle(1, 0x4a90d9, 0.7);
        menuPanel.setDepth(80);

        items.forEach((item, index) => {
            const text = this.add.text(width / 2, startY + index * spacing, item, {
                fontFamily: 'Arial Black', fontSize: 16 + (index === 0 ? 4 : 0),
                color: index === 0 ? '#ffd700' : 'rgba(255,255,255,0.7)',
            }).setOrigin(0.5).setDepth(100);

            text.setData('index', index);
            text.setInteractive();
            text.on('pointerover', () => this.onHover(index));
            text.on('pointerout', () => this.onOut(index));
            text.on('pointerdown', () => this.onSelect(index));

            this.menuItems.push(text);
        });
    }

    createPlayer(width: number, height: number) {
        this.player = this.add.image(width / 2 - 100, height * 0.56, 'star').setDepth(100);
        this.player.setScale(0.45);
        this.player.setTint(0xffd700);

        this.logoTween = this.tweens.add({
            targets: this.player,
            x: { value: width / 2 - 120, duration: 2500, ease: 'Sine.easeInOut' },
            y: { value: height * 0.56 + 6, duration: 900, ease: 'Sine.easeInOut' },
            yoyo: true,
            repeat: -1,
        });
    }

    handleInput() {
        this.input.keyboard?.on('keydown-UP', () => this.moveSelection(-1));
        this.input.keyboard?.on('keydown-DOWN', () => this.moveSelection(1));
        this.input.keyboard?.on('keydown-ENTER', () => this.onSelect(this.selectedIndex));
    }

    moveSelection(direction: number) {
        this.selectedIndex = PhaserMath.Clamp(this.selectedIndex + direction, 0, this.menuItems.length - 1);
        this.updateMenuHighlight();

        if (this.player) {
            const targetY = this.scale.height * 0.56 + this.selectedIndex * 38;
            this.tweens.add({
                targets: this.player,
                y: { value: targetY, duration: 150, ease: 'Sine.easeOut' },
            });
        }
    }

    updateMenuHighlight() {
        this.menuItems.forEach((item, index) => {
            item.setColor(index === this.selectedIndex ? '#ffd700' : 'rgba(255,255,255,0.6)');
            item.setScale(index === this.selectedIndex ? 1.1 : 1);
        });
    }

    onHover(index: number) {
        this.selectedIndex = index;
        this.updateMenuHighlight();
    }

    onOut(index: number) {
        this.updateMenuHighlight();
    }

    onSelect(index: number) {
        switch (index) {
            case 0:
                EventBus.emit('new-game');
                EventBus.emit('scene-change', { targetScene: 'PlayScene' });
                break;
            case 1:
                EventBus.emit('scene-change', { targetScene: 'PlayScene' });
                break;
            case 2:
                EventBus.emit('scene-change', { targetScene: 'WorldMap' });
                break;
            case 3:
                EventBus.emit('show-quests');
                break;
            case 4:
                EventBus.emit('toggle-settings');
                break;
            case 5:
                if (this.logoTween) {
                    this.logoTween.stop();
                    this.logoTween = null;
                }
                this.scene.stop();
                break;
        }
    }
}