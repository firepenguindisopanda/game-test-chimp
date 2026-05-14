import { type TileState } from "@/lib/types";
import { cn } from "@/lib/utils";

interface TileProps {
  number: number | null;
  state: TileState;
  onClick: () => void;
}

const stateStyles: Record<TileState, string> = {
  visible:
    "bg-[#378ADD] text-white border-transparent hover:scale-105 cursor-pointer",
  hidden:
    "bg-gray-200 text-transparent border-gray-300 cursor-pointer hover:scale-105",
  correct: "bg-green-600 text-white border-transparent",
  wrong: "bg-red-500 text-white border-transparent animate-[shake_0.3s_ease]",
  empty: "bg-transparent border-transparent cursor-default pointer-events-none",
};

export function Tile({ number, state, onClick }: TileProps) {
  return (
    <button
      onClick={onClick}
      disabled={state === "empty" || state === "correct" || state === "wrong"}
      className={cn(
        "aspect-square rounded-lg flex items-center justify-center",
        "text-lg font-semibold select-none",
        "border transition-all duration-100",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500",
        stateStyles[state]
      )}
      aria-label={
        state === "hidden"
          ? "Hidden tile"
          : number
            ? `Tile number ${number}`
            : "Empty tile"
      }
    >
      {number && (state === "visible" || state === "correct" || state === "wrong")
        ? number
        : ""}
    </button>
  );
}
