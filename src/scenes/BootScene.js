import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    // Show loading bar
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const barBg = this.add.rectangle(width / 2, height / 2, 400, 30, 0x333333);
    const bar = this.add.rectangle(width / 2 - 198, height / 2, 0, 26, 0x03b1fc);
    bar.setOrigin(0, 0.5);

    this.add.text(width / 2, height / 2 - 40, 'Loading TPS Reports...', {
      fontSize: '18px',
      fontFamily: 'monospace',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.load.on('progress', (value) => {
      bar.width = 396 * value;
    });

    // Sprites
    this.load.spritesheet('hero', 'assets/sprites/hero.png', { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet('npc', 'assets/sprites/npc.png', { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet('enemies', 'assets/sprites/enemies.png', { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet('items', 'assets/sprites/items.png', { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet('player-battle', 'assets/sprites/player-battle.png', { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet('meter', 'assets/ui/meter.png', { frameWidth: 14, frameHeight: 7 });

    // Tilesets
    this.load.spritesheet('town-tileset', 'assets/tilesets/town-tileset.png', { frameWidth: 16, frameHeight: 16 });
    this.load.image('grass', 'assets/tilesets/grass.png');

    // Backgrounds
    this.load.image('bg-country', 'assets/backgrounds/country.png');
    this.load.image('bg-forest', 'assets/backgrounds/forest.png');
    this.load.image('bg-night-town', 'assets/backgrounds/night-town.png');
    this.load.image('bg-caverns', 'assets/backgrounds/caverns.png');

    // Question data
    this.load.json('questions', 'assets/data/questions.json');
  }

  create() {
    // Hero animations — 3 columns x 4 rows (down, left, right, up)
    this.anims.create({
      key: 'hero-idle',
      frames: this.anims.generateFrameNumbers('hero', { start: 0, end: 2 }),
      frameRate: 4,
      repeat: -1
    });

    this.anims.create({
      key: 'hero-walk-down',
      frames: this.anims.generateFrameNumbers('hero', { start: 0, end: 2 }),
      frameRate: 8,
      repeat: -1
    });

    this.anims.create({
      key: 'hero-walk-left',
      frames: this.anims.generateFrameNumbers('hero', { start: 3, end: 5 }),
      frameRate: 8,
      repeat: -1
    });

    this.anims.create({
      key: 'hero-walk-right',
      frames: this.anims.generateFrameNumbers('hero', { start: 6, end: 8 }),
      frameRate: 8,
      repeat: -1
    });

    this.anims.create({
      key: 'hero-walk-up',
      frames: this.anims.generateFrameNumbers('hero', { start: 9, end: 11 }),
      frameRate: 8,
      repeat: -1
    });

    // NPC animations — use row 3 (frames 9-11) for a distinct narrator character
    this.anims.create({
      key: 'npc-idle',
      frames: this.anims.generateFrameNumbers('npc', { start: 9, end: 11 }),
      frameRate: 4,
      repeat: -1
    });

    // Enemy idle animations — one per row (3 rows of 4 frames)
    this.anims.create({
      key: 'enemy-idle-0',
      frames: this.anims.generateFrameNumbers('enemies', { start: 0, end: 3 }),
      frameRate: 4,
      repeat: -1
    });
    this.anims.create({
      key: 'enemy-idle-4',
      frames: this.anims.generateFrameNumbers('enemies', { start: 4, end: 7 }),
      frameRate: 4,
      repeat: -1
    });
    this.anims.create({
      key: 'enemy-idle-8',
      frames: this.anims.generateFrameNumbers('enemies', { start: 8, end: 11 }),
      frameRate: 4,
      repeat: -1
    });
    // Keep a default alias
    this.anims.create({
      key: 'enemy-idle',
      frames: this.anims.generateFrameNumbers('enemies', { start: 0, end: 3 }),
      frameRate: 4,
      repeat: -1
    });

    // Player battle stance
    this.anims.create({
      key: 'player-battle-idle',
      frames: this.anims.generateFrameNumbers('player-battle', { start: 0, end: 3 }),
      frameRate: 4,
      repeat: -1
    });

    this.scene.start('Title');
  }
}
