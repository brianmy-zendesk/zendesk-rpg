import Phaser from 'phaser';
import { soundManager } from '../SoundManager.js';

/**
 * Shows NPC dialogue in a text box with typewriter effect.
 * Used between overworld and battle, and for level completion.
 */
export class DialogueScene extends Phaser.Scene {
  constructor() {
    super('Dialogue');
  }

  init(data) {
    this.dialogue = data.dialogue || ['...'];
    this.npcName = data.npcName || 'Milton';
    this.nextScene = data.nextScene || 'Battle';
    this.nextSceneData = data.nextSceneData || {};
    this.levelIndex = data.levelIndex || 0;
    this.bossIndex = data.bossIndex || 0;
    this.currentLine = 0;
    this.isTyping = false;
    this.fullText = '';
  }

  create() {
    soundManager.startBattleMusic();
    const { width, height } = this.cameras.main;
    this.cameras.main.fadeIn(300, 0, 0, 0);

    // Dark background with slight scene visibility
    this.add.rectangle(width / 2, height / 2, width, height, 0x1a1a2e);

    // NPC sprite (large, centered)
    const npc = this.add.sprite(width / 2, height / 2 - 80, 'npc', 9).setScale(6);
    npc.play('npc-idle');

    // NPC name
    this.add.text(width / 2, height / 2 - 20, this.npcName, {
      fontSize: '18px', fontFamily: 'monospace', color: '#f0c040',
      fontStyle: 'bold', stroke: '#000000', strokeThickness: 4
    }).setOrigin(0.5);

    // Dialogue box
    this.dialogueBox = this.add.rectangle(width / 2, height - 120, 700, 140, 0x111122, 0.95);
    this.dialogueBox.setStrokeStyle(3, 0x03b1fc);

    // Dialogue text
    this.dialogueText = this.add.text(width / 2 - 320, height - 170, '', {
      fontSize: '16px', fontFamily: 'monospace', color: '#ffffff',
      lineSpacing: 8, wordWrap: { width: 640 }
    });

    // Continue prompt
    this.continuePrompt = this.add.text(width / 2, height - 25, '▼ Click to continue', {
      fontSize: '12px', fontFamily: 'monospace', color: '#888888'
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({
      targets: this.continuePrompt,
      alpha: 1,
      duration: 500, yoyo: true, repeat: -1
    });

    // Show first line
    this.showLine();

    // Input — click or Enter to advance
    this.input.on('pointerdown', () => this.advanceDialogue());
    this.input.keyboard.on('keydown-ENTER', () => this.advanceDialogue());
    this.input.keyboard.on('keydown-SPACE', () => this.advanceDialogue());
  }

  showLine() {
    if (this.currentLine >= this.dialogue.length) {
      this.endDialogue();
      return;
    }

    this.isTyping = true;
    this.fullText = this.dialogue[this.currentLine];
    this.dialogueText.setText('');
    this.continuePrompt.setAlpha(0);

    let charIndex = 0;
    this.typeTimer = this.time.addEvent({
      delay: 30,
      repeat: this.fullText.length - 1,
      callback: () => {
        charIndex++;
        this.dialogueText.setText(this.fullText.substring(0, charIndex));
        if (charIndex >= this.fullText.length) {
          this.isTyping = false;
        }
      }
    });
  }

  advanceDialogue() {
    if (this.isTyping) {
      // Skip typewriter — show full text immediately
      if (this.typeTimer) this.typeTimer.destroy();
      this.dialogueText.setText(this.fullText);
      this.isTyping = false;
      return;
    }

    this.currentLine++;
    this.showLine();
  }

  endDialogue() {
    this.cameras.main.fadeOut(400, 0, 0, 0);
    this.time.delayedCall(400, () => {
      this.scene.start(this.nextScene, this.nextSceneData);
    });
  }
}
