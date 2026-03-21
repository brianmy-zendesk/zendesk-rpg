import Phaser from 'phaser';
import { soundManager } from '../SoundManager.js';

const MINI_BOSS_CONFIG = {
  questionCount: 5,
  difficultyMix: { easy: 3, medium: 1, hard: 1 },
  bossHp: 100,
  damage: { easy: 20, medium: 25, hard: 35 },
  playerDamageOnWrong: 25
};

const BIG_BOSS_CONFIG = {
  questionCount: 8,
  difficultyMix: { easy: 2, medium: 3, hard: 3 },
  bossHp: 200,
  damage: { easy: 15, medium: 25, hard: 40 },
  playerDamageOnWrong: 30
};

export class BattleScene extends Phaser.Scene {
  constructor() {
    super('Battle');
  }

  init(data) {
    this.bossType = data.bossType || 'mini';
    this.bossName = data.bossName || 'Unknown Boss';
    this.bigBoss = data.bigBoss;
    this.miniBoss = data.miniBoss;
    this.backgroundKey = data.background || 'bg-country';
    this.enemyFrame = data.enemyFrame || 0;
    this.bossSpriteKey = data.bossSprite || null;
    this.levelIndex = data.levelIndex || 0;
    this.bossIndex = data.bossIndex || 0;

    const config = this.bossType === 'big' ? BIG_BOSS_CONFIG : MINI_BOSS_CONFIG;
    this.config = config;

    this.playerHp = 100;
    this.playerMaxHp = 100;
    this.bossHp = config.bossHp;
    this.bossMaxHp = config.bossHp;

    this.currentQuestionIndex = 0;
    this.streak = 0;
    this.battleXp = 0;
    this.battleResults = [];
    this.isAnimating = false;
  }

  create() {
    const { width, height } = this.cameras.main;

    this.cameras.main.fadeIn(500, 0, 0, 0);

    // Background
    const bg = this.add.image(width / 2, height / 2, this.backgroundKey);
    bg.setDisplaySize(width, height);
    bg.setAlpha(0.4);

    // Select questions
    this.questions = this.selectQuestions();

    // --- Battle Arena (top half) ---
    this.createBattleArena(width, height);

    // --- Quiz UI (bottom half) ---
    this.createQuizUI(width, height);

    // --- HUD ---
    this.createHUD(width, height);

    // Debug: press ! to instantly defeat boss
    this.input.keyboard.on('keydown-ONE', (event) => {
      if (event.shiftKey) {
        this.bossHp = 0;
        this.endBattle(true);
      }
    });

    // Show boss intro
    soundManager.stopMusic();
    soundManager.playBossIntro();
    this.showBossIntro();
  }

  selectQuestions() {
    const allQuestions = this.cache.json.get('questions');

    // Filter questions for this boss
    let pool;
    if (this.bossType === 'big') {
      pool = allQuestions.filter(q => q.big_boss === this.bigBoss);
      // Exclude already answered questions from mini-boss battles
      const answered = this.registry.get('questionsAnswered') || [];
      pool = pool.filter(q => !answered.includes(q.id));
    } else {
      pool = allQuestions.filter(q => q.mini_boss === this.miniBoss);
    }

    // Shuffle the full pool — battle continues until boss or player HP reaches 0
    Phaser.Utils.Array.Shuffle(pool);
    return pool;
  }

