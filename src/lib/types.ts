export type Screen = "home" | "playing" | "leaderboard";
export type GameMode = "beginner" | "advanced" | "super_advanced";
export type ViewTime = 3 | 5 | 7;

export type TileState = "hidden" | "visible" | "correct" | "wrong" | "empty";

export interface TileData {
  index: number;
  number: number | null;
  state: TileState;
}

export interface GameState {
  screen: Screen;
  playerName: string;
  mode: GameMode;
  viewTime: ViewTime;
  level: number;
  tiles: number;
  lives: number;
  grid: TileData[];
  sequence: number[];
  nextClick: number;
  revealed: boolean;
  bestLevel: number;
  message: string;
  messageType: "success" | "fail" | "";
}

export type GameAction =
  | { type: "START_GAME"; playerName: string; mode: GameMode; viewTime: ViewTime }
  | { type: "CLICK_TILE"; index: number }
  | { type: "HIDE_TILES" }
  | { type: "NEXT_ROUND" }
  | { type: "LIFE_LOST" }
  | { type: "GAME_OVER" }
  | { type: "GO_HOME" }
  | { type: "GO_LEADERBOARD" }
  | { type: "CLEAR_MESSAGE" };
