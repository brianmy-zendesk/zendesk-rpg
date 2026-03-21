import Phaser from 'phaser';
import { soundManager } from '../SoundManager.js';

export class TitleScene extends Phaser.Scene {
  constructor() {
    super('Title');
  }

  create() {
    soundManager.startTitleMusic();
    const { width, height } = this.cameras.main;

    // Reset game state on title screen
    this.registry.set('score', 0);
    this.registry.set('lives', 3);
    this.registry.set('questionsAnswered', []);
    this.registry.set('allBattleResults', []);
    this.registry.set('battlesWon', 0);
    this.registry.set('battlesTotal', 0);

    // Background
    const bg = this.add.image(width / 2, height / 2, 'bg-country');
    bg.setDisplaySize(width, height);
    bg.setAlpha(0.3);

    // Title
    this.add.text(width / 2, 100, 'SUPPORT LAND', {
      fontSize: '64px', fontFamily: 'monospace', color: '#03b1fc',
      fontStyle: 'bold', stroke: '#000000', strokeThickness: 8
    }).setOrigin(0.5);

    // Subtitle
    this.add.text(width / 2, 170, 'A Zendesk RPG', {
      fontSize: '24px', fontFamily: 'monospace', color: '#ffffff',
      stroke: '#000000', strokeThickness: 4
    }).setOrigin(0.5);

    // Office Space intro text
    const introLines = [
      '"You see, what we\'re trying to do here is',
      'to get you to go live with Zendesk properly."',
      '',
      '- Bill Lumbergh, VP of Support Land'
    ];
    this.add.text(width / 2, 255, introLines.join('\n'), {
      fontSize: '14px', fontFamily: 'monospace', color: '#f0c040',
      align: 'center', lineSpacing: 6,
      stroke: '#000000', strokeThickness: 3
    }).setOrigin(0.5);

    // Hero sprite
    const hero = this.add.sprite(width / 2, 380, 'hero', 6).setScale(5);
    hero.play('hero-walk-right');

    // --- Name input ---
    const nameBoxBg = this.add.rectangle(width / 2, 440, 260, 32, 0x111122, 0.9);
    nameBoxBg.setStrokeStyle(2, 0x03b1fc);

    this.playerName = '';
    this.nameText = this.add.text(width / 2, 440, '_', {
      fontSize: '18px', fontFamily: 'monospace', color: '#ffffff'
    }).setOrigin(0.5);

    // Cursor blink
    this.cursorVisible = true;
    this.time.addEvent({
      delay: 500, loop: true,
      callback: () => {
        this.cursorVisible = !this.cursorVisible;
        this.updateNameDisplay();
      }
    });

    // Resume audio on first interaction and restart title music
    this.input.keyboard.once('keydown', () => {
      soundManager.init();
      soundManager.startTitleMusic();
    });
    this.input.once('pointerdown', () => {
      soundManager.init();
      soundManager.startTitleMusic();
    });

    // Keyboard input for name
    this.input.keyboard.on('keydown', (event) => {
      if (this.gameStarting) return;

      if (event.key === 'Backspace') {
        this.playerName = this.playerName.slice(0, -1);
        this.updateNameDisplay();
      } else if (event.key === 'Enter') {
        this.startGame();
      } else if (event.key.length === 1 && this.playerName.length < 10) {
        // Allow alphanumeric, spaces, and basic punctuation
        if (/[a-zA-Z0-9 ._-]/.test(event.key)) {
          this.playerName += event.key;
          this.updateNameDisplay();
        }
      }
    });

    // Start button
    this.startPrompt = this.add.text(width / 2, 480, 'TYPE YOUR NAME AND PRESS ENTER', {
      fontSize: '16px', fontFamily: 'monospace', color: '#03b1fc',
      stroke: '#000000', strokeThickness: 3
    }).setOrigin(0.5);

    this.tweens.add({
      targets: this.startPrompt, alpha: 0.3,
      duration: 600, yoyo: true, repeat: -1
    });

    // Lives display
    this.add.text(width / 2, 520, 'Lives: ♥ ♥ ♥', {
      fontSize: '14px', fontFamily: 'monospace', color: '#ff4444',
      stroke: '#000000', strokeThickness: 2
    }).setOrigin(0.5);

    this.gameStarting = false;
    this.cameras.main.fadeIn(500, 0, 0, 0);
  }

  updateNameDisplay() {
    const cursor = this.cursorVisible ? '_' : '';
    this.nameText.setText(this.playerName + cursor);

    // Update prompt based on whether name is entered
    if (this.playerName.trim().length > 0) {
      this.startPrompt.setText('PRESS ENTER TO START');
      this.startPrompt.setColor('#03b1fc');
    } else {
      this.startPrompt.setText('TYPE YOUR NAME AND PRESS ENTER');
      this.startPrompt.setColor('#03b1fc');
    }
  }

  startGame() {
    if (this.gameStarting) return;
    this.gameStarting = true;

    // Store player name in registry (default to "Player" if empty)
    this.registry.set('playerName', this.playerName.trim() || 'Player');

    soundManager.init();
    this.cameras.main.fadeOut(500, 0, 0, 0);
    this.time.delayedCall(500, () => {
      this.scene.start('Overworld', { levelIndex: 0, bossIndex: 0 });
    });
  }
}
