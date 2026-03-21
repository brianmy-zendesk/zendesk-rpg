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
    this.add.text(width / 2, 120, 'SUPPORT LAND', {
      fontSize: '64px', fontFamily: 'monospace', color: '#03b1fc',
      fontStyle: 'bold', stroke: '#000000', strokeThickness: 8
    }).setOrigin(0.5);

    // Subtitle
    this.add.text(width / 2, 190, 'A Zendesk RPG', {
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
    this.add.text(width / 2, 290, introLines.join('\n'), {
      fontSize: '16px', fontFamily: 'monospace', color: '#f0c040',
      align: 'center', lineSpacing: 6,
      stroke: '#000000', strokeThickness: 3
    }).setOrigin(0.5);

    // Hero sprite — walking right animation
    const hero = this.add.sprite(width / 2, 410, 'hero', 6).setScale(6);
    hero.play('hero-walk-right');

    // Press Start - blinking
    const startText = this.add.text(width / 2, 510, 'PRESS ENTER TO START', {
      fontSize: '22px', fontFamily: 'monospace', color: '#ffffff',
      stroke: '#000000', strokeThickness: 4
    }).setOrigin(0.5);

    this.tweens.add({
      targets: startText, alpha: 0.2,
      duration: 600, yoyo: true, repeat: -1
    });

    // Lives display
    this.add.text(width / 2, 560, 'Lives: ♥ ♥ ♥', {
      fontSize: '14px', fontFamily: 'monospace', color: '#ff4444',
      stroke: '#000000', strokeThickness: 2
    }).setOrigin(0.5);

    // Start game handler — init audio on first user gesture
    const startGame = () => {
      soundManager.init();
      this.cameras.main.fadeOut(500, 0, 0, 0);
      this.time.delayedCall(500, () => {
        this.scene.start('Overworld', { levelIndex: 0, bossIndex: 0 });
      });
    };

    this.input.keyboard.once('keydown-ENTER', startGame);
    this.input.once('pointerdown', startGame);

    this.cameras.main.fadeIn(500, 0, 0, 0);
  }
}
