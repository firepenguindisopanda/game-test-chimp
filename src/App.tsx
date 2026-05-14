import { useReducer, useCallback, useRef } from "react";
import { gameReducer, createInitialState } from "@/lib/gameReducer";
import { saveScore } from "@/lib/supabase";
import { HomeScreen } from "@/components/HomeScreen";
import { GameScreen } from "@/components/GameScreen";
import { LeaderboardScreen } from "@/components/LeaderboardScreen";
import type { GameMode, ViewTime } from "@/lib/types";

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

  const handleStart = useCallback(
    (playerName: string, mode: GameMode, viewTime: ViewTime) => {
      dispatch({ type: "START_GAME", playerName, mode, viewTime });
    },
    []
  );

  const handleTileClick = useCallback((index: number) => {
    dispatch({ type: "CLICK_TILE", index });
  }, []);

  const handleHideTiles = useCallback(() => {
    dispatch({ type: "HIDE_TILES" });
  }, []);

  const handleNextRound = useCallback(() => {
    dispatch({ type: "NEXT_ROUND" });
  }, []);

  const handleLifeLost = useCallback(() => {
    dispatch({ type: "LIFE_LOST" });
  }, []);

  const handleGameOver = useCallback(() => {
    const s = stateRef.current;
    latestScoreRef.current = { level: s.bestLevel, tiles: s.tiles };

    saveScore(s.playerName, s.bestLevel, s.tiles, s.mode, s.viewTime);

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
        onHideTiles={handleHideTiles}
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
