import Phaser from 'phaser';
import { LEVELS, getBossConfig, getBossCount, NPC_NAME } from '../GameState.js';
import { soundManager } from '../SoundManager.js';

/**
 * Free-roaming overworld map. Player moves with arrow keys / WASD.
 * Walking up to the NPC near the current boss triggers dialogue.
 */
export class OverworldScene extends Phaser.Scene {
  constructor() {
    super('Overworld');
  }

  init(data) {
    this.levelIndex = data.levelIndex || 0;
    this.bossIndex = data.bossIndex || 0;
    this.dialogueTriggered = false;
  }

  create() {
    this.cameras.main.fadeIn(500, 0, 0, 0);
    soundManager.startOverworldMusic();

    const level = LEVELS[this.levelIndex];
    const totalBosses = getBossCount(this.levelIndex);

    // World bounds — larger than the viewport
    const WORLD_W = 1600;
    const WORLD_H = 1000;
    this.physics.world.setBounds(0, 0, WORLD_W, WORLD_H);

    // Background — themed per level
    const grassTile = this.add.tileSprite(WORLD_W / 2, WORLD_H / 2, WORLD_W, WORLD_H, 'grass');
    grassTile.setTileScale(3, 3);
    if (level.overworldTint) {
      grassTile.setTint(level.overworldTint);
    }

    // --- Layout boss nodes along a winding path ---
    const nodePositions = this.layoutBossNodes(totalBosses, WORLD_W, WORLD_H);

    // Draw paths between nodes
    this.drawPaths(nodePositions);

    // Draw decorations
    this.drawDecorations(WORLD_W, WORLD_H, nodePositions);

    // Place boss nodes, NPCs, labels
    this.npcSprites = [];
    this.bossNodes = [];

    for (let i = 0; i < totalBosses; i++) {
      const pos = nodePositions[i];
      const boss = level.bosses[i];
      const defeated = i < this.bossIndex;
      const current = i === this.bossIndex;

      // Node platform
      const platformColor = defeated ? 0x44ff44 : current ? 0xff6644 : 0x555555;
      const nodeSize = boss.type === 'big' ? 24 : 16;
      const node = this.add.circle(pos.x, pos.y, nodeSize, platformColor);
      node.setStrokeStyle(3, 0xffffff);

      if (current) {
        this.tweens.add({
          targets: node,
          scaleX: 1.3, scaleY: 1.3,
          duration: 500, yoyo: true, repeat: -1
        });
      }

      // Boss label
      const label = boss.type === 'big' ? '★ ' + boss.name : boss.name;
      const labelColor = defeated ? '#44ff44' : current ? '#ff6644' : '#888888';
      this.add.text(pos.x, pos.y + 30, label, {
        fontSize: '11px', fontFamily: 'monospace', color: labelColor,
        align: 'center', stroke: '#000000', strokeThickness: 3,
        wordWrap: { width: 120 }
      }).setOrigin(0.5, 0);

      // Checkmark for defeated
      if (defeated) {
        this.add.text(pos.x, pos.y - 5, '✓', {
          fontSize: '20px', fontFamily: 'monospace', color: '#44ff44',
          fontStyle: 'bold', stroke: '#000000', strokeThickness: 3
        }).setOrigin(0.5);
      }

      // Enemy sprite on future/current boss nodes
      if (!defeated) {
        let enemy;
        if (boss.bossSprite) {
          enemy = this.add.sprite(pos.x, pos.y - 40, boss.bossSprite, 0).setScale(0.8);
          enemy.play(`${boss.bossSprite}-idle`);
        } else {
          const ef = boss.enemyFrame || 0;
          enemy = this.add.sprite(pos.x, pos.y - 30, 'enemies', ef).setScale(3);
          enemy.play(`enemy-idle-${ef}`);
        }
        if (!current) enemy.setAlpha(0.4);
      }

      // NPC near current boss
      if (current) {
        const npcX = pos.x - 60;
        const npcY = pos.y;
        const npc = this.physics.add.sprite(npcX, npcY, 'npc', 9).setScale(3);
        npc.play('npc-idle');
        npc.body.setImmovable(true);
        npc.body.setSize(16, 16);
        this.currentNpc = npc;

        // NPC name tag
        const npcName = NPC_NAME;
        this.npcNameTag = this.add.text(npcX, npcY - 30, npcName, {
          fontSize: '10px', fontFamily: 'monospace', color: '#f0c040',
          stroke: '#000000', strokeThickness: 3
        }).setOrigin(0.5);

        // Speech bubble hint
        this.interactHint = this.add.text(npcX, npcY - 45, '[ ENTER to talk ]', {
          fontSize: '9px', fontFamily: 'monospace', color: '#ffffff',
          stroke: '#000000', strokeThickness: 3
        }).setOrigin(0.5).setAlpha(0);
      }

      this.bossNodes.push(pos);
    }

    // --- Hero (physics-enabled) ---
    const startPos = this.getHeroStartPosition(nodePositions);
    this.hero = this.physics.add.sprite(startPos.x, startPos.y, 'hero', 7).setScale(3);
    this.hero.setCollideWorldBounds(true);
    this.hero.body.setSize(12, 12);
    this.hero.body.setOffset(2, 4);

    // Camera follows hero
    this.cameras.main.startFollow(this.hero, true, 0.1, 0.1);
    this.cameras.main.setBounds(0, 0, WORLD_W, WORLD_H);

    // --- HUD (fixed to camera) ---
    const { width, height } = this.cameras.main;

    this.add.text(width / 2, 16, `LEVEL ${this.levelIndex + 1}: ${level.name.toUpperCase()}`, {
      fontSize: '20px', fontFamily: 'monospace', color: '#ffffff',
      fontStyle: 'bold', stroke: '#000000', strokeThickness: 5
    }).setOrigin(0.5).setScrollFactor(0).setDepth(20);

    const score = this.registry.get('score') || 0;
    this.add.text(16, 8, `XP: ${score}`, {
      fontSize: '16px', fontFamily: 'monospace', color: '#f0c040',
      stroke: '#000000', strokeThickness: 3
    }).setScrollFactor(0).setDepth(20);

    const lives = this.registry.get('lives') || 3;
    this.add.text(width - 16, 8, 'LIVES: ' + '♥ '.repeat(lives) + '♡ '.repeat(3 - lives), {
      fontSize: '16px', fontFamily: 'monospace', color: '#ff4444',
      stroke: '#000000', strokeThickness: 3
    }).setOrigin(1, 0).setScrollFactor(0).setDepth(20);

    this.promptText = this.add.text(width / 2, height - 24, 'Use arrow keys or WASD to move', {
      fontSize: '13px', fontFamily: 'monospace', color: '#aaaaaa',
      stroke: '#000000', strokeThickness: 2
    }).setOrigin(0.5).setScrollFactor(0).setDepth(20);

    // --- Input ---
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = {
      up: this.input.keyboard.addKey('W'),
      down: this.input.keyboard.addKey('S'),
      left: this.input.keyboard.addKey('A'),
      right: this.input.keyboard.addKey('D')
    };
    this.enterKey = this.input.keyboard.addKey('ENTER');
    this.enterJustPressed = false;
    this.enterKey.on('down', () => { this.enterJustPressed = true; });

    // Collision with NPC
    if (this.currentNpc) {
      this.physics.add.collider(this.hero, this.currentNpc);
    }
  }

