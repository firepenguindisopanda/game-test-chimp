import type { GameState, GameAction, TileData, GameMode } from "./types";

const GRID_COLS = 6;
const GRID_ROWS = 6;
const TOTAL_CELLS = GRID_COLS * GRID_ROWS;
const START_TILES = 4;
const MAX_LIVES = 3;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildGridSuperAdvanced(tileCount: number): { numbers: number[] } {
  const numbers: number[] = [];
  let current = Math.floor(Math.random() * 3) + 1; // start: 1, 2, or 3
  numbers.push(current);
  for (let i = 1; i < tileCount; i++) {
    const gap = Math.floor(Math.random() * 6) + 1; // gap: 1–6
    current += gap;
    numbers.push(current);
  }
  return { numbers };
}

function buildGrid(tileCount: number, mode: GameMode): {
  grid: TileData[];
  sequence: number[];
} {
  const allCells = Array.from({ length: TOTAL_CELLS }, (_, i) => i);
  const chosen = shuffle(allCells).slice(0, tileCount);

  let labels: number[];
  if (mode === "super_advanced") {
    const { numbers } = buildGridSuperAdvanced(tileCount);
    labels = numbers;
  } else {
    labels = Array.from({ length: tileCount }, (_, i) => i + 1);
  }

  const labelOrder = [...labels].sort((a, b) => a - b);

  const grid: TileData[] = Array.from({ length: TOTAL_CELLS }, (_, i) => {
    const numIndex = chosen.indexOf(i);
    return {
      index: i,
      number: numIndex !== -1 ? labels[numIndex] : null,
      state: numIndex !== -1 ? "visible" : "empty",
    };
  });

  return { grid, sequence: labelOrder };
}

export function createInitialState(): GameState {
  const { grid, sequence } = buildGrid(START_TILES, "beginner");
  return {
    screen: "home",
    playerName: "",
    mode: "beginner",
    viewTime: 3,
    level: 1,
    tiles: START_TILES,
    lives: MAX_LIVES,
    grid,
    sequence,
    nextClick: 1,
    revealed: true,
    bestLevel: 1,
    message: "",
    messageType: "",
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "START_GAME": {
      const { grid, sequence } = buildGrid(START_TILES, action.mode);
      return {
        ...createInitialState(),
        screen: "playing",
        playerName: action.playerName,
        mode: action.mode,
        viewTime: action.viewTime,
        grid,
        sequence,
      };
    }

    case "HIDE_TILES": {
      return {
        ...state,
        revealed: false,
        grid: state.grid.map((t) =>
          t.state === "visible" ? { ...t, state: "hidden" as const } : t
        ),
      };
    }

    case "CLICK_TILE": {
      if (state.lives <= 0) return state;
      const tile = state.grid[action.index];
      // Allow clicking hidden tiles (played from memory); only block empty/resolved tiles
      if (!tile.number || tile.state === "correct" || tile.state === "wrong") return state;

      let revealed = state.revealed;
      let grid = state.grid;
      if (revealed && state.nextClick === 1) {
        revealed = false;
        grid = state.grid.map((t) =>
          t.number !== null ? { ...t, state: "hidden" as const } : t
        );
      }

      if (tile.number === state.nextClick) {
        grid = grid.map((t) =>
          t.index === action.index ? { ...t, state: "correct" as const } : t
        );
        const nextClick = state.nextClick + 1;

        if (nextClick > state.tiles) {
          return {
            ...state,
            grid,
            nextClick,
            revealed: true,
            message: `Level ${state.level} cleared!`,
            messageType: "success",
          };
        }

        return {
          ...state,
          grid,
          nextClick,
          revealed,
          message: "",
          messageType: "",
        };
      } else {
        grid = grid.map((t) =>
          t.index === action.index ? { ...t, state: "wrong" as const } : t
        );
        const lives = state.lives - 1;
        const message = `Wrong! ${lives} ${lives === 1 ? "life" : "lives"} left`;
        return {
          ...state,
          grid,
          lives,
          message,
          messageType: "fail",
        };
      }
    }

    case "NEXT_ROUND": {
      const newLevel = state.level + 1;
      const newTiles = state.tiles + 1;
      const { grid, sequence } = buildGrid(newTiles, state.mode);
      return {
        ...state,
        level: newLevel,
        tiles: newTiles,
        bestLevel: Math.max(state.bestLevel, state.level),
        grid,
        sequence,
        nextClick: 1,
        revealed: true,
        message: "",
        messageType: "",
      };
    }

    case "LIFE_LOST": {
      // If game is already over, don't rebuild (prevents timer interference)
      if (state.lives <= 0) return state;
      // Generate a completely new random pattern at the same difficulty
      const { grid, sequence } = buildGrid(state.tiles, state.mode);
      return {
        ...state,
        grid,
        sequence,
        nextClick: 1,
        revealed: true,
        message: "",
        messageType: "",
      };
    }

    case "GAME_OVER": {
      return {
        ...state,
        screen: "leaderboard",
        message: `Game over! Best Level: ${state.bestLevel}`,
        messageType: "fail",
      };
    }

    case "GO_HOME":
      return { ...createInitialState() };

    case "GO_LEADERBOARD":
      return { ...state, screen: "leaderboard" };

    case "CLEAR_MESSAGE":
      return { ...state, message: "", messageType: "" };

    default:
      return state;
  }
}
