import { Scene, Math as PhaserMath } from 'phaser';
import { EventBus } from '../EventBus';
import { COSMOS_NARRATIVE } from '../narrative/lore';

export class WorldMap extends Scene {
    regions: Array<{ name: string; x: number; y: number; color: number; region: { name: string; description: string; levelRange: string } }> = [];
    playerMarker: Phaser.GameObjects.Rectangle | null = null;
    selectedRegion: string | null = null;

    constructor() {
        super('WorldMap');
    }

    create() {
        const { width, height } = this.scale;
        this.cameras.main.setBackgroundColor(0x050510);

        this.createStarfield();
        this.createTitle(width, height);
        this.createRegionNodes(width, height);
        this.createPlayerMarker(width, height);
        this.createInstructions(width, height);

        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            for (const region of this.regions) {
                const dx = pointer.x - region.x;
            const dy = pointer.y - region.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 40) {
                    this.selectedRegion = region.name;
                    EventBus.emit('region-selected', { region: region.region, scene: region.name });
                    this.travelToRegion(region.name);
                    break;
                }
            }
        });

        EventBus.emit('current-scene-ready', this);
    }

    createStarfield() {
        for (let i = 0; i < 200; i++) {
            const x = Math.random() * this.scale.width;
            const y = Math.random() * this.scale.height;
            const size = Math.random() * 2 + 0.5;
            const star = this.add.circle(x, y, size, 0xffffff);
            star.setAlpha(Math.random() * 0.8 + 0.2);

            if (Math.random() > 0.8) {
                star.setFillStyle(0x88ccff);
            }
        }
    }

    createTitle(width: number, height: number) {
        this.add.text(width / 2, 30, 'CELETERAL MAP', {
            fontFamily: 'Arial Black', fontSize: 24, color: '#ffd700',
        }).setOrigin(0.5).setDepth(100);

        this.add.text(width / 2, 55, 'Choose your destination', {
            fontFamily: 'Arial', fontSize: 12, color: 'rgba(255,255,255,0.6)',
        }).setOrigin(0.5).setDepth(100);
    }

    createRegionNodes(width: number, height: number) {
        const centerX = width / 2;
        const centerY = height / 2 + 20;
        const radius = Math.min(width, height) * 0.32;

        COSMOS_NARRATIVE.worldLore.regions.forEach((region, index) => {
            const angle = (index / COSMOS_NARRATIVE.worldLore.regions.length) * Math.PI * 2 - Math.PI / 2;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;

            const colors: Record<string, number> = {
                'The Shattered Isles': 0x4a90d9,
                'The Obsidian Wastes': 0x2c2c2c,
                'The Crystal Sanctum': 0x1abc9c,
                'The Rift Expanse': 0x9b59b6,
                'The Ember Throne': 0xe67e22,
                'The Void Core': 0xff0000,
            };

            const color = colors[region.name] || 0xffffff;

            const node = this.add.rectangle(x, y, 32, 32, color).setAlpha(0.8);
            node.setDepth(100);

            this.add.text(x, y + 24, region.name, {
                fontFamily: 'Arial', fontSize: 9, color: '#ffffff',
            }).setOrigin(0.5).setDepth(100);

            this.add.text(x, y + 34, region.levelRange, {
                fontFamily: 'Arial', fontSize: 8, color: 'rgba(255,255,255,0.5)',
            }).setOrigin(0.5).setDepth(100);

            this.regions.push({ name: region.name, x, y, color, region });
        });
    }

    createPlayerMarker(width: number, height: number) {
        this.playerMarker = this.add.rectangle(width / 2, height / 2 + 20, 12, 12, 0xffd700);
        this.playerMarker.setDepth(200);

        this.tweens.add({
            targets: this.playerMarker,
            scaleX: 1.3,
            scaleY: 1.3,
            duration: 600,
            yoyo: true,
            repeat: -1,
        });
    }

    createInstructions(width: number, height: number) {
        this.add.text(width / 2, height - 30, 'Click a region to travel', {
            fontFamily: 'Arial', fontSize: 11, color: 'rgba(255,255,255,0.4)',
        }).setOrigin(0.5).setDepth(100);
    }

    travelToRegion(regionName: string) {
        if (this.selectedRegion) {
            EventBus.emit('scene-change', { targetScene: 'PlayScene', data: { region: regionName } });
        }
    }

    update() {
        if (this.playerMarker) {
            this.playerMarker.x = this.scale.width / 2 + Math.sin(Date.now() / 1000) * 2;
        }
    }
}