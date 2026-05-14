import { type FormEvent, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface HomeScreenProps {
  onStart: (playerName: string) => void;
  onLeaderboard: () => void;
}

export function HomeScreen({ onStart, onLeaderboard }: HomeScreenProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const name = inputRef.current?.value.trim();
    if (!name) {
      inputRef.current?.focus();
      return;
    }
    onStart(name);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-4">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur shadow-2xl border-0">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-3xl font-bold text-slate-800">
            Chimp Test
          </CardTitle>
          <CardDescription className="text-slate-500 text-base mt-2">
            Can you remember which square had which number?
            <br />
            Click tiles in order 1 → N. Numbers hide on your first click.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
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
