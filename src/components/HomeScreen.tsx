import { type FormEvent, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { GameMode, ViewTime } from "@/lib/types";

interface HomeScreenProps {
  onStart: (playerName: string, mode: GameMode, viewTime: ViewTime) => void;
  onLeaderboard: () => void;
}

const modes: { id: GameMode; title: string; desc: string }[] = [
  { id: "beginner", title: "Beginner", desc: "Unlimited viewing time" },
  { id: "advanced", title: "Advanced", desc: "Timed memory challenge" },
  { id: "super_advanced", title: "Super Advanced", desc: "Timed + random numbers" },
];

const timeOptions: ViewTime[] = [3, 5, 7];
const timeLabels: Record<ViewTime, string> = { 3: "Fast (3s)", 5: "Medium (5s)", 7: "Slow (7s)" };

export function HomeScreen({ onStart, onLeaderboard }: HomeScreenProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedMode, setSelectedMode] = useState<GameMode>("beginner");
  const [selectedTime, setSelectedTime] = useState<ViewTime>(5);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const name = inputRef.current?.value.trim();
    if (!name) {
      inputRef.current?.focus();
      return;
    }
    onStart(name, selectedMode, selectedTime);
  };

  const needsTimePicker = selectedMode === "advanced" || selectedMode === "super_advanced";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-4">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur shadow-2xl border-0">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-3xl font-bold text-slate-800">
            Chimp Test
          </CardTitle>
          <CardDescription className="text-slate-500 text-base mt-2">
            Can you remember which square had which number?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
            {/* Mode selector */}
            <div className="grid grid-cols-3 gap-2 w-full">
              {modes.map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setSelectedMode(mode.id)}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-lg border-2 p-3 transition-all text-center",
                    selectedMode === mode.id
                      ? "border-blue-500 bg-blue-50 text-blue-800"
                      : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300"
                  )}
                >
                  <span className="font-semibold text-sm">{mode.title}</span>
                  <span className="text-xs leading-tight opacity-75">{mode.desc}</span>
                </button>
              ))}
            </div>

            {/* Time picker — only for timed modes */}
            {needsTimePicker && (
              <div className="flex gap-2 w-full justify-center">
                {timeOptions.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSelectedTime(t)}
                    className={cn(
                      "px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                      selectedTime === t
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    )}
                  >
                    {timeLabels[t]}
                  </button>
                ))}
              </div>
            )}

            <Input
              ref={inputRef}
              placeholder="Enter your name"
              maxLength={20}
              className="max-w-[220px] text-center"
              autoFocus
            />
            <Button type="submit" size="lg" className="w-full max-w-[220px]">
              Play
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onLeaderboard}
              className="mt-2"
            >
              View Leaderboard
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
