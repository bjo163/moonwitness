import { Scene } from 'phaser';
import { EventBus } from '../EventBus';
import { COSMOS_NARRATIVE } from '../narrative/lore';

export class Preloader extends Scene
{
    bar: Phaser.GameObjects.Rectangle | null = null;

    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        this.cameras.main.setBackgroundColor(0x020210);

        const { width, height } = this.scale;

        this.add.text(width / 2, height * 0.3, 'ROCKSOUL', {
            fontFamily: 'Arial Black', fontSize: 48, color: '#ffd700',
        }).setOrigin(0.5).setDepth(100);

        this.add.text(width / 2, height * 0.38, 'Celitereal Chronicles', {
            fontFamily: 'Arial', fontSize: 16, color: 'rgba(255,255,255,0.5)',
        }).setOrigin(0.5).setDepth(100);

        this.add.rectangle(width / 2 - 230, height * 0.5, 468, 32).setAlpha(0.3);

        this.bar = this.add.rectangle(width / 2 - 230, height * 0.5, 4, 28, 0x4a90d9);
        this.bar.setData('progress', true);
    }

    preload ()
    {
        this.load.setPath('assets');

        this.load.image('logo', 'logo.png');
        this.load.image('star', 'star.png');
        this.load.image('background', 'bg.png');
    }

    create ()
    {
        this.time.delayedCall(0, () => {
            this.scene.start('PlayScene');
        });
    }
}