  layoutBossNodes(totalBosses, worldW, worldH) {
    // Place bosses in a winding path layout
    const positions = [];
    const marginX = 200;
    const marginY = 200;
    const usableW = worldW - marginX * 2;
    const usableH = worldH - marginY * 2;

    for (let i = 0; i < totalBosses; i++) {
      const t = i / (totalBosses - 1 || 1);
      // Zigzag pattern: odd indices go right, even go left-ish
      const row = Math.floor(i / 2);
      const col = i % 2;

      let x, y;
      if (totalBosses <= 3) {
        // Simple horizontal spread
        x = marginX + t * usableW;
        y = worldH / 2;
      } else {
        // Winding S-curve path
        x = marginX + t * usableW;
        y = marginY + (Math.sin(t * Math.PI * 1.5) * 0.3 + 0.5) * usableH;
      }

      positions.push({ x: Math.round(x), y: Math.round(y) });
    }

    return positions;
  }

  drawPaths(positions) {
    const graphics = this.add.graphics();
    graphics.lineStyle(12, 0xc4a63a, 0.5);

    for (let i = 0; i < positions.length - 1; i++) {
      const a = positions[i];
      const b = positions[i + 1];

      // Draw a slightly curved path between nodes
      const midX = (a.x + b.x) / 2;
      const midY = (a.y + b.y) / 2 + (i % 2 === 0 ? -40 : 40);

      const curve = new Phaser.Curves.QuadraticBezier(
        new Phaser.Math.Vector2(a.x, a.y),
        new Phaser.Math.Vector2(midX, midY),
        new Phaser.Math.Vector2(b.x, b.y)
      );

      const points = curve.getPoints(20);
      graphics.beginPath();
      graphics.moveTo(points[0].x, points[0].y);
      for (let j = 1; j < points.length; j++) {
        graphics.lineTo(points[j].x, points[j].y);
      }
      graphics.strokePath();
    }

    // Path border
    graphics.lineStyle(14, 0x8b7328, 0.3);
    for (let i = 0; i < positions.length - 1; i++) {
      const a = positions[i];
      const b = positions[i + 1];
      graphics.beginPath();
      graphics.moveTo(a.x, a.y);
      graphics.lineTo(b.x, b.y);
      graphics.strokePath();
    }
  }

