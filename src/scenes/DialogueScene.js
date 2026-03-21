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
    this.showStapler = data.showStapler || false;
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

    // Golden stapler reveal on final dialogue (triggered by showLine when "stapler" is mentioned)
    if (this.showStapler) {
      this.bigStapler = this.add.image(width / 2, height / 2 - 80, 'stapler-gold').setScale(0).setAlpha(0).setDepth(10);
      this.npcSprite = npc;
      this.bigStaplerRevealed = false;
    }

    // Dialogue box
    this.dialogueBox = this.add.rectangle(width / 2, height - 120, 700, 140, 0x111122, 0.95);
    this.dialogueBox.setStrokeStyle(3, 0x03b1fc);

    // Dialogue text (narrower to leave room for stapler)
    this.dialogueText = this.add.text(width / 2 - 320, height - 170, '', {
      fontSize: '16px', fontFamily: 'monospace', color: '#ffffff',
      lineSpacing: 8, wordWrap: { width: 540 }
    });

    // Stapler image shown in dialogue box when line mentions "stapler"
    const staplerX = width / 2 + 280;
    const staplerY = height - 120;
    this.dialogueStapler = this.add.image(staplerX, staplerY, 'stapler-gold')
      .setScale(0).setAlpha(0).setDepth(10);
    this.staplerGlow = this.add.circle(staplerX, staplerY, 20, 0xf0c040, 0).setDepth(9);

    // Continue prompt
    this.continuePrompt = this.add.text(width / 2, height - 25, '▼ Enter to continue', {
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
    this.input.keyboard.on('keydown-ONE', (event) => {
      if (event.shiftKey) this.endDialogue();
    });
  }

  showLine() {
    if (this.currentLine >= this.dialogue.length) {
      this.endDialogue();
      return;
    }

    this.isTyping = true;
    this.fullText = this.dialogue[this.currentLine].replace(/\n/g, ' ');
    this.dialogueText.setText('');
    this.continuePrompt.setAlpha(0);

    // Show/hide stapler based on dialogue content
    const mentionsStapler = this.fullText.toLowerCase().includes('stapler');

    if (this.showStapler && mentionsStapler && !this.bigStaplerRevealed) {
      // Final dialogue: reveal big stapler in center, hide NPC
      this.bigStaplerRevealed = true;
      const { width, height } = this.cameras.main;
      this.npcSprite.setVisible(false);
      this.tweens.add({
        targets: this.bigStapler,
        scaleX: 1.2, scaleY: 1.2, alpha: 1,
        duration: 800, ease: 'Back.easeOut'
      });
      this.tweens.add({
        targets: this.bigStapler,
        y: this.bigStapler.y - 8,
        duration: 1200, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
        delay: 800
      });
      for (let i = 0; i < 12; i++) {
        const sparkle = this.add.circle(
          width / 2 + Phaser.Math.Between(-60, 60),
          this.bigStapler.y + Phaser.Math.Between(-40, 40),
          Phaser.Math.Between(2, 4), 0xf0c040
        ).setAlpha(0).setDepth(9);
        this.tweens.add({
          targets: sparkle,
          alpha: { from: 0, to: 0.8 }, scaleX: 0, scaleY: 0,
          duration: Phaser.Math.Between(600, 1200),
          yoyo: true, repeat: -1,
          delay: Phaser.Math.Between(0, 2000)
        });
      }
    } else if (!this.showStapler) {
      // Normal dialogues: show small stapler in dialogue box
      if (mentionsStapler) {
        if (!this.staplerVisible) {
          this.staplerVisible = true;
          this.tweens.add({
            targets: this.dialogueStapler,
            scaleX: 0.35, scaleY: 0.35, alpha: 1,
            duration: 600, ease: 'Back.easeOut'
          });
          this.staplerRockTween = this.tweens.add({
            targets: this.dialogueStapler,
            angle: -5, duration: 1500, yoyo: true, repeat: -1,
            ease: 'Sine.easeInOut', delay: 600
          });
          this.staplerGlowTween = this.tweens.add({
            targets: this.staplerGlow,
            alpha: 0.15, scaleX: 1.3, scaleY: 1.3,
            duration: 1200, yoyo: true, repeat: -1,
            ease: 'Sine.easeInOut'
          });
        }
      } else if (this.staplerVisible) {
        this.staplerVisible = false;
        if (this.staplerRockTween) this.staplerRockTween.stop();
        if (this.staplerGlowTween) this.staplerGlowTween.stop();
        this.dialogueStapler.setAlpha(0).setScale(0).setAngle(0);
        this.staplerGlow.setAlpha(0).setScale(1);
      }
    }

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
