import { Scene } from 'phaser';
import { EventBus } from '../EventBus';
import { COSMOS_NARRATIVE } from '../narrative/lore';
import { Enemy, ENEMIES } from '../data/enemies';
import { QUESTS } from '../data/quests';
import { NPCS } from '../data/npcs';
import { ITEMS } from '../data/items';
import { BattleScene } from './BattleScene';

export class Game extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    player: Phaser.Physics.Arcade.Sprite | null = null;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;
    npcs: Phaser.Physics.Arcade.Sprite[] = [];
    enemies: Phaser.Physics.Arcade.Sprite[] = [];
    healthBar: Phaser.GameObjects.Graphics | null = null;
    questLog: Phaser.GameObjects.Text | null = null;
    dialogueOpen: boolean = false;
    currentNpc: string | null = null;
    playerStats: { hp: number; maxHp: number; mp: number; maxMp: number; level: number; xp: number; gold: number; attack: number; defense: number; speed: number };
    currentQuestIndex: number = 0;
    worldRegion: string = 'The Shattered Isles';
    private _pendingWidth: number = 0;
    private _pendingHeight: number = 0;
    private _initialized: boolean = false;
    private battlePendingEnemy: Phaser.Physics.Arcade.Sprite | null = null;

    constructor ()
    {
        super('PlayScene');
        this.playerStats = {
            hp: 100,
            maxHp: 100,
            mp: 50,
            maxMp: 50,
            level: 1,
            xp: 0,
            gold: 0,
            attack: 10,
            defense: 5,
            speed: 10,
        };
    }

    create ()
    {
        const { width, height } = this.scale;
        this.cameras.main.setBackgroundColor(0x0a0a1a);

        this.setupInput();
        this.setupEvents();
        this._pendingWidth = width;
        this._pendingHeight = height;
        this._initialized = false;
    }

    initScene() {
        if (this._initialized) return;
        this._initialized = true;
        this.createWorld();
        this.createNPCs();
        this.createEnemies();
        this.createHUD();
        this.createPlayer(this._pendingWidth, this._pendingHeight);
    }

    setupInput() {
        this.cursors = this.input.keyboard?.createCursorKeys() ?? null;
        this.input.keyboard?.on('keydown-E', () => this.interact());
        this.input.keyboard?.on('keydown-Q', () => this.toggleQuestLog());
        this.input.keyboard?.on('keydown-ESC', () => this.pauseGame());
    }

    createPlayer(width: number, height: number) {
        this.player = this.add.image(width / 2, height / 2, 'star') as unknown as Phaser.Physics.Arcade.Sprite;
        this.player.setTint(0xffd700);
        this.player.setScale(0.6);
        this.player.setDepth(20);

        if (this.physics && this.physics.add) {
            this.physics.add.existing(this.player);
        }

        const body = this.player.body;
        if (body) {
            (body as any).setMaxVelocity?.(220, 220);
            (body as any).setDrag?.(120, 120);
        }

        this.add.text(width * 0.5, height * 0.08, 'Rogue of the Shattered Isles', {
            fontFamily: 'Arial Black', fontSize: 16, color: '#ffd700',
            backgroundColor: 'rgba(0,0,0,0.35)',
            padding: { x: 8, y: 4 },
        }).setOrigin(0.5).setDepth(100);

        this.add.text(width * 0.5, height * 0.12, 'Press E to talk • Q to quest • ESC to menu', {
            fontFamily: 'Arial', fontSize: 10, color: 'rgba(255,255,255,0.7)',
            backgroundColor: 'rgba(0,0,0,0.25)',
            padding: { x: 6, y: 3 },
        }).setOrigin(0.5).setDepth(100);

        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        this.cameras.main.setBounds(0, 0, 3000, 3000);
    }

    createWorld() {
        const { width, height } = this.scale;

        this.background = this.add.image(1500, 1500, 'background');
        this.background.setAlpha(0.3);
        this.background.setDisplaySize(3000, 3000);

        for (let i = 0; i < 50; i++) {
            const x = Math.random() * 3000;
            const y = Math.random() * 3000;
            const size = Math.random() * 20 + 10;
            const rock = this.add.graphics();
            rock.fillStyle(0x3a3a4a, 0.5);
            rock.fillRect(x - size / 2, y - size / 2, size, size * Math.random() * 2 + 5);
            rock.setDepth(1);
        }

        for (let i = 0; i < 30; i++) {
            const x = Math.random() * 3000;
            const y = Math.random() * 3000;
            const glow = this.add.graphics();
            glow.fillStyle(0x4a90d9, Math.random() * 0.5 + 0.2);
            glow.fillCircle(x, y, Math.random() * 3 + 1);
        }

        const panel = this.add.rectangle(120, 55, 260, 36, 0x0a0a1a, 0.6)
            .setStrokeStyle(1, 0x4a90d9, 0.7);
        panel.setDepth(90);

        this.add.text(50, 50, this.worldRegion, {
            fontFamily: 'Arial Black', fontSize: 14, color: '#ffd700',
        }).setDepth(100);
        this.add.text(50, 68, 'Explore • Talk • Battle', {
            fontFamily: 'Arial', fontSize: 10, color: 'rgba(255,255,255,0.7)',
        }).setDepth(100);
    }

    createNPCs() {
        NPCS.forEach((npc) => {
            const sprite = this.add.image(npc.position.x, npc.position.y, 'star') as unknown as Phaser.Physics.Arcade.Sprite;
            sprite.setTint(0x1abc9c);
            sprite.setScale(0.35);
            sprite.setDepth(10);
            sprite.setInteractive();
            sprite.setData('npc', npc);
            sprite.on('pointerdown', () => this.startDialogue(npc.id));
            this.npcs.push(sprite);
        });
    }

    createEnemies() {
        for (let i = 0; i < 6; i++) {
            const enemyData = ENEMIES[i % ENEMIES.length];
            const x = Math.random() * 2500 + 100;
            const y = Math.random() * 2500 + 100;
            const sprite = this.add.image(x, y, 'star') as unknown as Phaser.Physics.Arcade.Sprite;
            sprite.setTint(0xff4d4d);
            sprite.setScale(0.45);
            sprite.setDepth(10);
            sprite.setData('enemy', enemyData);
            sprite.setData('hp', enemyData.hp);
            sprite.setData('maxHp', enemyData.hp);
            sprite.setData('aggroRange', 120);
            sprite.setData('attackTimer', 0);
            this.enemies.push(sprite);
        }
    }

    createHUD() {
        this.healthBar = this.add.graphics();
        this.healthBar.fillStyle(0xff4444);
        this.healthBar.fillRect(10, 10, 150, 8);
        this.healthBar.lineStyle(1, 0xffffff, 0.3);
        this.healthBar.strokeRect(10, 10, 150, 8);

        this.add.text(20, 10, 'HP', {
            fontFamily: 'Arial Black', fontSize: 10, color: '#ff6b6b',
        }).setDepth(100);

        this.questLog = this.add.text(10, 25, '', {
            fontFamily: 'Arial', fontSize: 10, color: 'rgba(255,255,255,0.9)',
            backgroundColor: 'rgba(0,0,0,0.65)',
            padding: { x: 6, y: 4 },
        }).setPadding(4).setDepth(100);

        this.updateHUD();
    }

    setupEvents() {
        EventBus.on('scene-change', (data: { targetScene: string; data?: any }) => {
            if (data.targetScene === 'WorldMap') {
                this.scene.start('WorldMap');
            }
        });

        EventBus.on('battle-result', (data: { victory: boolean; reward?: { xp: number; gold: number } }) => {
            if (data.victory) {
                this.playerStats.xp += data.reward?.xp || 0;
                this.playerStats.gold += data.reward?.gold || 0;
                this.updateHUD();
                this.setText(`Battle won! +${data.reward?.xp || 0} XP`);
            } else {
                this.setText('The journey continues...');
            }

            this.battlePendingEnemy = null;
            this.scene.resume('PlayScene');
        });
    }

    updateQuestLog() {
        if (!this.questLog) return;

        const activeQuests = QUESTS.filter(q => q.status === 'active' || q.status === 'available');
        const display = activeQuests.slice(0, 3).map(q => {
            const objectives = q.objectives.map(o => `${o.target}: ${o.current}/${o.required}`).join(' | ');
            return `${q.title}: ${objectives}`;
        }).join('\n');

        this.questLog.setText(display || 'No active quests');
    }

    interact() {
        if (this.dialogueOpen) return;

        const nearest = this.findNearestNPC();
        if (nearest) {
            const npcData = nearest.getData('npc');
            if (npcData) {
                this.startDialogue(npcData.id);
            }
        }
    }

    findNearestNPC(): Phaser.Physics.Arcade.Sprite | null {
        if (!this.player) return null;

        let nearest: Phaser.Physics.Arcade.Sprite | null = null;
        let nearestDist = Infinity;

        this.npcs.forEach((npc) => {
            if (!this.player) return;
            const dx = this.player.x - npc.x;
            const dy = this.player.y - npc.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 80 && dist < nearestDist) {
                nearestDist = dist;
                nearest = npc;
            }
        });

        return nearest;
    }

    startDialogue(npcId: string) {
        if (this.dialogueOpen) return;
        this.dialogueOpen = true;
        this.scene.pause('PlayScene');
        this.scene.launch('Dialogue');
        EventBus.emit('npc-dialogue', { npcId });
    }

    toggleQuestLog() {
        if (this.questLog) {
            const visible = this.questLog.visible;
            this.questLog.setVisible(!visible);
            if (!visible) {
                this.updateQuestLog();
            }
        }
    }

    pauseGame() {
        EventBus.emit('scene-change', { targetScene: 'MainMenu' });
    }

    updateHUD() {
        if (!this.healthBar) return;

        this.healthBar.clear();
        const hpPercent = Math.max(0, this.playerStats.hp / Math.max(1, this.playerStats.maxHp));
        this.healthBar.fillStyle(0xff4444);
        this.healthBar.fillRect(10, 10, 150 * hpPercent, 8);

        EventBus.emit('player-stats-update', {
            hp: this.playerStats.hp,
            maxHp: this.playerStats.maxHp,
            mp: this.playerStats.mp,
            maxMp: this.playerStats.maxMp,
            level: this.playerStats.level,
            gold: this.playerStats.gold,
        });
    }

    checkQuestProgress() {
        const activeQuests = QUESTS.filter(q => q.status === 'active');
        activeQuests.forEach((quest) => {
            quest.objectives.forEach((obj) => {
                if (obj.type === 'kill') {
                    obj.current = Math.min(obj.current + 1, obj.required);
                }
            });

            if (quest.objectives.every((obj) => obj.current >= obj.required)) {
                quest.status = 'completed';
                this.playerStats.xp += quest.rewards.xp;
                this.playerStats.gold += quest.rewards.gold || 0;
                EventBus.emit('quest-progress', {
                    current: QUESTS.filter(q => q.status === 'completed').length,
                    total: QUESTS.length,
                });
            }
        });
    }

    update(time: number, delta: number) {
        this.initScene();

        if (this.dialogueOpen || !this.player) return;

        this.handlePlayerMovement(delta);
        this.checkEnemyCollisions(time);
        this.updateEnemies(time);
    }

    handlePlayerMovement(delta: number) {
        if (!this.player || !this.cursors) return;

        const speed = this.playerStats.speed * 60 * (delta / 1000);
        const velocity = { x: 0, y: 0 };

        if (this.cursors.left?.isDown) velocity.x = -1;
        if (this.cursors.right?.isDown) velocity.x = 1;
        if (this.cursors.up?.isDown) velocity.y = -1;
        if (this.cursors.down?.isDown) velocity.y = 1;

        const vLen = Math.hypot(velocity.x, velocity.y);
        if (vLen > 0) {
            const scaledX = (velocity.x / vLen) * speed;
            const scaledY = (velocity.y / vLen) * speed;
            (this.player.body as any)?.setVelocity(scaledX, scaledY);
        } else {
            (this.player.body as any)?.setVelocity(0, 0);
        }
    }

    checkEnemyCollisions(time: number) {
        if (!this.player) return;

        this.enemies.forEach((enemy) => {
            const dx = (this.player as any).x - enemy.x;
            const dy = (this.player as any).y - enemy.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const aggroRange = (enemy.getData('aggroRange') as number) || 100;

            if (dist < aggroRange) {
                this.engageEnemy(enemy as unknown as Phaser.Physics.Arcade.Sprite, time);
            }
        });
    }

    engageEnemy(enemy: Phaser.Physics.Arcade.Sprite, time: number) {
        const attackTimer = ((enemy.getData('attackTimer') as number) || 0);

        if (time - attackTimer > 1500) {
            enemy.setData('attackTimer', time);

            const enemyData = enemy.getData('enemy') as Enemy;
            if (enemyData && enemyData.attack) {
                const damage = Math.max(1, enemyData.attack - this.playerStats.defense);
                this.playerStats.hp = Math.max(0, this.playerStats.hp - damage);
                this.updateHUD();

                this.tweens.add({
                    targets: this.player,
                    alpha: 0.5,
                    duration: 100,
                    yoyo: true,
                });

                if (this.playerStats.hp <= 0) {
                    this.gameOver();
                } else {
                    this.startBattle(enemy);
                }
            }
        }
    }

    updateEnemies(time: number) {
        if (!this.player) return;

        this.enemies.forEach((enemy) => {
            if (!this.player) return;
            const dx = this.player.x - enemy.x;
            const dy = this.player.y - enemy.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const aggroRange = (enemy.getData('aggroRange') as number) || 100;
            const attackTimer = ((enemy.getData('attackTimer') as number) || 0);

            if (dist < aggroRange && time - attackTimer > 800) {
                const angle = Math.atan2(dy, dx);
                const speed = 50;
                enemy.x += Math.cos(angle) * speed * (1 / 60);
                enemy.y += Math.sin(angle) * speed * (1 / 60);
            }
        });
    }

    startBattle(enemy: Phaser.Physics.Arcade.Sprite) {
        if (this.battlePendingEnemy || this.dialogueOpen) return;
        const enemyData = enemy.getData('enemy') as Enemy;
        if (!enemyData) return;

        this.battlePendingEnemy = enemy;
        this.setText(`Encounter! ${enemyData.name} approaches...`);
        this.tweens.add({
            targets: this.player,
            alpha: 0.7,
            duration: 120,
            yoyo: true,
            repeat: 1,
        });

        this.time.delayedCall(500, () => {
            this.scene.pause('PlayScene');
            this.scene.launch('BattleScene', {
                enemyData,
                playerStats: { ...this.playerStats },
            });
        });
    }

    setText(message: string) {
        if (!this.questLog) return;
        this.questLog.setText(message);
    }

    gameOver() {
        EventBus.emit('player-death');
        this.scene.start('GameOver');
    }
}
