import { useCallback, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Tile } from "@/components/Tile";
import { TimerRing } from "@/components/TimerRing";
import type { GameState } from "@/lib/types";
import { InteractionManager } from "@/lib/audio";

interface GameScreenProps {
  state: GameState;
  onTileClick: (index: number) => void;
  onHideTiles: () => void;
  onNextRound: () => void;
  onLifeLost: () => void;
  onGameOver: () => void;
  onQuit: () => void;
}

export function GameScreen({
  state,
  onTileClick,
  onHideTiles,
  onNextRound,
  onLifeLost,
  onGameOver,
  onQuit,
}: GameScreenProps) {
  const prevLivesRef = useRef(state.lives);
  const isTimedMode = state.mode === "advanced" || state.mode === "super_advanced";
  const interactionsRef = useRef(new InteractionManager());

  // Handle wrong guess → new pattern after 400ms
  useEffect(() => {
    if (state.lives < prevLivesRef.current) {
      interactionsRef.current.onWrongGuess();
      const timer = setTimeout(() => {
        onLifeLost();
      }, 400);
      prevLivesRef.current = state.lives;
      return () => clearTimeout(timer);
    }
  }, [state.lives, onLifeLost]);

  // Handle level cleared → next round after 900ms
  useEffect(() => {
    if (state.messageType === "success") {
      interactionsRef.current.onLevelClear();
      const timer = setTimeout(() => {
        onNextRound();
      }, 900);
      return () => clearTimeout(timer);
    }
  }, [state.messageType, onNextRound]);

  // Handle game over (lives = 0) → navigate after 1800ms
  useEffect(() => {
    if (state.lives <= 0) {
      interactionsRef.current.onGameOver();
      const timer = setTimeout(() => {
        onGameOver();
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [state.lives, onGameOver]);

  const handleTileClick = useCallback(
    (index: number) => {
      interactionsRef.current.onTileClick();
      onTileClick(index);
    },
    [onTileClick]
  );

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-4 sm:p-8">
      {/* Stats Bar */}
      <div className="flex gap-3 sm:gap-4 mb-6 flex-wrap justify-center items-center">
        <StatBox label="Level" value={state.level} />
        <StatBox label="Tiles" value={state.tiles} />
        <StatBox label="Best" value={state.bestLevel} />
        <StatBox label="Lives" value={"❤️".repeat(state.lives)} />
        {isTimedMode && state.revealed && (
          <TimerRing
            key={`${state.level}-${state.lives}-${state.tiles}`}
            duration={state.viewTime}
            onTimeUp={onHideTiles}
          />
        )}
      </div>

      {/* Message */}
      {state.message && (
        <div
          className={`text-lg font-semibold mb-4 text-center min-h-[28px] ${
            state.messageType === "success"
              ? "text-green-400"
              : state.messageType === "fail"
                ? "text-red-400"
                : "text-white"
          }`}
          role="alert"
        >
          {state.message}
        </div>
      )}

      {/* Grid */}
      <div className="w-full max-w-[520px] flex-1 flex items-center justify-center">
        <div
          className="grid gap-2 w-full"
          style={{
            gridTemplateColumns: "repeat(6, 1fr)",
          }}
        >
          {state.grid.map((tile) => (
            <Tile
              key={tile.index}
              number={tile.number}
              state={tile.state}
              onClick={() => handleTileClick(tile.index)}
            />
          ))}
        </div>
      </div>

      {/* Mode indicator */}
      <div className="mt-3 text-xs text-blue-300/60 uppercase tracking-widest">
        {state.mode === "beginner"
          ? "Beginner"
          : state.mode === "advanced"
            ? `Advanced · ${state.viewTime}s`
            : `Super Advanced · ${state.viewTime}s`}
      </div>

      {/* Quit button */}
      <div className="mt-6">
        <Button variant="outline" onClick={onQuit} className="text-white border-white/30 hover:bg-white/10">
          Quit
        </Button>
      </div>
    </div>
  );
}

function StatBox({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="bg-white/10 backdrop-blur rounded-lg px-4 py-3 min-w-[80px] text-center border border-white/10">
      <div className="text-xs text-blue-300 uppercase tracking-wider mb-1">
        {label}
      </div>
      <div className="text-xl font-bold text-white">{value}</div>
    </div>
  );
}
