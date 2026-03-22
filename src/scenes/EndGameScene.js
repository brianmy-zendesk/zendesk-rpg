import Phaser from 'phaser';
import { soundManager } from '../SoundManager.js';
import { submitScore } from '../leaderboard.js';

/**
 * End-of-game summary showing final stats, missed questions, and performance rating.
 */
export class EndGameScene extends Phaser.Scene {
  constructor() {
    super('EndGame');
  }

  init(data) {
    this.totalScore = data.totalScore || this.registry.get('score') || 0;
    this.lives = data.lives ?? this.registry.get('lives') ?? 0;
    this.gameOver = data.gameOver || false;
  }

  create() {
    const { width, height } = this.cameras.main;
    this.cameras.main.fadeIn(800, 0, 0, 0);

    // Gather stats from registry
    const allResults = this.registry.get('allBattleResults') || [];
    const totalQuestions = allResults.length;
    const correctCount = allResults.filter(r => r.correct).length;
    const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const missed = allResults.filter(r => !r.correct);

    const battlesWon = this.registry.get('battlesWon') || 0;
    const battlesTotal = this.registry.get('battlesTotal') || 0;

    // Submit score to leaderboard
    const playerName = this.registry.get('playerName') || 'Unknown';
    submitScore({
      name: playerName,
      xp: this.totalScore,
      accuracy,
      battlesWon,
      battlesTotal
    });

    // Background
    this.add.rectangle(width / 2, height / 2, width, height, 0x0a0a1a);

    if (!this.gameOver) {
      // Celebration effects for victory
      this.createConfetti(width, height);
      this.createStarField(width, height);
    }

    // Title with animation
    const titleText = this.gameOver ? 'GAME OVER' : 'CONGRATULATIONS!';
    const titleColor = this.gameOver ? '#ff4444' : '#f0c040';
    const title = this.add.text(width / 2, 50, titleText, {
      fontSize: '32px', fontFamily: 'monospace', color: titleColor,
      fontStyle: 'bold', stroke: '#000000', strokeThickness: 6
    }).setOrigin(0.5).setAlpha(0).setScale(0.5);

    this.tweens.add({
      targets: title,
      alpha: 1, scaleX: 1, scaleY: 1,
      duration: 800, ease: 'Back.easeOut'
    });

    if (!this.gameOver) {
      // Shimmer effect on title
      this.tweens.add({
        targets: title,
        scaleX: 1.03, scaleY: 1.03,
        duration: 1500, yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
      });
    }

    const subtitle = this.gameOver
      ? 'You have been relocated to the basement.'
      : 'You have conquered Support Space!';
    const sub = this.add.text(width / 2, 90, subtitle, {
      fontSize: '14px', fontFamily: 'monospace', color: '#aaaaaa'
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({ targets: sub, alpha: 1, duration: 600, delay: 400 });

    // Performance rating
    let rating, ratingColor;
    if (accuracy >= 90) {
      rating = '"You\'ve been promoted to Senior Admin."';
      ratingColor = '#44ff44';
    } else if (accuracy >= 70) {
      rating = '"Looks like someone has a case of the Mondays."';
      ratingColor = '#f0c040';
    } else {
      rating = '"I believe you have my stapler."';
      ratingColor = '#ff4444';
    }

    const ratingText = this.add.text(width / 2, 125, rating, {
      fontSize: '14px', fontFamily: 'monospace', color: ratingColor,
      fontStyle: 'italic', align: 'center'
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({ targets: ratingText, alpha: 1, duration: 600, delay: 800 });

    // Hero sprite celebration (left side)
    if (!this.gameOver) {
      const hero = this.add.sprite(120, 195, 'hero', 7).setScale(5).setAlpha(0);
      hero.play('hero-walk-right');
      this.tweens.add({
        targets: hero, alpha: 1, duration: 500, delay: 600
      });
      this.tweens.add({
        targets: hero, y: 185,
        duration: 600, yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
      });

      // NPC Milton celebrating (right side)
      const npc = this.add.sprite(width - 120, 195, 'npc', 9).setScale(5).setAlpha(0);
      npc.play('npc-idle');
      this.tweens.add({
        targets: npc, alpha: 1, duration: 500, delay: 800
      });
      this.tweens.add({
        targets: npc, y: 185,
        duration: 700, yoyo: true, repeat: -1, ease: 'Sine.easeInOut', delay: 300
      });

      // Golden stapler trophy (near title, left side)
      const staplerX = 155;
      const staplerY = 52;
      const stapler = this.add.image(staplerX, staplerY, 'stapler-gold').setScale(0).setAlpha(0).setDepth(5);
      this.tweens.add({
        targets: stapler,
        scaleX: 0.4, scaleY: 0.4, alpha: 1,
        duration: 800, delay: 1200, ease: 'Back.easeOut'
      });
      this.tweens.add({
        targets: stapler,
        angle: -5, duration: 1500, yoyo: true, repeat: -1,
        ease: 'Sine.easeInOut', delay: 2000
      });
      // Small glow
      const glow = this.add.circle(staplerX, staplerY, 22, 0xf0c040, 0).setDepth(4);
      this.tweens.add({
        targets: glow,
        alpha: 0.12, scaleX: 1.2, scaleY: 1.2,
        duration: 1200, yoyo: true, repeat: -1,
        ease: 'Sine.easeInOut', delay: 1200
      });
    }

    // Stats panel with slide-in animation
    const panelY = 200;
    const panel = this.add.rectangle(width / 2, panelY, 500, 120, 0x111122, 0.9);
    panel.setStrokeStyle(2, !this.gameOver ? 0x03b1fc : 0x333355);
    panel.setAlpha(0);

    this.tweens.add({ targets: panel, alpha: 1, duration: 500, delay: 1000 });

    const col1X = 170;
    const col2X = width / 2 + 40;
    const row1Y = panelY - 35;
    const row2Y = panelY;
    const row3Y = panelY + 35;

    const stats = [
      this.add.text(col1X, row1Y, `Final Score: ${this.totalScore} XP`, {
        fontSize: '16px', fontFamily: 'monospace', color: '#f0c040'
      }),
      this.add.text(col1X, row2Y, `Questions: ${correctCount}/${totalQuestions} correct`, {
        fontSize: '16px', fontFamily: 'monospace', color: '#ffffff'
      }),
      this.add.text(col1X, row3Y, `Accuracy: ${accuracy}% (${accuracy >= 90 ? 'Gold' : accuracy >= 70 ? 'Silver' : 'Bronze'})`, {
        fontSize: '16px', fontFamily: 'monospace', color: accuracy >= 90 ? '#f0c040' : accuracy >= 70 ? '#c0c0c0' : '#cd7f32'
      }),
      this.add.text(col2X, row1Y, `Battles Won: ${battlesWon}/${battlesTotal}`, {
        fontSize: '16px', fontFamily: 'monospace', color: '#ffffff'
      }),
      this.add.text(col2X, row2Y, `Lives Remaining: ${this.lives}`, {
        fontSize: '16px', fontFamily: 'monospace', color: this.lives > 0 ? '#ff4444' : '#666666'
      })
    ];

    // Stagger stat reveals
    stats.forEach((s, i) => {
      s.setAlpha(0);
      this.tweens.add({ targets: s, alpha: 1, duration: 300, delay: 1200 + i * 150 });
    });

    // Perfect score message (only if no missed questions)
    if (missed.length === 0) {
      const perfectText = this.add.text(width / 2, 320, 'PERFECT SCORE!', {
        fontSize: '28px', fontFamily: 'monospace', color: '#f0c040',
        fontStyle: 'bold', stroke: '#000000', strokeThickness: 4
      }).setOrigin(0.5).setAlpha(0).setScale(0.5);

      this.tweens.add({
        targets: perfectText, alpha: 1, scaleX: 1, scaleY: 1,
        duration: 600, delay: 2000, ease: 'Back.easeOut'
      });
      this.tweens.add({
        targets: perfectText, scaleX: 1.05, scaleY: 1.05,
        duration: 1000, yoyo: true, repeat: -1, ease: 'Sine.easeInOut', delay: 2600
      });

      this.add.text(width / 2, 370, '"I could set the building on fire..."\nJust kidding. You\'re the best admin ever.', {
        fontSize: '14px', fontFamily: 'monospace', color: '#888888',
        align: 'center'
      }).setOrigin(0.5);
    }

    // --- Bottom buttons ---
    const btnY = height - 35;

    // Return to title (primary)
    const btn = this.add.rectangle(width / 2, btnY, 300, 40, 0x03b1fc);
    btn.setStrokeStyle(2, 0x66ccff);
    btn.setInteractive({ useHandCursor: true });
    btn.on('pointerover', () => btn.setFillStyle(0x0599d4));
    btn.on('pointerout', () => btn.setFillStyle(0x03b1fc));
    btn.on('pointerdown', () => {
      this.cameras.main.fadeOut(500, 0, 0, 0);
      this.time.delayedCall(500, () => this.scene.start('Title'));
    });
    const btnText = this.add.text(width / 2, btnY, 'RETURN TO TITLE', {
      fontSize: '16px', fontFamily: 'monospace', color: '#ffffff', fontStyle: 'bold'
    }).setOrigin(0.5);

    btn.setAlpha(0);
    btnText.setAlpha(0);
    this.tweens.add({ targets: [btn, btnText], alpha: 1, duration: 500, delay: 2500 });

    // View incorrect answers (secondary) — only if there are missed questions
    if (missed.length > 0) {
      const secBtnY = btnY - 50;
      const secBtn = this.add.rectangle(width / 2, secBtnY, 300, 36, 0x222233);
      secBtn.setStrokeStyle(2, 0x666688);
      secBtn.setInteractive({ useHandCursor: true });
      secBtn.on('pointerover', () => secBtn.setFillStyle(0x333344));
      secBtn.on('pointerout', () => secBtn.setFillStyle(0x222233));
      secBtn.on('pointerdown', () => this.showIncorrectAnswers(missed, width, height));

      const secBtnText = this.add.text(width / 2, secBtnY, `View Incorrect Answers (${missed.length})`, {
        fontSize: '13px', fontFamily: 'monospace', color: '#ff8866'
      }).setOrigin(0.5);

      secBtn.setAlpha(0);
      secBtnText.setAlpha(0);
      this.tweens.add({ targets: [secBtn, secBtnText], alpha: 1, duration: 500, delay: 2500 });
    }
  }

  showIncorrectAnswers(missed, width, height) {
    // Overlay
    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.92);
    overlay.setDepth(50);

    const title = this.add.text(width / 2, 30, `INCORRECT ANSWERS (${missed.length})`, {
      fontSize: '18px', fontFamily: 'monospace', color: '#ff8866',
      fontStyle: 'bold', stroke: '#000000', strokeThickness: 4
    }).setOrigin(0.5).setDepth(51);

    // Close button
    const closeBtn = this.add.rectangle(width / 2, height - 40, 200, 36, 0x333344);
    closeBtn.setStrokeStyle(2, 0x666688);
    closeBtn.setInteractive({ useHandCursor: true });
    closeBtn.setDepth(51);
    closeBtn.on('pointerover', () => closeBtn.setFillStyle(0x444455));
    closeBtn.on('pointerout', () => closeBtn.setFillStyle(0x333344));

    const closeBtnText = this.add.text(width / 2, height - 40, 'Close', {
      fontSize: '14px', fontFamily: 'monospace', color: '#ffffff'
    }).setOrigin(0.5).setDepth(51);

    // Scrollable question list
    const listTop = 60;
    const listBottom = height - 70;
    const containerHeight = listBottom - listTop;

    const maskShape = this.make.graphics();
    maskShape.fillRect(30, listTop, width - 60, containerHeight);
    const mask = maskShape.createGeometryMask();

    const container = this.add.container(0, 0);
    container.setMask(mask);
    container.setDepth(51);

    let y = listTop + 10;
    missed.forEach((r, i) => {
      const qText = this.add.text(50, y, `${i + 1}. ${r.question}`, {
        fontSize: '12px', fontFamily: 'monospace', color: '#cccccc',
        wordWrap: { width: 680 }
      }).setDepth(51);
      container.add(qText);
      y += qText.height + 6;

      const aText = this.add.text(70, y, `Answer: ${r.correctAnswer}`, {
        fontSize: '12px', fontFamily: 'monospace', color: '#44ff44',
        wordWrap: { width: 600 }
      }).setDepth(51);
      container.add(aText);
      y += aText.height + 4;

      if (r.articleUrl) {
        const linkText = this.add.text(width - 60, y, 'Read article >', {
          fontSize: '11px', fontFamily: 'monospace', color: '#03b1fc'
        }).setOrigin(1, 0).setDepth(51);
        linkText.setInteractive({ useHandCursor: true });
        linkText.on('pointerdown', () => window.open(r.articleUrl, '_blank'));
        linkText.on('pointerover', () => linkText.setColor('#66ccff'));
        linkText.on('pointerout', () => linkText.setColor('#03b1fc'));
        container.add(linkText);
        y += 18;
      }
      y += 12;
    });

    const contentHeight = y - listTop;

    // Scroll with mouse wheel
    if (contentHeight > containerHeight) {
      const scrollHandler = (pointer, gameObjects, deltaX, deltaY) => {
        container.y -= deltaY * 0.5;
        container.y = Phaser.Math.Clamp(container.y, -(contentHeight - containerHeight), 0);
      };
      this.input.on('wheel', scrollHandler);

      const scrollHint = this.add.text(width / 2, listBottom + 5, 'Scroll to see more', {
        fontSize: '10px', fontFamily: 'monospace', color: '#666666'
      }).setOrigin(0.5).setDepth(51);

      closeBtn.on('pointerdown', () => {
        this.input.off('wheel', scrollHandler);
        overlay.destroy(); title.destroy(); closeBtn.destroy();
        closeBtnText.destroy(); container.destroy(); scrollHint.destroy();
      });
    } else {
      closeBtn.on('pointerdown', () => {
        overlay.destroy(); title.destroy(); closeBtn.destroy();
        closeBtnText.destroy(); container.destroy();
      });
    }
  }

  createConfetti(width, height) {
    const colors = [0xff4444, 0x44ff44, 0x4488ff, 0xf0c040, 0xff66ff, 0x03b1fc, 0xff8844];

    // Create confetti particles using graphics
    for (let i = 0; i < 60; i++) {
      const x = Phaser.Math.Between(0, width);
      const y = Phaser.Math.Between(-height, -20);
      const color = Phaser.Utils.Array.GetRandom(colors);
      const size = Phaser.Math.Between(3, 7);

      const piece = this.add.rectangle(x, y, size, size * 2, color);
      piece.setAlpha(Phaser.Math.FloatBetween(0.4, 0.7));
      piece.setAngle(Phaser.Math.Between(0, 360));
      piece.setDepth(0);

      const duration = Phaser.Math.Between(2000, 5000);
      const drift = Phaser.Math.Between(-80, 80);

      this.tweens.add({
        targets: piece,
        y: height + 50,
        x: x + drift,
        angle: piece.angle + Phaser.Math.Between(-360, 360),
        duration,
        delay: Phaser.Math.Between(0, 2000),
        ease: 'Sine.easeIn',
        onComplete: () => {
          // Loop the confetti
          piece.y = Phaser.Math.Between(-100, -20);
          piece.x = Phaser.Math.Between(0, width);
          this.tweens.add({
            targets: piece,
            y: height + 50,
            x: piece.x + Phaser.Math.Between(-80, 80),
            angle: piece.angle + Phaser.Math.Between(-360, 360),
            duration: Phaser.Math.Between(3000, 6000),
            ease: 'Sine.easeIn',
            repeat: -1
          });
        }
      });
    }
  }

  createStarField(width, height) {
    // Twinkling stars in background
    for (let i = 0; i < 30; i++) {
      const x = Phaser.Math.Between(20, width - 20);
      const y = Phaser.Math.Between(20, height - 20);
      const size = Phaser.Math.Between(1, 3);
      const star = this.add.circle(x, y, size, 0xffffff);
      star.setAlpha(0);
      star.setDepth(0);

      this.tweens.add({
        targets: star,
        alpha: { from: 0, to: Phaser.Math.FloatBetween(0.2, 0.6) },
        duration: Phaser.Math.Between(500, 1500),
        yoyo: true,
        repeat: -1,
        delay: Phaser.Math.Between(0, 3000)
      });
    }
  }
}
