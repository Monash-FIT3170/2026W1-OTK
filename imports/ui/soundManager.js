// soundManager.js — singleton audio manager

const SFX_BASE = '/assets/audio/sfx/';
const MUSIC_BASE = '/assets/audio/music/';

// Map cardId → sfx filename
const CARD_SOUNDS = {
  'ferocious-claw': 'ferocious-claw.wav',
  'fog-clearing':   'fog-clearing.wav',
  'transcode':      'transcode.wav',
};

// Named music tracks
const MUSIC_TRACKS = {
  'spark-mandrill':    'MegaMan_X_Spark_Mandrill_Theme.mp3',
};

// Named one-shot event sounds
const EVENT_SOUNDS = {
  'game-over':    'game_over.wav',
  'stage-clear':  'stage-clear.mp3',
  'card-hover':   'card_hover.mp3',
};

class SoundManager {
  constructor() {
    this._sfxVolume   = 1.0;
    this._musicVolume = 0.5;
    this._muted       = false;

    /** @type {HTMLAudioElement | null} */
    this._currentMusic = null;
    this._currentTrackId = null;

    // Pre-cache Audio instances for SFX so first play has no delay
    this._sfxCache   = {};
    this._eventCache = {};
  }

  _getSfx(filename, cache, basePath) {
    if (!cache[filename]) {
      cache[filename] = new Audio(basePath + filename);
    }
    return cache[filename];
  }

  _playAudio(audio, volume) {
    if (this._muted) return;
    // Clone for overlapping plays (sfx)
    const clone = audio.cloneNode();
    clone.volume = Math.max(0, Math.min(1, volume));
    clone.play().catch(() => {
      // Autoplay policy or missing file — fail silently
    });
    return clone;
  }


  playCardSound(cardId) {
    const filename = CARD_SOUNDS[cardId];
    if (filename) {
      const audio = this._getSfx(filename, this._sfxCache, SFX_BASE);
      this._playAudio(audio, this._sfxVolume);
    } else {
      this.playEventSound('bonk');
    }
  }


  playEventSound(eventId) {
    const filename = EVENT_SOUNDS[eventId];
    if (!filename) return;
    const audio = this._getSfx(filename, this._eventCache, SFX_BASE);
    this._playAudio(audio, this._sfxVolume);
  }

  playGameOver()   { this.playEventSound('game-over');   }
  playStageClear() { this.playEventSound('stage-clear'); }
  playCardHover()  { this.playEventSound('card-hover');  }

  /**
   * Start background music by track id: 'call-to-adventure' or 'spark-mandrill'.
   * Loops automatically. Does nothing if the same track is already playing.
   */
  playBackgroundMusic(trackId = 0, { loop = true } = {}) {
    if (this._currentTrackId === trackId && this._currentMusic && !this._currentMusic.paused) {
      return;
    }
    this.stopMusic();

    const filename = MUSIC_TRACKS[trackId];
    if (!filename) return;

    const audio = new Audio(MUSIC_BASE + filename);
    audio.loop   = loop;
    audio.volume = this._muted ? 0 : Math.max(0, Math.min(1, this._musicVolume));

    this._currentMusic   = audio;
    this._currentTrackId = trackId;

    audio.play().catch(() => {
      // Autoplay policy — user interaction required; silently deferred
    });
  }

  /** Stop background music immediately. */
  stopMusic() {
    if (this._currentMusic) {
      this._currentMusic.pause();
      this._currentMusic.currentTime = 0;
      this._currentMusic   = null;
      this._currentTrackId = null;
    }
  }

  /** Pause / resume background music. */
  pauseMusic() {
    this._currentMusic?.pause();
  }

  resumeMusic() {
    if (this._currentMusic && this._currentMusic.paused) {
      this._currentMusic.play().catch(() => {});
    }
  }

  setSfxVolume(v) {
    this._sfxVolume = Math.max(0, Math.min(1, v));
  }

  setMusicVolume(v) {
    this._musicVolume = Math.max(0, Math.min(1, v));
    if (this._currentMusic) {
      this._currentMusic.volume = this._muted ? 0 : this._musicVolume;
    }
  }

  setMuted(muted) {
    this._muted = muted;
    if (this._currentMusic) {
      this._currentMusic.volume = muted ? 0 : this._musicVolume;
    }
  }

  toggleMute() {
    this.setMuted(!this._muted);
    return this._muted;
  }

  get isMuted()      { return this._muted; }
  get sfxVolume()    { return this._sfxVolume; }
  get musicVolume()  { return this._musicVolume; }
  get currentTrack() { return this._currentTrackId; }
}

// Export a single shared instance
export const soundManager = new SoundManager();
