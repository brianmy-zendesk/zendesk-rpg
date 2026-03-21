import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene.js';
import { TitleScene } from './scenes/TitleScene.js';
import { OverworldScene } from './scenes/OverworldScene.js';
import { DialogueScene } from './scenes/DialogueScene.js';
import { BattleScene } from './scenes/BattleScene.js';
import { SummaryScene } from './scenes/SummaryScene.js';
import { EndGameScene } from './scenes/EndGameScene.js';
import { fetchLeaderboard } from './leaderboard.js';
import { soundManager } from './SoundManager.js';

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

// --- Leaderboard button ---
const btnLeaderboard = document.getElementById('btn-leaderboard');
const lbOverlay = document.getElementById('leaderboard-overlay');
const lbClose = document.getElementById('leaderboard-close');
const lbRefresh = document.getElementById('leaderboard-refresh');
const lbList = document.getElementById('leaderboard-list');

async function openLeaderboard() {
  lbOverlay.classList.add('open');
  lbList.innerHTML = '<div class="lb-loading">Loading...</div>';
  const entries = await fetchLeaderboard();
  renderLeaderboard(entries);
}

function renderLeaderboard(entries) {
  if (entries.length === 0) {
    lbList.innerHTML = '<div class="lb-empty">No scores yet. Be the first!</div>';
    return;
  }
  lbList.innerHTML = entries.map(e => {
    const rankClass = e.rank <= 3 ? ` rank-${e.rank}` : '';
    return `
      <div class="lb-entry${rankClass}">
        <div class="lb-name-row">
          <span class="lb-rank">${e.rank <= 3 ? ['', '1st', '2nd', '3rd'][e.rank] : '#' + e.rank}</span>
          <span class="lb-name">${escapeHtml(e.name)}</span>
        </div>
        <div class="lb-stats">
          <span class="lb-stat xp">XP ${e.xp}</span>
          <span class="lb-stat accuracy">Accuracy ${e.accuracy}%</span>
          <span class="lb-stat battles">Battles ${e.battlesWon}/${e.battlesTotal}</span>
        </div>
      </div>
    `;
  }).join('');
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Return focus to game canvas after button clicks
function refocusGame() {
  const canvas = document.querySelector('#game canvas');
  if (canvas) canvas.focus();
}

btnLeaderboard.addEventListener('click', openLeaderboard);
lbClose.addEventListener('click', () => { lbOverlay.classList.remove('open'); refocusGame(); });
lbRefresh.addEventListener('click', openLeaderboard);
lbOverlay.addEventListener('click', (e) => {
  if (e.target === lbOverlay) lbOverlay.classList.remove('open');
});

// --- Mute button ---
const btnMute = document.getElementById('btn-mute');

btnMute.addEventListener('click', () => {
  if (!soundManager.muted) {
    soundManager.mute();
    btnMute.textContent = 'Unmute';
    btnMute.classList.add('active');
  } else {
    soundManager.unmute();
    btnMute.textContent = 'Mute';
    btnMute.classList.remove('active');
  }
  refocusGame();
});

// --- How to Play button ---
const btnHowToPlay = document.getElementById('btn-howtoplay');
const htpOverlay = document.getElementById('howtoplay-overlay');
const htpClose = document.getElementById('howtoplay-close');

btnHowToPlay.addEventListener('click', () => htpOverlay.classList.add('open'));
htpClose.addEventListener('click', () => { htpOverlay.classList.remove('open'); refocusGame(); });
htpOverlay.addEventListener('click', (e) => {
  if (e.target === htpOverlay) htpOverlay.classList.remove('open');
});
