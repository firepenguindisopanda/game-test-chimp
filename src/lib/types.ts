export type Screen = "home" | "playing" | "leaderboard";

export type TileState = "hidden" | "visible" | "correct" | "wrong" | "empty";

export interface TileData {
  index: number;
  number: number | null;
  state: TileState;
}

export interface GameState {
  screen: Screen;
  playerName: string;
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
  | { type: "START_GAME"; playerName: string }
  | { type: "CLICK_TILE"; index: number }
  | { type: "NEXT_ROUND" }
  | { type: "LIFE_LOST" }
  | { type: "GAME_OVER" }
  | { type: "GO_HOME" }
  | { type: "GO_LEADERBOARD" }
  | { type: "CLEAR_MESSAGE" };
