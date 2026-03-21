import Phaser from 'phaser';

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
    this.cameras.main.fadeIn(500, 0, 0, 0);

    // Gather stats from registry
    const allResults = this.registry.get('allBattleResults') || [];
    const totalQuestions = allResults.length;
    const correctCount = allResults.filter(r => r.correct).length;
    const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const missed = allResults.filter(r => !r.correct);

    const battlesWon = this.registry.get('battlesWon') || 0;
    const battlesTotal = this.registry.get('battlesTotal') || 0;

    // Background
    this.add.rectangle(width / 2, height / 2, width, height, 0x0a0a1a);

    // Title
    const titleText = this.gameOver ? 'GAME OVER' : 'CONGRATULATIONS!';
    const titleColor = this.gameOver ? '#ff4444' : '#44ff44';
    this.add.text(width / 2, 30, titleText, {
      fontSize: '28px', fontFamily: 'monospace', color: titleColor,
      fontStyle: 'bold', stroke: '#000000', strokeThickness: 6
    }).setOrigin(0.5);

    const subtitle = this.gameOver
      ? 'You have been relocated to the basement.'
      : 'You have conquered Support Land!';
    this.add.text(width / 2, 60, subtitle, {
      fontSize: '14px', fontFamily: 'monospace', color: '#888888'
    }).setOrigin(0.5);

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

    this.add.text(width / 2, 95, rating, {
      fontSize: '14px', fontFamily: 'monospace', color: ratingColor,
      fontStyle: 'italic', align: 'center'
    }).setOrigin(0.5);

    // Stats panel
    const panelY = 150;
    const panel = this.add.rectangle(width / 2, panelY, 700, 100, 0x111122);
    panel.setStrokeStyle(2, 0x333355);

    const col1X = 80;
    const col2X = width / 2 + 40;
    const row1Y = panelY - 30;
    const row2Y = panelY;
    const row3Y = panelY + 30;

    this.add.text(col1X, row1Y, `Final Score: ${this.totalScore} XP`, {
      fontSize: '16px', fontFamily: 'monospace', color: '#f0c040'
    });
    this.add.text(col1X, row2Y, `Questions: ${correctCount}/${totalQuestions} correct`, {
      fontSize: '16px', fontFamily: 'monospace', color: '#ffffff'
    });
    this.add.text(col1X, row3Y, `Accuracy: ${accuracy}%`, {
      fontSize: '16px', fontFamily: 'monospace', color: accuracy >= 70 ? '#44ff44' : '#ff8844'
    });

    this.add.text(col2X, row1Y, `Battles Won: ${battlesWon}/${battlesTotal}`, {
      fontSize: '16px', fontFamily: 'monospace', color: '#ffffff'
    });
    this.add.text(col2X, row2Y, `Lives Remaining: ${this.lives}`, {
      fontSize: '16px', fontFamily: 'monospace', color: this.lives > 0 ? '#ff4444' : '#666666'
    });

    // Missed questions (scrollable area)
    let startY = 220;

    if (missed.length > 0) {
      this.add.text(width / 2, startY, `MISSED QUESTIONS (${missed.length}):`, {
        fontSize: '14px', fontFamily: 'monospace', color: '#ff6666',
        fontStyle: 'bold'
      }).setOrigin(0.5);
      startY += 25;

      // Create scrollable container for missed questions
      const containerHeight = height - startY - 60;
      const contentHeight = missed.length * 60;

      // Mask for scroll area
      const maskShape = this.make.graphics();
      maskShape.fillRect(40, startY, width - 80, containerHeight);
      const mask = maskShape.createGeometryMask();

      const container = this.add.container(0, 0);
      container.setMask(mask);

      let missedY = startY;
      missed.forEach((r, i) => {
        const qText = this.add.text(60, missedY, `${i + 1}. ${r.question}`, {
          fontSize: '11px', fontFamily: 'monospace', color: '#cccccc',
          wordWrap: { width: 660 }
        });
        container.add(qText);
        missedY += 18;

        const aText = this.add.text(80, missedY, `Answer: ${r.correctAnswer}`, {
          fontSize: '11px', fontFamily: 'monospace', color: '#44ff44'
        });
        container.add(aText);

        if (r.articleUrl) {
          const linkText = this.add.text(400, missedY, 'Read article >', {
            fontSize: '11px', fontFamily: 'monospace', color: '#03b1fc'
          });
          linkText.setInteractive({ useHandCursor: true });
          linkText.on('pointerdown', () => window.open(r.articleUrl, '_blank'));
          linkText.on('pointerover', () => linkText.setColor('#66ccff'));
          linkText.on('pointerout', () => linkText.setColor('#03b1fc'));
          container.add(linkText);
        }
        missedY += 22;
      });

      // Scroll with mouse wheel
      if (contentHeight > containerHeight) {
        this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
          container.y -= deltaY * 0.5;
          container.y = Phaser.Math.Clamp(container.y, -(contentHeight - containerHeight), 0);
        });

        this.add.text(width / 2, startY + containerHeight + 5, '↕ Scroll to see more', {
          fontSize: '10px', fontFamily: 'monospace', color: '#666666'
        }).setOrigin(0.5);
      }
    } else {
      this.add.text(width / 2, startY + 30, 'PERFECT SCORE!', {
        fontSize: '28px', fontFamily: 'monospace', color: '#f0c040',
        fontStyle: 'bold', stroke: '#000000', strokeThickness: 4
      }).setOrigin(0.5);

      this.add.text(width / 2, startY + 70, '"I could set the building on fire..."\nJust kidding. You\'re the best admin ever.', {
        fontSize: '14px', fontFamily: 'monospace', color: '#888888',
        align: 'center'
      }).setOrigin(0.5);
    }

    // Return to title button
    const btn = this.add.rectangle(width / 2, height - 35, 300, 40, 0x03b1fc);
    btn.setStrokeStyle(2, 0x66ccff);
    btn.setInteractive({ useHandCursor: true });
    btn.on('pointerover', () => btn.setFillStyle(0x0599d4));
    btn.on('pointerout', () => btn.setFillStyle(0x03b1fc));
    btn.on('pointerdown', () => {
      this.cameras.main.fadeOut(500, 0, 0, 0);
      this.time.delayedCall(500, () => this.scene.start('Title'));
    });

    this.add.text(width / 2, height - 35, 'RETURN TO TITLE', {
      fontSize: '16px', fontFamily: 'monospace', color: '#ffffff', fontStyle: 'bold'
    }).setOrigin(0.5);
  }
}
