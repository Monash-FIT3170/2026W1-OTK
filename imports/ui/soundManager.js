// soundManager.js — singleton audio manager

const SFX_BASE = '/assets/audio/sfx/';
const MUSIC_BASE = '/assets/audio/music/';

// Map cardId → sfx filename. A card with no entry here falls back to
// FALLBACK_DAMAGE_SOUND or FALLBACK_EFFECT_SOUND - add an entry to give it
// its own sound.
const CARD_SOUNDS = {
  'ferocious-claw': 'ferocious-claw.wav',
  'fog-clearing': 'fog-clearing.wav',
  transcode: 'transcode.wav',
};

// Map powerUpId → sfx filename. Same fallbacks as CARD_SOUNDS.
const POWER_UP_SOUNDS = {};

// Power-ups that damage the enemy directly. Unlike cards, power-ups carry no
// attack stat, so the damage fallback needs telling which ones these are.
const DAMAGING_POWER_UPS = new Set(['deal-damage-power-up', 'coin-flip']);

// Fallbacks for cards / power-ups without a sound of their own
const FALLBACK_DAMAGE_SOUND = 'ferocious-claw.wav';
const FALLBACK_EFFECT_SOUND = 'transcode.wav';

// Named music tracks
const MUSIC_TRACKS = {
  'spark-mandrill': 'MegaMan_X_Spark_Mandrill_Theme.mp3',
  'battle': 'battle-ost-loop.wav',
};

// Named one-shot event sounds
const EVENT_SOUNDS = {
  'game-over': 'game_over.wav',
  'stage-clear': 'stage-clear.mp3',
  'card-hover': 'card_hover.mp3',
  gong: 'gong.mp3',
  swoosh: 'swoosh.mp3',
  'coin-up': 'coin-up.mp3',
};

class SoundManager {
  constructor() {
    this._masterVolume = 0.5;
    this._sfxVolume = 0.5;
    this._musicVolume = 0.4;
    this._muted = false;
    this._sfxMuted = false;
    this._musicMuted = false;

    /** @type {HTMLAudioElement | null} */
    this._currentMusic = null;
    this._currentTrackId = null;

    // Pre-cache Audio instances for SFX so first play has no delay
    this._sfxCache = {};
    this._eventCache = {};

    // Set by EnemyDisplay. While true, the next hit will be dodged, so
    // damage sounds are skipped and the dodge swoosh is the only sound.
    this._enemyEvadesNextHit = false;
  }

  setEnemyEvadesNextHit(evades) {
    this._enemyEvadesNextHit = evades;
  }

  _getSfx(filename, cache, basePath) {
    if (!cache[filename]) {
      cache[filename] = new Audio(basePath + filename);
    }
    return cache[filename];
  }

  _effectiveMusicVolume() {
    if (this._muted || this._musicMuted) return 0;
    return Math.max(0, Math.min(1, this._masterVolume * this._musicVolume));
  }

  _playAudio(audio, volume) {
    if (this._muted || this._sfxMuted) return;
    // Clone for overlapping plays (sfx)
    const clone = audio.cloneNode();
    clone.volume = Math.max(0, Math.min(1, this._masterVolume * volume));
    clone.play().catch(() => {
      // Autoplay policy or missing file — fail silently
    });
    return clone;
  }

  _playSfx(filename, volume) {
    const audio = this._getSfx(filename, this._sfxCache, SFX_BASE);
    this._playAudio(audio, this._sfxVolume * volume);
  }

  /**
   * @param {Object} card - card data; only cardId and baseAttack are read.
   * A card with an attack stat counts as a damage card, as in
   * DiscardNonDamageEffect.
   */
  playCardSound(card, volume = 1.0) {
    const dealsDamage = card.baseAttack != null;
    if (dealsDamage && this._enemyEvadesNextHit) return;
    const fallback = dealsDamage ? FALLBACK_DAMAGE_SOUND : FALLBACK_EFFECT_SOUND;
    this._playSfx(CARD_SOUNDS[card.cardId] ?? fallback, volume);
  }

