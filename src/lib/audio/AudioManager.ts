import { getAudioPath } from "./audioConfig";

export class AudioManager {
  private static instance: AudioManager;
  private cache = new Map<string, HTMLAudioElement>();
  private _volume = 1;
  private _muted = false;

  private constructor() {
    // Singleton — use getInstance()
  }

  /** Get the singleton AudioManager instance. */
  static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  /**
   * Play a sound by its logical name.
   * Creates a fresh HTMLAudioElement each call so rapid clicks overlap naturally.
   * Errors (404, autoplay policy, etc.) are caught silently — the game never
   * breaks because a sound file is missing or blocked.
   */
  play(name: string): void {
    const path = getAudioPath(name);
    if (!path) return; // unknown name already warned by getAudioPath

    try {
      const audio = new Audio(path);
      audio.volume = this._muted ? 0 : this._volume;

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err: unknown) => {
          // Browser autoplay policy, 404, or other non-critical audio errors
          if (err instanceof DOMException && err.name === "AbortError") {
            // AbortError is expected when play() is interrupted by another play()
            return;
          }
          console.warn(`[AudioManager] Failed to play "${name}":`, err);
        });
      }
    } catch (err) {
      console.warn(`[AudioManager] Error creating audio for "${name}":`, err);
    }
  }

  /**
   * Preload a sound into the browser cache.
   * Useful for sounds that must play with zero latency on first trigger.
   */
  preload(name: string): void {
    if (this.cache.has(name)) return;

    const path = getAudioPath(name);
    if (!path) return;

    const audio = new Audio();
    audio.preload = "auto";
    audio.src = path;
    this.cache.set(name, audio);
  }

  // ─── Volume Control ────────────────────────────────────

  setVolume(volume: number): void {
    this._volume = Math.max(0, Math.min(1, volume));
  }

  getVolume(): number {
    return this._volume;
  }

  setMuted(muted: boolean): void {
    this._muted = muted;
  }

  isMuted(): boolean {
    return this._muted;
  }

  // ─── Cleanup ──────────────────────────────────────────

  /** Release all audio resources. Call on app unmount. */
  dispose(): void {
    for (const [, audio] of this.cache) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load(); // forces the browser to release the resource
    }
    this.cache.clear();
    // @ts-expect-error - allow re-creation on next getInstance()
    AudioManager.instance = undefined;
  }
}
