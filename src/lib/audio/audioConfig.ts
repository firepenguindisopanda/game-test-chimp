/**
 * Registry of all available sound effects.
 * Key: logical name used throughout the app.
 * Value: path relative to the `public/` directory (served at `/audio/...`).
 *
 * To add a new sound:
 *   1. Copy the .wav file to `public/audio/<name>.wav`
 *   2. Add an entry here: `my_sound: '/audio/my_sound.wav'`
 */
const audioFiles: Record<string, string> = {
  ogre_selected3: "/audio/ogre_selected3.wav",
  ogre_selected2: "/audio/ogre_selected2.wav",
  ogre_acknowledge3: "/audio/ogre_acknowledge3.wav",
  horde_ship_acknowledge3: "/audio/horde_ship_acknowledge3.wav",
} as const;

/**
 * Resolve a logical sound name to its file path.
 * Returns `null` and warns if the name is not registered.
 */
export function getAudioPath(name: string): string | null {
  const path = audioFiles[name];
  if (!path) {
    console.warn(
      `[AudioManager] Unknown sound: "${name}". ` +
        `Available sounds: ${Object.keys(audioFiles).join(", ")}`
    );
    return null;
  }
  return path;
}

/** Return the list of all registered sound names (useful for debugging). */
export function getSoundNames(): string[] {
  return Object.keys(audioFiles);
}
