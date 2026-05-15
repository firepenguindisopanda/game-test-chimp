import { useCallback } from "react";
import { AudioManager } from "./AudioManager";

/**
 * React hook for playing a named sound.
 *
 * Usage:
 * ```tsx
 * const { play } = useSound('ogre_selected3');
 * <button onClick={play} />
 * ```
 *
 * The returned `play` callback is stable (same reference across renders)
 * as long as `soundName` doesn't change. Does NOT cause re-renders.
 */
export function useSound(soundName: string): { play: () => void } {
  const audioManager = AudioManager.getInstance();

  const play = useCallback(() => {
    audioManager.play(soundName);
  }, [audioManager, soundName]);

  return { play };
}
