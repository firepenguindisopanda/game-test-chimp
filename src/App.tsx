import { useReducer, useCallback, useRef } from "react";
import { gameReducer, createInitialState } from "@/lib/gameReducer";
import { saveScore } from "@/lib/supabase";
import { HomeScreen } from "@/components/HomeScreen";
import { GameScreen } from "@/components/GameScreen";
import { LeaderboardScreen } from "@/components/LeaderboardScreen";

export default function App() {
  const [state, dispatch] = useReducer(
    gameReducer,
    undefined,
    createInitialState
  );
  const latestScoreRef = useRef<
    { level: number; tiles: number } | undefined
  >(undefined);
  const stateRef = useRef(state);
  stateRef.current = state;

  const handleStart = useCallback((playerName: string) => {
    dispatch({ type: "START_GAME", playerName });
  }, []);

  const handleTileClick = useCallback((index: number) => {
    dispatch({ type: "CLICK_TILE", index });
  }, []);

  const handleNextRound = useCallback(() => {
    dispatch({ type: "NEXT_ROUND" });
  }, []);

  const handleLifeLost = useCallback(() => {
    dispatch({ type: "LIFE_LOST" });
  }, []);

  // Stable reference — always reads latest state via ref
  const handleGameOver = useCallback(() => {
    const s = stateRef.current;
    latestScoreRef.current = { level: s.bestLevel, tiles: s.tiles };

    // Fire-and-forget save to Supabase
    saveScore(s.playerName, s.bestLevel, s.tiles);

    dispatch({ type: "GAME_OVER" });
  }, []);

  const handleGoHome = useCallback(() => {
    dispatch({ type: "GO_HOME" });
  }, []);

  const handleGoLeaderboard = useCallback(() => {
    dispatch({ type: "GO_LEADERBOARD" });
  }, []);

  if (state.screen === "home") {
    return (
      <HomeScreen onStart={handleStart} onLeaderboard={handleGoLeaderboard} />
    );
  }

  if (state.screen === "playing") {
    return (
      <GameScreen
        state={state}
        onTileClick={handleTileClick}
        onNextRound={handleNextRound}
        onLifeLost={handleLifeLost}
        onGameOver={handleGameOver}
        onQuit={handleGoHome}
      />
    );
  }

  if (state.screen === "leaderboard") {
    return (
      <LeaderboardScreen
        playerName={state.playerName}
        onHome={handleGoHome}
        latestScore={latestScoreRef.current}
      />
    );
  }

  return null;
}