  drawDecorations(worldW, worldH, bossPositions) {
    // Scatter some decorative elements (trees, rocks) using town tileset
    const decorations = [];
    const rng = new Phaser.Math.RandomDataGenerator(['overworld']);

    for (let i = 0; i < 40; i++) {
      const x = rng.between(50, worldW - 50);
      const y = rng.between(80, worldH - 50);

      // Don't place decorations too close to boss nodes or paths
      let tooClose = false;
      for (const pos of bossPositions) {
        if (Phaser.Math.Distance.Between(x, y, pos.x, pos.y) < 100) {
          tooClose = true;
          break;
        }
      }
      if (tooClose) continue;

      // Use town-tileset frames for variety (trees, buildings, etc.)
      const frames = [0, 1, 2, 22, 23, 44, 45, 66, 67];
      const frame = rng.pick(frames);
      const deco = this.add.sprite(x, y, 'town-tileset', frame).setScale(2.5);
      deco.setAlpha(0.6);
      decorations.push(deco);
    }
  }

  getHeroStartPosition(nodePositions) {
    if (this.bossIndex === 0) {
      // Start to the left of the first boss
      return { x: nodePositions[0].x - 120, y: nodePositions[0].y };
    }
    // Start near the previously defeated boss
    const prev = nodePositions[this.bossIndex - 1];
    return { x: prev.x + 30, y: prev.y };
  }

  update() {
    if (this.dialogueTriggered) {
      this.hero.body.setVelocity(0);
      return;
    }

    const speed = 160;
    let vx = 0;
    let vy = 0;

    // Movement input
    if (this.cursors.left.isDown || this.wasd.left.isDown) vx = -speed;
    else if (this.cursors.right.isDown || this.wasd.right.isDown) vx = speed;

    if (this.cursors.up.isDown || this.wasd.up.isDown) vy = -speed;
    else if (this.cursors.down.isDown || this.wasd.down.isDown) vy = speed;

    // Normalize diagonal movement
    if (vx !== 0 && vy !== 0) {
      vx *= 0.707;
      vy *= 0.707;
    }

    this.hero.body.setVelocity(vx, vy);

    // Animation
    if (vx < 0) {
      this.hero.play('hero-walk-left', true);
    } else if (vx > 0) {
      this.hero.play('hero-walk-right', true);
    } else if (vy < 0) {
      this.hero.play('hero-walk-up', true);
    } else if (vy > 0) {
      this.hero.play('hero-walk-down', true);
    } else {
      this.hero.anims.stop();
      this.hero.setFrame(7); // face right when idle
    }

    // Check proximity to NPC
    if (this.currentNpc) {
      const dist = Phaser.Math.Distance.Between(
        this.hero.x, this.hero.y,
        this.currentNpc.x, this.currentNpc.y
      );

      if (dist < 60) {
        this.interactHint.setAlpha(1);
        this.promptText.setText('Press ENTER to talk');

        if (this.enterJustPressed) {
          this.enterJustPressed = false;
          this.startDialogue();
        }
      } else {
        this.interactHint.setAlpha(0);
        this.promptText.setText('Use arrow keys or WASD to move');
      }
    }
  }

  startDialogue() {
    this.dialogueTriggered = true;
    this.hero.body.setVelocity(0);
    this.hero.anims.stop();

    const boss = getBossConfig(this.levelIndex, this.bossIndex);
    this.cameras.main.fadeOut(400, 0, 0, 0);
    this.time.delayedCall(400, () => {
      this.scene.start('Dialogue', {
        levelIndex: this.levelIndex,
        bossIndex: this.bossIndex,
        dialogue: boss.introDialogue,
        npcName: NPC_NAME,
        nextScene: 'Battle',
        nextSceneData: {
          bossType: boss.type,
          bossName: boss.name,
          bigBoss: boss.bigBoss,
          miniBoss: boss.miniBoss,
          background: boss.background,
          enemyFrame: boss.enemyFrame,
          bossSprite: boss.bossSprite,
          levelIndex: this.levelIndex,
          bossIndex: this.bossIndex
        }
      });
    });
  }
}
