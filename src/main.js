import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene.js';
import { TitleScene } from './scenes/TitleScene.js';
import { OverworldScene } from './scenes/OverworldScene.js';
import { DialogueScene } from './scenes/DialogueScene.js';
import { BattleScene } from './scenes/BattleScene.js';
import { SummaryScene } from './scenes/SummaryScene.js';
import { EndGameScene } from './scenes/EndGameScene.js';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game',
  pixelArt: true,
  backgroundColor: '#1a1a2e',
  physics: {
    default: 'arcade',
    arcade: { debug: false }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [BootScene, TitleScene, OverworldScene, DialogueScene, BattleScene, SummaryScene, EndGameScene]
};

const game = new Phaser.Game(config);
window.__PHASER_GAME__ = game;

// Global game state
game.registry.set('score', 0);
game.registry.set('lives', 3);
game.registry.set('questionsAnswered', []);
game.registry.set('allBattleResults', []);
game.registry.set('battlesWon', 0);
game.registry.set('battlesTotal', 0);