  /** @param {Object} powerUp - power-up data; only powerUpId is read. */
  playPowerUpSound(powerUp, volume = 1.0) {
    const dealsDamage = DAMAGING_POWER_UPS.has(powerUp.powerUpId);
    if (dealsDamage && this._enemyEvadesNextHit) return;
    const fallback = dealsDamage ? FALLBACK_DAMAGE_SOUND : FALLBACK_EFFECT_SOUND;
    this._playSfx(POWER_UP_SOUNDS[powerUp.powerUpId] ?? fallback, volume);
  }

  playEventSound(eventId, volume = 1.0) {
    const filename = EVENT_SOUNDS[eventId];
    if (!filename) return;
    const audio = this._getSfx(filename, this._eventCache, SFX_BASE);
    this._playAudio(audio, this._sfxVolume * volume);
  }

  playGameOver() {
    this.playEventSound('game-over');
  }
  playStageClear() {
    // Non-overlapping: a rushed stage clear + win must not stack two stings.
    // Reuse the one cached element and restart it instead of cloning.
    if (this._muted || this._sfxMuted) return;
    const audio = this._getSfx('stage-clear.mp3', this._eventCache, SFX_BASE);
    audio.currentTime = 0;
    audio.volume = Math.max(0, Math.min(1, this._masterVolume * this._sfxVolume));
    audio.play().catch(() => {});
  }
  playCardHover() {
    this.playEventSound('card-hover');
  }
  playGong() {
    this.playEventSound('gong');
  }
  playSwoosh() {
    this.playEventSound('swoosh');
  }
  playCoinUp() {
    this.playEventSound('coin-up');
  }

  /**
   * Start background music by track id: 'call-to-adventure' or 'spark-mandrill'.
   * Loops automatically. Does nothing if the same track is already playing.
   */
  playBackgroundMusic(trackId = 0, { loop = true } = {}) {
    if (
      this._currentTrackId === trackId &&
      this._currentMusic &&
      !this._currentMusic.paused
    ) {
      return;
    }
    this.stopMusic();

    const filename = MUSIC_TRACKS[trackId];
    if (!filename) return;

    const audio = new Audio(MUSIC_BASE + filename);
    audio.loop = loop;
    audio.volume = this._effectiveMusicVolume();

    this._currentMusic = audio;
    this._currentTrackId = trackId;

    this._playWithAutoplayRetry(audio);
  }

  _playWithAutoplayRetry(audio) {
    audio.play().catch(() => {
      const events = ['click', 'keydown', 'touchstart'];
      const retry = () => {
        events.forEach((evt) => document.removeEventListener(evt, retry));
        // Only retry if this track hasn't since been stopped/replaced.
        if (this._currentMusic === audio) {
          audio.play().catch(() => {});
        }
      };
      events.forEach((evt) =>
        document.addEventListener(evt, retry, { once: true })
      );
    });
  }

  /** Stop background music immediately. */
  stopMusic() {
    if (this._currentMusic) {
      this._currentMusic.pause();
      this._currentMusic.currentTime = 0;
      this._currentMusic = null;
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
      this._currentMusic.volume = this._effectiveMusicVolume();
    }
  }

  setMasterVolume(v) {
    this._masterVolume = Math.max(0, Math.min(1, v));
    if (this._currentMusic) {
      this._currentMusic.volume = this._effectiveMusicVolume();
    }
  }

  setSfxMuted(muted) {
    this._sfxMuted = muted;
  }

  setMusicMuted(muted) {
    this._musicMuted = muted;
    if (this._currentMusic) {
      this._currentMusic.volume = this._effectiveMusicVolume();
    }
  }

  setMuted(muted) {
    this._muted = muted;
    if (this._currentMusic) {
      this._currentMusic.volume = this._effectiveMusicVolume();
    }
  }

  toggleMute() {
    this.setMuted(!this._muted);
    return this._muted;
  }

  get isMuted() {
    return this._muted;
  }
  get isSfxMuted() {
    return this._sfxMuted;
  }
  get isMusicMuted() {
    return this._musicMuted;
  }
  get masterVolume() {
    return this._masterVolume;
  }
  get sfxVolume() {
    return this._sfxVolume;
  }
  get musicVolume() {
    return this._musicVolume;
  }
  get currentTrack() {
    return this._currentTrackId;
  }
}

// Export a single shared instance
export const soundManager = new SoundManager();
