import { Scene } from 'phaser';
import { EventBus } from '../EventBus';
import { COSMOS_NARRATIVE } from '../narrative/lore';

export class Boot extends Scene {
    constructor ()
    {
        super('Boot');
    }

    preload ()
    {
        this.cameras.main.setBackgroundColor(0x020210);

        this.createCosmicBackground();
        this.load.image('background', 'assets/bg.png');
        this.load.image('logo', 'assets/logo.png');
        this.load.image('star', 'assets/star.png');

        this.load.on('progress', (progress: number) =>
        {
            this.updateLoadingProgress(progress);
        });

        this.load.on('complete', () =>
        {
            this.onLoadingComplete();
        });
    }

    create ()
    {
        this.scene.start('Preloader');
    }

    createCosmicBackground() {
        const { width, height } = this.scale;

        for (let i = 0; i < 150; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const size = Math.random() * 1.5 + 0.5;
            const star = this.add.circle(x, y, size, 0xffffff);
            star.setAlpha(Math.random() * 0.8 + 0.2);
        }

        const nebula = this.add.graphics();
        nebula.fillStyle(0x1a0a3e, 0.3);
        nebula.fillCircle(width * 0.3, height * 0.4, 200);
        nebula.fillStyle(0x0a1a3e, 0.2);
        nebula.fillCircle(width * 0.7, height * 0.6, 150);
        nebula.setDepth(-1);

        const core = this.add.graphics();
        core.fillStyle(0x4a0080, 0.6);
        core.fillCircle(width / 2, height / 2, 80);
        core.lineStyle(2, 0x8844cc, 0.8);
        core.strokeCircle(width / 2, height / 2, 80);
        core.setDepth(0);

        this.tweens.add({
            targets: core,
            scaleX: 1.5,
            scaleY: 1.5,
            alpha: 0.3,
            duration: 2000,
            yoyo: true,
            repeat: -1,
        });
    }

    updateLoadingProgress(progress: number) {
        const { width, height } = this.scale;
        const barWidth = 400;
        const barHeight = 4;
        const x = (width - barWidth) / 2;
        const y = height - 50;

        this.updateProgress();

        this.add.text(width / 2, y - 20, 'Seeding the Celitereal...', {
            fontFamily: 'Arial', fontSize: 12, color: 'rgba(255,255,255,0.6)',
        }).setOrigin(0.5);
    }

    updateProgress() {
        this.children.each((child) =>
        {
            if (child.getData('progress') === true)
            {
                child.destroy();
            }
        });
    }

    onLoadingComplete() {
        EventBus.emit('loading-complete');
    }
}