  createBattleArena(width, height) {
    // Divider line
    this.add.rectangle(width / 2, 300, width, 2, 0x444466);

    // Boss name banner
    const bannerBg = this.add.rectangle(width / 2, 30, 400, 36, 0x000000, 0.7);
    bannerBg.setStrokeStyle(2, 0x03b1fc);
    this.add.text(width / 2, 30, this.bossName.toUpperCase(), {
      fontSize: '20px',
      fontFamily: 'monospace',
      color: '#ff6666',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Boss sprite (right side)
    if (this.bossSpriteKey) {
      this.bossSpriteObj = this.add.sprite(580, 150, this.bossSpriteKey, 0).setScale(2.5);
      this.bossSpriteObj.play(`${this.bossSpriteKey}-idle`);
    } else {
      this.bossSpriteObj = this.add.sprite(580, 170, 'enemies', this.enemyFrame).setScale(8);
      this.bossSpriteObj.play(`enemy-idle-${this.enemyFrame}`);
    }

    // Player sprite (left side)
    this.playerSprite = this.add.sprite(220, 200, 'hero', 6).setScale(8);
    this.playerSprite.play('hero-walk-right');

    // Boss HP bar
    this.add.text(430, 65, this.bossName, {
      fontSize: '14px', fontFamily: 'monospace', color: '#ffffff',
      stroke: '#000000', strokeThickness: 3
    });
    const bossBarBg = this.add.rectangle(560, 90, 204, 18, 0x333333);
    bossBarBg.setStrokeStyle(2, 0xffffff);
    this.bossHpBar = this.add.rectangle(460, 90, 200, 14, 0xff4444);
    this.bossHpBar.setOrigin(0, 0.5);
    this.bossHpText = this.add.text(660, 90, `${this.bossHp}/${this.bossMaxHp}`, {
      fontSize: '12px', fontFamily: 'monospace', color: '#ffffff',
      stroke: '#000000', strokeThickness: 2
    }).setOrigin(0, 0.5);

    // Player HP bar
    this.add.text(50, 225, 'YOU', {
      fontSize: '14px', fontFamily: 'monospace', color: '#ffffff',
      stroke: '#000000', strokeThickness: 3
    });
    const playerBarBg = this.add.rectangle(180, 250, 204, 18, 0x333333);
    playerBarBg.setStrokeStyle(2, 0xffffff);
    this.playerHpBar = this.add.rectangle(80, 250, 200, 14, 0x44ff44);
    this.playerHpBar.setOrigin(0, 0.5);
    this.playerHpText = this.add.text(280, 250, `${this.playerHp}/${this.playerMaxHp}`, {
      fontSize: '12px', fontFamily: 'monospace', color: '#ffffff',
      stroke: '#000000', strokeThickness: 2
    }).setOrigin(0, 0.5);
  }

  createQuizUI(width, height) {
    // Question panel background
    this.questionPanel = this.add.rectangle(width / 2, 380, 740, 70, 0x000000, 0.8);
    this.questionPanel.setStrokeStyle(2, 0x03b1fc);

    // Question text
    this.questionText = this.add.text(width / 2, 380, '', {
      fontSize: '16px',
      fontFamily: 'monospace',
      color: '#ffffff',
      align: 'center',
      wordWrap: { width: 700 }
    }).setOrigin(0.5);

    // Answer buttons
    this.answerButtons = [];
    this.answerTexts = [];
    const buttonY = [450, 490, 530];
    const buttonColors = [0x2a4858, 0x2a4858, 0x2a4858];

    for (let i = 0; i < 3; i++) {
      const btn = this.add.rectangle(width / 2, buttonY[i], 700, 34, buttonColors[i]);
      btn.setStrokeStyle(2, 0x446688);
      btn.setInteractive({ useHandCursor: true });

      const txt = this.add.text(width / 2, buttonY[i], '', {
        fontSize: '15px',
        fontFamily: 'monospace',
        color: '#ffffff',
        align: 'center'
      }).setOrigin(0.5);

      btn.on('pointerover', () => {
        if (!this.isAnimating) btn.setFillStyle(0x3a6878);
      });
      btn.on('pointerout', () => {
        if (!this.isAnimating) btn.setFillStyle(0x2a4858);
      });

      const index = i;
      btn.on('pointerdown', () => {
        if (!this.isAnimating) this.handleAnswer(index);
      });

      this.answerButtons.push(btn);
      this.answerTexts.push(txt);
    }

    // Question counter
    this.questionCounter = this.add.text(width / 2, 568, '', {
      fontSize: '12px',
      fontFamily: 'monospace',
      color: '#888888'
    }).setOrigin(0.5);

    // Feedback overlay (hidden by default) — positioned in the battle arena (top half)
    this.feedbackBg = this.add.rectangle(width / 2, 150, width, 200, 0x000000, 0);
    this.feedbackBg.setDepth(10);

    this.feedbackText = this.add.text(width / 2, 110, '', {
      fontSize: '28px',
      fontFamily: 'monospace',
      color: '#ffffff',
      fontStyle: 'bold',
      align: 'center',
      stroke: '#000000',
      strokeThickness: 6,
      wordWrap: { width: 600 }
    }).setOrigin(0.5).setDepth(11).setAlpha(0);

    this.feedbackSubText = this.add.text(width / 2, 155, '', {
      fontSize: '14px',
      fontFamily: 'monospace',
      color: '#aaaaaa',
      align: 'center',
      stroke: '#000000',
      strokeThickness: 3,
      wordWrap: { width: 600 }
    }).setOrigin(0.5).setDepth(11).setAlpha(0);

    this.feedbackLinkText = this.add.text(width / 2, 185, '', {
      fontSize: '11px',
      fontFamily: 'monospace',
      color: '#03b1fc',
      align: 'center',
      stroke: '#000000',
      strokeThickness: 3,
      wordWrap: { width: 700 }
    }).setOrigin(0.5).setDepth(11).setAlpha(0);

    // Streak display
    this.streakText = this.add.text(width / 2, 310, '', {
      fontSize: '18px',
      fontFamily: 'monospace',
      color: '#f0c040',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5).setAlpha(0);
  }

  createHUD(width, height) {
    // Score
    const score = this.registry.get('score') || 0;
    this.scoreText = this.add.text(16, 8, `XP: ${score}`, {
      fontSize: '16px',
      fontFamily: 'monospace',
      color: '#f0c040',
      stroke: '#000000',
      strokeThickness: 3
    }).setDepth(20);

    // Lives (staplers)
    const lives = this.registry.get('lives') || 3;
    this.livesText = this.add.text(width - 16, 8, this.getLivesDisplay(lives), {
      fontSize: '16px',
      fontFamily: 'monospace',
      color: '#ff4444',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(1, 0).setDepth(20);
  }

  getLivesDisplay(lives) {
    return 'LIVES: ' + '♥ '.repeat(lives) + '♡ '.repeat(3 - lives);
  }

  showBossIntro() {
    const { width, height } = this.cameras.main;

    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.85).setDepth(30);
    const bossLabel = this.add.text(width / 2, height / 2 - 60, 'BOSS ENCOUNTER!', {
      fontSize: '32px', fontFamily: 'monospace', color: '#ff4444',
      fontStyle: 'bold', stroke: '#000000', strokeThickness: 6
    }).setOrigin(0.5).setDepth(31);

    const bossNameText = this.add.text(width / 2, height / 2, this.bossName.toUpperCase(), {
      fontSize: '28px', fontFamily: 'monospace', color: '#ffffff',
      fontStyle: 'bold', stroke: '#000000', strokeThickness: 6
    }).setOrigin(0.5).setDepth(31);

    const lumberghQuote = this.add.text(width / 2, height / 2 + 60, '"Yeah, if you could go ahead and answer\nthese questions, that\'d be great."', {
      fontSize: '14px', fontFamily: 'monospace', color: '#f0c040',
      align: 'center', stroke: '#000000', strokeThickness: 3
    }).setOrigin(0.5).setDepth(31);

    // Flash effect
    this.tweens.add({
      targets: bossLabel,
      alpha: 0.3,
      duration: 300,
      yoyo: true,
      repeat: 2,
      onComplete: () => {
        this.time.delayedCall(1200, () => {
          this.tweens.add({
            targets: [overlay, bossLabel, bossNameText, lumberghQuote],
            alpha: 0,
            duration: 500,
            onComplete: () => {
              overlay.destroy();
              bossLabel.destroy();
              bossNameText.destroy();
              lumberghQuote.destroy();
              soundManager.startBattleMusic();
              this.showQuestion();
            }
          });
        });
      }
    });
  }

  showQuestion() {
    // If we've exhausted all questions, reshuffle to keep going
    if (this.currentQuestionIndex >= this.questions.length) {
      Phaser.Utils.Array.Shuffle(this.questions);
      this.currentQuestionIndex = 0;
    }

    const q = this.questions[this.currentQuestionIndex];
    this.questionText.setText(q.question);
    this.questionCounter.setText(
      `Question ${this.battleResults.length + 1}  |  ${q.difficulty.toUpperCase()}  |  ${q.xp_value} XP`
    );

    // Shuffle answer display order
    const shuffledAnswers = [...q.answers];
    Phaser.Utils.Array.Shuffle(shuffledAnswers);
    this.currentShuffledAnswers = shuffledAnswers;

    for (let i = 0; i < 3; i++) {
      this.answerTexts[i].setText(shuffledAnswers[i] || '');
      this.answerButtons[i].setFillStyle(0x2a4858);
      this.answerButtons[i].setAlpha(1);
      this.answerTexts[i].setAlpha(1);
      this.answerButtons[i].setInteractive({ useHandCursor: true });
    }
  }

  handleAnswer(index) {
    this.isAnimating = true;
    const q = this.questions[this.currentQuestionIndex];
    const selectedAnswer = this.currentShuffledAnswers[index];
    const isCorrect = selectedAnswer === q.correct_answer;

    // Disable buttons
    this.answerButtons.forEach(btn => btn.disableInteractive());

    // Highlight correct/wrong
    for (let i = 0; i < 3; i++) {
      if (this.currentShuffledAnswers[i] === q.correct_answer) {
        this.answerButtons[i].setFillStyle(0x227722);
      } else if (i === index && !isCorrect) {
        this.answerButtons[i].setFillStyle(0x772222);
      }
    }

    // Record result
    this.battleResults.push({
      question: q.question,
      correct: isCorrect,
      correctAnswer: q.correct_answer,
      selectedAnswer,
      articleUrl: q.article_url,
      xpValue: q.xp_value,
      difficulty: q.difficulty
    });

    // Track answered question IDs
    const answered = this.registry.get('questionsAnswered') || [];
    answered.push(q.id);
    this.registry.set('questionsAnswered', answered);

    if (isCorrect) {
      soundManager.playCorrect();
      this.handleCorrectAnswer(q);
    } else {
      soundManager.playWrong();
      this.handleWrongAnswer(q);
    }
  }

  handleCorrectAnswer(q) {
    const { width, height } = this.cameras.main;
    this.streak++;

    // XP
    const xp = q.xp_value;
    this.battleXp += xp;
    const totalScore = (this.registry.get('score') || 0) + xp;
    this.registry.set('score', totalScore);
    this.scoreText.setText(`XP: ${totalScore}`);

    // Boss damage
    const damage = this.config.damage[q.difficulty];
    this.bossHp = Math.max(0, this.bossHp - damage);
    this.updateBossHpBar();

    // Hit animation on boss
    this.tweens.add({
      targets: this.bossSpriteObj,
      x: this.bossSpriteObj.x + 15,
      duration: 50,
      yoyo: true,
      repeat: 3,
      ease: 'Bounce'
    });
    this.cameras.main.flash(200, 255, 255, 255);

    // Show feedback
    this.showFeedback('CORRECT!', `+${xp} XP  |  -${damage} Boss HP`, '', 0x44ff44);

    // Streak bonus
    if (this.streak === 3) {
      this.battleXp += 10;
      const newScore = (this.registry.get('score') || 0) + 10;
      this.registry.set('score', newScore);
      this.scoreText.setText(`XP: ${newScore}`);
      this.showStreakBonus('Flair Bonus! +10 XP');
      soundManager.playStreak();
    } else if (this.streak === 5) {
      this.battleXp += 25;
      const newScore = (this.registry.get('score') || 0) + 25;
      this.registry.set('score', newScore);
      this.scoreText.setText(`XP: ${newScore}`);
      soundManager.playStreak();
      this.showStreakBonus('37 Pieces of Flair! +25 XP');
    }

    this.time.delayedCall(1500, () => {
      this.clearFeedback();
      if (this.bossHp <= 0) {
        this.endBattle(true);
      } else {
        this.currentQuestionIndex++;
        this.isAnimating = false;
        this.showQuestion();
      }
    });
  }

  handleWrongAnswer(q) {
    this.streak = 0;

    // Player damage
    const damage = this.config.playerDamageOnWrong;
    this.playerHp = Math.max(0, this.playerHp - damage);
    this.updatePlayerHpBar();

    // Hit animation on player
    this.tweens.add({
      targets: this.playerSprite,
      x: this.playerSprite.x - 15,
      duration: 50,
      yoyo: true,
      repeat: 3,
      ease: 'Bounce'
    });
    this.cameras.main.flash(300, 255, 0, 0);

    // Show PC LOAD LETTER feedback
    this.showFeedback(
      'PC LOAD LETTER',
      `Answer: ${q.correct_answer}`,
      q.article_url,
      0xff4444
    );

    this.time.delayedCall(2500, () => {
      this.clearFeedback();
      if (this.playerHp <= 0) {
        this.handlePlayerDefeat();
      } else {
        this.currentQuestionIndex++;
        this.isAnimating = false;
        this.showQuestion();
      }
    });
  }

  showFeedback(main, sub, link, color) {
    this.feedbackBg.setAlpha(0.7);
    this.feedbackText.setText(main).setColor(color === 0x44ff44 ? '#44ff44' : '#ff4444').setAlpha(1);
    this.feedbackSubText.setText(sub).setAlpha(1);
    this.feedbackLinkText.setText(link ? 'Click here to learn more' : '').setAlpha(link ? 1 : 0);

    // Make link clickable
    if (link) {
      this.feedbackLinkText.setInteractive({ useHandCursor: true });
      this.feedbackLinkText.once('pointerdown', () => {
        window.open(link, '_blank');
      });
    }
  }

  clearFeedback() {
    this.feedbackBg.setAlpha(0);
    this.feedbackText.setAlpha(0);
    this.feedbackSubText.setAlpha(0);
    this.feedbackLinkText.setAlpha(0).disableInteractive();
  }

  showStreakBonus(text) {
    this.streakText.setText(text).setAlpha(1);
    this.tweens.add({
      targets: this.streakText,
      y: this.streakText.y - 30,
      alpha: 0,
      duration: 1500,
      ease: 'Power2',
      onComplete: () => {
        this.streakText.y = 310;
      }
    });
  }

  updateBossHpBar() {
    const ratio = this.bossHp / this.bossMaxHp;
    this.tweens.add({
      targets: this.bossHpBar,
      scaleX: ratio,
      duration: 300,
      ease: 'Power2'
    });
    this.bossHpText.setText(`${this.bossHp}/${this.bossMaxHp}`);

    // Color change
    if (ratio <= 0.25) {
      this.bossHpBar.setFillStyle(0xff0000);
    } else if (ratio <= 0.5) {
      this.bossHpBar.setFillStyle(0xff8800);
    }
  }

  updatePlayerHpBar() {
    const ratio = this.playerHp / this.playerMaxHp;
    this.tweens.add({
      targets: this.playerHpBar,
      scaleX: ratio,
      duration: 300,
      ease: 'Power2'
    });
    this.playerHpText.setText(`${this.playerHp}/${this.playerMaxHp}`);

    if (ratio <= 0.25) {
      this.playerHpBar.setFillStyle(0xff0000);
    } else if (ratio <= 0.5) {
      this.playerHpBar.setFillStyle(0xffaa00);
    }
  }

  handlePlayerDefeat() {
    let lives = this.registry.get('lives') || 3;
    lives--;
    this.registry.set('lives', lives);
    this.livesText.setText(this.getLivesDisplay(lives));

    if (lives <= 0) {
      // Game over
      this.time.delayedCall(1000, () => {
        this.endBattle(false, true);
      });
    } else {
      // Lost a life, but can retry
      this.time.delayedCall(1000, () => {
        this.endBattle(false, false);
      });
    }
  }

  endBattle(won, gameOver = false) {
    const { width, height } = this.cameras.main;

    // Disable any remaining interaction
    this.answerButtons.forEach(btn => btn.disableInteractive());
    this.clearFeedback();
    soundManager.stopMusic();

    // Track global stats
    const allResults = this.registry.get('allBattleResults') || [];
    allResults.push(...this.battleResults);
    this.registry.set('allBattleResults', allResults);

    const battlesTotal = (this.registry.get('battlesTotal') || 0) + 1;
    this.registry.set('battlesTotal', battlesTotal);
    if (won) {
      const battlesWon = (this.registry.get('battlesWon') || 0) + 1;
      this.registry.set('battlesWon', battlesWon);
    }

    if (won) {
      soundManager.playVictory();
    } else {
      soundManager.playDefeat();
    }

    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0).setDepth(30);
    this.tweens.add({
      targets: overlay,
      alpha: 0.8,
      duration: 500
    });

    let titleText, subtitleText;
    if (won) {
      titleText = 'VICTORY!';
      subtitleText = `${this.bossName} has been defeated!`;

      // Boss death animation
      this.tweens.add({
        targets: this.bossSpriteObj,
        alpha: 0,
        scaleX: 0,
        scaleY: 12,
        duration: 800,
        ease: 'Power2'
      });
    } else if (gameOver) {
      titleText = 'GAME OVER';
      subtitleText = 'You have been relocated to the basement.';
    } else {
      titleText = 'DEFEATED!';
      subtitleText = `You lost a life! ${this.registry.get('lives')} staplers remaining.`;
    }

    this.time.delayedCall(600, () => {
      const title = this.add.text(width / 2, height / 2 - 40, titleText, {
        fontSize: '40px', fontFamily: 'monospace',
        color: won ? '#44ff44' : '#ff4444',
        fontStyle: 'bold', stroke: '#000000', strokeThickness: 6
      }).setOrigin(0.5).setDepth(31);

      const sub = this.add.text(width / 2, height / 2 + 20, subtitleText, {
        fontSize: '16px', fontFamily: 'monospace', color: '#ffffff',
        stroke: '#000000', strokeThickness: 3
      }).setOrigin(0.5).setDepth(31);

      const btnY = height / 2 + 45;
      const btnBg = this.add.rectangle(width / 2, btnY, 220, 36, 0x1a5c2a, 0.9);
      btnBg.setStrokeStyle(2, 0x44ff44);
      btnBg.setDepth(31);
      const continueText = this.add.text(width / 2, btnY, 'Click to continue', {
        fontSize: '14px', fontFamily: 'monospace', color: '#ffffff'
      }).setOrigin(0.5).setDepth(32);

      this.tweens.add({
        targets: continueText,
        alpha: 0.3,
        duration: 500,
        yoyo: true,
        repeat: -1
      });

      this.input.once('pointerdown', () => {
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.time.delayedCall(500, () => {
          this.scene.start('Summary', {
            bossName: this.bossName,
            bossType: this.bossType,
            won,
            gameOver,
            battleXp: this.battleXp,
            results: this.battleResults,
            totalScore: this.registry.get('score') || 0,
            lives: this.registry.get('lives') || 0,
            levelIndex: this.levelIndex,
            bossIndex: this.bossIndex
          });
        });
      });
    });
  }
}
