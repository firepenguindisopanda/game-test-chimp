import { AudioManager } from "./AudioManager";

/**
 * Maps high-level game interaction events to audio feedback.
 *
 * Usage:
 * ```typescript
 * const interactions = new InteractionManager();
 * interactions.onTileClick();  // plays the tile-click sound
 * ```
 *
 * To add a new sound for an event:
 *   1. Add a method here
 *   2. Register the sound name via registerSound()
 *   3. Call the method from the relevant component
 */
export class InteractionManager {
  private audio: AudioManager;
  private soundMap: Record<string, string>;

  constructor(audio: AudioManager = AudioManager.getInstance()) {
    this.audio = audio;
    this.soundMap = {
      tileClick: "ogre_selected3",
      wrongGuess: "ogre_selected2",
      levelClear: "ogre_acknowledge3",
      gameOver: "horde_ship_acknowledge3",
    };
  }

  /** Play the sound associated with clicking a game tile. */
  onTileClick(): void {
    this.audio.play(this.soundMap.tileClick);
  }

  /** Play the sound when the player guesses the wrong tile. */
  onWrongGuess(): void {
    this.audio.play(this.soundMap.wrongGuess);
  }

  /** Play the sound when a level is cleared successfully. */
  onLevelClear(): void {
    this.audio.play(this.soundMap.levelClear);
  }

  /** Play the sound when the game ends (all lives lost). */
  onGameOver(): void {
    this.audio.play(this.soundMap.gameOver);
  }

  /**
   * Register or override which sound plays for a given event.
   *
   * Example:
   * ```typescript
   * interactions.registerSound('tileClick', 'ogre_selected2');
   * ```
   */
  registerSound(event: string, soundName: string): void {
    this.soundMap[event] = soundName;
  }
}
