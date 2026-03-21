/**
 * Synthesizes retro chiptune sounds using the Web Audio API.
 * No external audio files needed.
 */
export class SoundManager {
  constructor() {
    this.ctx = null;
    this.musicGain = null;
    this.sfxGain = null;
    this.musicPlaying = false;
    this.currentTrack = null;
    this.musicNodes = [];
    this.musicTimeout = null;
    this.muted = false;
  }

  init() {
    if (this.ctx) {
      if (!this.muted && this.ctx.state === 'suspended') this.ctx.resume();
      return;
    }
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.value = 0.12;
    this.musicGain.connect(this.ctx.destination);
    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.value = 0.3;
    this.sfxGain.connect(this.ctx.destination);
    if (!this.muted && this.ctx.state === 'suspended') this.ctx.resume();
  }

  mute() {
    this.muted = true;
    this._trackBeforeMute = this.currentTrack;
    this.stopMusic();
    if (this.ctx) this.ctx.suspend();
  }

  unmute() {
    this.muted = false;
    if (this.ctx) this.ctx.resume();
    // Restart the track that was playing before mute
    const track = this._trackBeforeMute;
    this._trackBeforeMute = null;
    if (track === 'title') this.startTitleMusic();
    else if (track === 'overworld') this.startOverworldMusic();
    else if (track === 'battle') this.startBattleMusic();
  }

  // --- SFX ---

  playCorrect() {
    this.init();
    this.playTone(523.25, 0.08, 'square');
    setTimeout(() => this.playTone(659.25, 0.08, 'square'), 80);
    setTimeout(() => this.playTone(783.99, 0.15, 'square'), 160);
  }

  playWrong() {
    this.init();
    this.playTone(200, 0.15, 'sawtooth');
    setTimeout(() => this.playTone(150, 0.25, 'sawtooth'), 150);
  }

