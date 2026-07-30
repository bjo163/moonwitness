import { Scene } from 'phaser';
import { EventBus } from '../EventBus';
import { NPCS } from '../data/npcs';

export class Dialogue extends Scene {
    private currentNpc: string | null = null;
    private dialogueIndex: number = 0;
    private nameText: Phaser.GameObjects.Text | null = null;
    private dialogueText: Phaser.GameObjects.Text | null = null;
    private continueText: Phaser.GameObjects.Text | null = null;
    private portrait: Phaser.GameObjects.Image | null = null;

    constructor() {
        super('Dialogue');
    }

    create() {
        const { width, height } = this.scale;
        this.cameras.main.setBackgroundColor(0x000000);

        this.createDialogueBox(width, height);
        this.createPortrait(width, height);

        this.input.on('pointerdown', () => {
            this.advanceDialogue();
        });

        this.input.keyboard?.on('keydown-SPACE', () => {
            this.advanceDialogue();
        });

        EventBus.on('npc-dialogue', (data: { npcId: string; dialogueIndex?: number }) => {
            this.startDialogue(data.npcId, data.dialogueIndex);
        });

        EventBus.emit('current-scene-ready', this);
    }

    createDialogueBox(width: number, height: number) {
        const boxWidth = width * 0.8;
        const boxHeight = 140;
        const boxX = (width - boxWidth) / 2;
        const boxY = height - boxHeight - 20;

        const box = this.add.graphics();
        box.fillStyle(0x0a0a1a, 0.9);
        box.fillRoundedRect(boxX, boxY, boxWidth, boxHeight, 12);
        box.lineStyle(2, 0x4a90d9, 0.8);
        box.strokeRoundedRect(boxX, boxY, boxWidth, boxHeight, 12);

        this.nameText = this.add.text(boxX + 20, boxY + 15, '', {
            fontFamily: 'Arial Black', fontSize: 16, color: '#ffd700',
        }).setDepth(100);

        this.dialogueText = this.add.text(boxX + 20, boxY + 40, '', {
            fontFamily: 'Arial', fontSize: 13, color: '#ffffff',
            wordWrap: { width: boxWidth - 40, useAdvancedWrap: true },
        }).setDepth(100);

        this.continueText = this.add.text(width / 2, boxY + boxHeight - 15, '[ Click to continue ]', {
            fontFamily: 'Arial', fontSize: 10, color: 'rgba(255,255,255,0.4)',
        }).setOrigin(0.5).setDepth(100);
    }

    createPortrait(width: number, height: number) {
        this.portrait = this.add.image(40, height - 90, 'star').setDepth(100);
        this.portrait.setScale(0.3);
        this.portrait.setAlpha(0.7);
    }

    startDialogue(npcId: string, startIndex?: number) {
        const npc = NPCS.find(n => n.id === npcId);
        if (!npc) return;

        this.currentNpc = npcId;
        this.dialogueIndex = startIndex || 0;

        if (this.nameText) {
            this.nameText.setText(`${npc.name} — ${npc.title}`);
        }

        this.showCurrentLine();
    }

    showCurrentLine() {
        const npc = NPCS.find(n => n.id === this.currentNpc);
        if (!npc || this.dialogueIndex >= npc.dialogue.length) {
            this.endDialogue();
            return;
        }

        const line = npc.dialogue[this.dialogueIndex];
        if (this.dialogueText) {
            this.dialogueText.setText(line);
        }

        if (this.continueText) {
            this.continueText.setText(this.dialogueIndex < npc.dialogue.length - 1 ? '[ Click to continue ]' : '[ Click to close ]');
        }
    }

    advanceDialogue() {
        if (!this.currentNpc) return;

        const npc = NPCS.find(n => n.id === this.currentNpc);
        if (!npc) return;

        this.dialogueIndex++;

        if (this.dialogueIndex >= npc.dialogue.length) {
            this.endDialogue();
            EventBus.emit('dialogue-complete', { npcId: this.currentNpc });
        } else {
            this.showCurrentLine();
        }
    }

    endDialogue() {
        this.currentNpc = null;
        this.dialogueIndex = 0;
        this.scene.stop('Dialogue');
        this.scene.resume('PlayScene');
    }
}
