import Phaser from 'phaser';
import { getBossConfig, getBossCount, LEVELS } from '../GameState.js';

export class SummaryScene extends Phaser.Scene {
  constructor() {
    super('Summary');
  }

  init(data) {
    this.bossName = data.bossName;
    this.bossType = data.bossType || 'mini';
    this.won = data.won;
    this.gameOver = data.gameOver;
    this.battleXp = data.battleXp;
    this.results = data.results || [];
    this.totalScore = data.totalScore;
    this.lives = data.lives;
    this.levelIndex = data.levelIndex || 0;
    this.bossIndex = data.bossIndex || 0;
  }

  create() {
    const { width, height } = this.cameras.main;
    this.cameras.main.fadeIn(500, 0, 0, 0);

    const correct = this.results.filter(r => r.correct).length;
    const total = this.results.length;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
    const missed = this.results.filter(r => !r.correct);

    // Background
    this.add.rectangle(width / 2, height / 2, width, height, 0x0a0a1a);

    // Title
    const titleColor = this.won ? '#44ff44' : '#ff4444';
    const titleLabel = this.won ? 'BATTLE REPORT - VICTORY' : this.gameOver ? 'BATTLE REPORT - GAME OVER' : 'BATTLE REPORT - DEFEATED';
    this.add.text(width / 2, 30, titleLabel, {
      fontSize: '24px', fontFamily: 'monospace', color: titleColor,
      fontStyle: 'bold', stroke: '#000000', strokeThickness: 4
    }).setOrigin(0.5);

    this.add.text(width / 2, 60, `vs. ${this.bossName}`, {
      fontSize: '16px', fontFamily: 'monospace', color: '#888888'
    }).setOrigin(0.5);

    // Stats panel
    const panelX = 60;

    const statsPanel = this.add.rectangle(width / 2, 145, 680, 80, 0x111122);
    statsPanel.setStrokeStyle(1, 0x333355);

    this.add.text(panelX + 40, 115, `Correct: ${correct}/${total}`, {
      fontSize: '16px', fontFamily: 'monospace', color: '#ffffff'
    });
    this.add.text(panelX + 40, 140, `Accuracy: ${accuracy}%`, {
      fontSize: '16px', fontFamily: 'monospace', color: accuracy >= 70 ? '#44ff44' : '#ff8844'
    });
    this.add.text(width / 2 + 40, 115, `Battle XP: +${this.battleXp}`, {
      fontSize: '16px', fontFamily: 'monospace', color: '#f0c040'
    });
    this.add.text(width / 2 + 40, 140, `Total XP: ${this.totalScore}`, {
      fontSize: '16px', fontFamily: 'monospace', color: '#f0c040'
    });

    // Lumbergh quote
    const quote = this.won
      ? '"Mmm yeah, that\'s what I like to see."'
      : '"Yeah, if you could go ahead and\nread those articles, that\'d be great."';
    this.add.text(width / 2, 200, quote, {
      fontSize: '14px', fontFamily: 'monospace', color: '#f0c040',
      align: 'center', fontStyle: 'italic'
    }).setOrigin(0.5);

    // Missed questions
    if (missed.length > 0) {
      this.add.text(width / 2, 240, 'MISSED QUESTIONS:', {
        fontSize: '16px', fontFamily: 'monospace', color: '#ff6666',
        fontStyle: 'bold'
      }).setOrigin(0.5);

      let missedY = 270;
      missed.forEach((r, i) => {
        if (missedY > 500) return;

        this.add.text(panelX, missedY, `${i + 1}. ${r.question}`, {
          fontSize: '12px', fontFamily: 'monospace', color: '#cccccc',
          wordWrap: { width: 680 }
        });
        missedY += 22;

        this.add.text(panelX + 20, missedY, `Answer: ${r.correctAnswer}`, {
          fontSize: '12px', fontFamily: 'monospace', color: '#44ff44'
        });
        missedY += 18;

        const linkText = this.add.text(panelX + 20, missedY, 'Read article >', {
          fontSize: '12px', fontFamily: 'monospace', color: '#03b1fc'
        });
        linkText.setInteractive({ useHandCursor: true });
        linkText.on('pointerdown', () => window.open(r.articleUrl, '_blank'));
        linkText.on('pointerover', () => linkText.setColor('#66ccff'));
        linkText.on('pointerout', () => linkText.setColor('#03b1fc'));
        missedY += 28;
      });
    } else {
      this.add.text(width / 2, 280, 'PERFECT SCORE!', {
        fontSize: '24px', fontFamily: 'monospace', color: '#f0c040',
        fontStyle: 'bold', stroke: '#000000', strokeThickness: 4
      }).setOrigin(0.5);

      this.add.text(width / 2, 320, 'No TPS report corrections needed.', {
        fontSize: '14px', fontFamily: 'monospace', color: '#888888'
      }).setOrigin(0.5);
    }

    // Lives remaining
    const livesDisplay = this.lives > 0
      ? 'Lives: ' + '♥ '.repeat(this.lives) + '♡ '.repeat(3 - this.lives)
      : 'No lives remaining';
    this.add.text(width / 2, height - 80, livesDisplay, {
      fontSize: '16px', fontFamily: 'monospace',
      color: this.lives > 0 ? '#ff4444' : '#666666'
    }).setOrigin(0.5);

    // --- Button logic based on game state ---
    let buttonText, buttonAction;

    if (this.gameOver) {
      buttonText = 'VIEW FINAL REPORT';
      buttonAction = () => this.scene.start('EndGame', {
        totalScore: this.totalScore,
        lives: 0,
        gameOver: true
      });
    } else if (this.won) {
      const nextBossIndex = this.bossIndex + 1;
      const totalBosses = getBossCount(this.levelIndex);

      if (nextBossIndex >= totalBosses) {
        // Level complete!
        const level = LEVELS[this.levelIndex];
        const nextLevelIndex = this.levelIndex + 1;
        const hasNextLevel = nextLevelIndex < LEVELS.length;

        buttonText = 'LEVEL COMPLETE!';
        buttonAction = () => {
          if (hasNextLevel) {
            this.scene.start('Dialogue', {
              levelIndex: this.levelIndex,
              bossIndex: this.bossIndex,
              dialogue: level.completionDialogue,
              npcName: 'Narrator',
              nextScene: 'Overworld',
              nextSceneData: { levelIndex: nextLevelIndex, bossIndex: 0 }
            });
          } else {
            // Final level complete — go to end game summary
            this.scene.start('Dialogue', {
              levelIndex: this.levelIndex,
              bossIndex: this.bossIndex,
              dialogue: level.completionDialogue,
              npcName: 'Narrator',
              nextScene: 'EndGame',
              nextSceneData: {
                totalScore: this.totalScore,
                lives: this.lives
              }
            });
          }
        };
      } else {
        buttonText = 'CONTINUE';
        buttonAction = () => {
          this.scene.start('Overworld', {
            levelIndex: this.levelIndex,
            bossIndex: nextBossIndex
          });
        };
      }
    } else {
      // Defeated but still have lives — retry
      buttonText = 'RETRY BATTLE';
      buttonAction = () => {
        const boss = getBossConfig(this.levelIndex, this.bossIndex);
        this.scene.start('Battle', {
          bossType: boss.type,
          bossName: boss.name,
          bigBoss: boss.bigBoss,
          miniBoss: boss.miniBoss,
          background: boss.background,
          enemyFrame: boss.enemyFrame,
          levelIndex: this.levelIndex,
          bossIndex: this.bossIndex
        });
      };
    }

    const btn = this.add.rectangle(width / 2, height - 35, 300, 40, 0x03b1fc);
    btn.setStrokeStyle(2, 0x66ccff);
    btn.setInteractive({ useHandCursor: true });
    btn.on('pointerover', () => btn.setFillStyle(0x0599d4));
    btn.on('pointerout', () => btn.setFillStyle(0x03b1fc));
    btn.on('pointerdown', () => {
      this.cameras.main.fadeOut(500, 0, 0, 0);
      this.time.delayedCall(500, buttonAction);
    });

    this.add.text(width / 2, height - 35, buttonText, {
      fontSize: '16px', fontFamily: 'monospace', color: '#ffffff', fontStyle: 'bold'
    }).setOrigin(0.5);
  }
}