  playVictory() {
    this.init();
    const notes = [523.25, 587.33, 659.25, 783.99, 880, 1046.5];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.12, 'square'), i * 100);
    });
  }

  playDefeat() {
    this.init();
    const notes = [400, 350, 300, 250, 200];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.2, 'sawtooth'), i * 200);
    });
  }

  playStreak() {
    this.init();
    const notes = [880, 1108.73, 1318.51, 1760];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.08, 'square'), i * 60);
    });
  }

  playBossIntro() {
    this.init();
    const notes = [130.81, 130.81, 164.81, 196, 220, 196, 164.81, 130.81];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.15, 'square'), i * 150);
    });
  }

  playTone(frequency, duration, type = 'square') {
    if (!this.ctx || this.muted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(this.ctx.currentTime);
    osc.stop(this.ctx.currentTime + duration);
  }

  // --- Music ---

  startTitleMusic() {
    this.init();
    if (this.muted) return;
    if (this.currentTrack === 'title' && this.musicPlaying) return;
    this.stopMusic();
    this.musicPlaying = true;
    this.currentTrack = 'title';
    this._loopTitle();
  }

  startOverworldMusic() {
    this.init();
    if (this.muted) return;
    if (this.currentTrack === 'overworld' && this.musicPlaying) return;
    this.stopMusic();
    this.musicPlaying = true;
    this.currentTrack = 'overworld';
    this._loopOverworld();
  }

  startBattleMusic() {
    this.init();
    if (this.muted) return;
    if (this.currentTrack === 'battle' && this.musicPlaying) return;
    this.stopMusic();
    this.musicPlaying = true;
    this.currentTrack = 'battle';
    this._loopBattle();
  }

  stopMusic() {
    this.musicPlaying = false;
    this.currentTrack = null;
    if (this.musicTimeout) clearTimeout(this.musicTimeout);
    this.musicNodes.forEach(node => {
      try { node.stop(); } catch (e) {}
    });
    this.musicNodes = [];
  }

  // --- Title music: calm corporate elevator muzak ---
  _loopTitle() {
    if (!this.musicPlaying || this.currentTrack !== 'title') return;

    const bpm = 90;
    const beat = 60 / bpm;

    // Gentle arpeggiated chords — C major → Am → F → G
    const chords = [
      [261.63, 329.63, 392.00],  // C E G
      [220.00, 261.63, 329.63],  // A C E
      [174.61, 220.00, 261.63],  // F A C
      [196.00, 246.94, 293.66],  // G B D
    ];

    const loopDuration = chords.length * 2 * beat;

    chords.forEach((chord, ci) => {
      chord.forEach((freq, ni) => {
        if (!this.musicPlaying) return;
        const time = this.ctx.currentTime + (ci * 2 * beat) + (ni * beat * 0.3);
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.15, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + beat * 1.5);
        osc.connect(gain);
        gain.connect(this.musicGain);
        osc.start(time);
        osc.stop(time + beat * 1.8);
        this.musicNodes.push(osc);
      });
    });

    // Soft bass
    const bassNotes = [130.81, 110, 87.31, 98];
    bassNotes.forEach((freq, i) => {
      if (!this.musicPlaying) return;
      const time = this.ctx.currentTime + (i * 2 * beat);
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.12, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + beat * 1.8);
      osc.connect(gain);
      gain.connect(this.musicGain);
      osc.start(time);
      osc.stop(time + beat * 2);
      this.musicNodes.push(osc);
    });

    this.musicTimeout = setTimeout(() => {
      this.musicNodes = [];
      if (this.musicPlaying && this.currentTrack === 'title') this._loopTitle();
    }, loopDuration * 1000);
  }

  // --- Overworld music: upbeat adventure theme ---
  _loopOverworld() {
    if (!this.musicPlaying || this.currentTrack !== 'overworld') return;

    const bpm = 120;
    const beat = 60 / bpm;

    // Walking melody — bouncy and adventurous
    const melody = [
      392, 440, 494, 523, 494, 440, 392, 330,
      349, 392, 440, 494, 440, 392, 349, 330
    ];
    const bass = [130.81, 130.81, 164.81, 164.81, 146.83, 146.83, 110, 110];

    const loopDuration = bass.length * beat;

    // Melody (square wave, light)
    melody.forEach((freq, i) => {
      if (!this.musicPlaying || freq === 0) return;
      const time = this.ctx.currentTime + (i * beat * 0.5);
      if (time > this.ctx.currentTime + loopDuration) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.08, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + beat * 0.4);
      osc.connect(gain);
      gain.connect(this.musicGain);
      osc.start(time);
      osc.stop(time + beat * 0.5);
      this.musicNodes.push(osc);
    });

    // Bass (triangle wave)
    bass.forEach((freq, i) => {
      if (!this.musicPlaying) return;
      const time = this.ctx.currentTime + (i * beat);
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.15, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + beat * 0.9);
      osc.connect(gain);
      gain.connect(this.musicGain);
      osc.start(time);
      osc.stop(time + beat);
      this.musicNodes.push(osc);
    });

    // Percussion — hi-hat style noise on off-beats
    for (let i = 0; i < bass.length * 2; i++) {
      if (!this.musicPlaying) return;
      if (i % 2 === 1) {
        const time = this.ctx.currentTime + (i * beat * 0.5);
        if (time > this.ctx.currentTime + loopDuration) continue;
        const bufferSize = this.ctx.sampleRate * 0.03;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let j = 0; j < bufferSize; j++) data[j] = Math.random() * 2 - 1;
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.04, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.03);
        noise.connect(gain);
        gain.connect(this.musicGain);
        noise.start(time);
        this.musicNodes.push(noise);
      }
    }

    this.musicTimeout = setTimeout(() => {
      this.musicNodes = [];
      if (this.musicPlaying && this.currentTrack === 'overworld') this._loopOverworld();
    }, loopDuration * 1000);
  }

  // --- Battle music: intense corporate combat ---
  _loopBattle() {
    if (!this.musicPlaying || this.currentTrack !== 'battle') return;

    const bpm = 140;
    const beat = 60 / bpm;

    const bassNotes = [130.81, 130.81, 164.81, 146.83, 130.81, 130.81, 110, 123.47];
    const melodyNotes = [523.25, 0, 659.25, 523.25, 783.99, 0, 659.25, 783.99,
                         880, 0, 783.99, 659.25, 523.25, 0, 440, 523.25];

    const loopDuration = bassNotes.length * beat;

    // Bass
    bassNotes.forEach((freq, i) => {
      if (freq === 0 || !this.musicPlaying) return;
      const time = this.ctx.currentTime + (i * beat);
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.2, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + beat * 0.9);
      osc.connect(gain);
      gain.connect(this.musicGain);
      osc.start(time);
      osc.stop(time + beat);
      this.musicNodes.push(osc);
    });

    // Melody
    melodyNotes.forEach((freq, i) => {
      if (freq === 0 || !this.musicPlaying) return;
      const time = this.ctx.currentTime + (i * beat * 0.5);
      if (time > this.ctx.currentTime + loopDuration) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.1, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + beat * 0.4);
      osc.connect(gain);
      gain.connect(this.musicGain);
      osc.start(time);
      osc.stop(time + beat * 0.5);
      this.musicNodes.push(osc);
    });

    this.musicTimeout = setTimeout(() => {
      this.musicNodes = [];
      if (this.musicPlaying && this.currentTrack === 'battle') this._loopBattle();
    }, loopDuration * 1000);
  }
}

// Singleton
export const soundManager = new SoundManager();
