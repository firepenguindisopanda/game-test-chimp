import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  fetchLeaderboard,
  fetchPlayerScores,
  type ScoreRow,
} from "@/lib/supabase";

interface LeaderboardScreenProps {
  playerName: string;
  onHome: () => void;
  latestScore?: { level: number; tiles: number };
}

export function LeaderboardScreen({
  playerName,
  onHome,
  latestScore,
}: LeaderboardScreenProps) {
  const [globalScores, setGlobalScores] = useState<ScoreRow[]>([]);
  const [personalScores, setPersonalScores] = useState<ScoreRow[]>([]);
  const [loading, setLoading] = useState(true);

  const loadScores = useCallback(async () => {
    setLoading(true);
    const [global, personal] = await Promise.all([
      fetchLeaderboard(),
      playerName ? fetchPlayerScores(playerName) : Promise.resolve([]),
    ]);
    setGlobalScores(global);
    setPersonalScores(personal);
    setLoading(false);
  }, [playerName]);

  useEffect(() => {
    loadScores();
  }, [loadScores]);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-4 sm:p-8">
      <h2 className="text-2xl font-bold text-white mb-2">Leaderboard</h2>

      {latestScore && (
        <div className="text-blue-300 mb-4 text-sm">
          Your last game: Level {latestScore.level} · {latestScore.tiles} tiles
        </div>
      )}

      <Tabs defaultValue="global" className="w-full max-w-[520px]">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="global">Global</TabsTrigger>
          <TabsTrigger value="personal">My Scores</TabsTrigger>
        </TabsList>

        <TabsContent value="global">
          {loading ? (
            <p className="text-slate-400 text-center py-8">Loading...</p>
          ) : globalScores.length === 0 ? (
            <p className="text-slate-400 text-center py-8">
              No scores yet — be the first!
            </p>
          ) : (
            <div className="rounded-lg border border-white/10 overflow-hidden bg-white/5 backdrop-blur">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead className="text-blue-300 w-12">#</TableHead>
                    <TableHead className="text-blue-300">Name</TableHead>
                    <TableHead className="text-blue-300 text-right">Level</TableHead>
                    <TableHead className="text-blue-300 text-right">Tiles</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {globalScores.map((score, i) => (
                    <TableRow key={score.id} className="border-white/10 hover:bg-white/5">
                      <TableCell
                        className={
                          i === 0
                            ? "text-yellow-400 font-bold"
                            : i === 1
                              ? "text-gray-300 font-semibold"
                              : i === 2
                                ? "text-amber-600 font-medium"
                                : "text-white"
                        }
                      >
                        {i + 1}
                      </TableCell>
                      <TableCell className="text-white font-medium">
                        {escapeHtml(score.player_name)}
                      </TableCell>
                      <TableCell className="text-white text-right">
                        {score.best_level}
                      </TableCell>
                      <TableCell className="text-white text-right">
                        {score.tiles_count}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="personal">
          {loading ? (
            <p className="text-slate-400 text-center py-8">Loading...</p>
          ) : !playerName ? (
            <p className="text-slate-400 text-center py-8">
              Play a game first to see your scores.
            </p>
          ) : personalScores.length === 0 ? (
            <p className="text-slate-400 text-center py-8">
              No scores yet for {escapeHtml(playerName)}.
            </p>
          ) : (
            <div className="rounded-lg border border-white/10 overflow-hidden bg-white/5 backdrop-blur">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead className="text-blue-300">Date</TableHead>
                    <TableHead className="text-blue-300 text-right">Level</TableHead>
                    <TableHead className="text-blue-300 text-right">Tiles</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {personalScores.map((score) => (
                    <TableRow key={score.id} className="border-white/10 hover:bg-white/5">
                      <TableCell className="text-white">
                        {new Date(score.played_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-white text-right">
                        {score.best_level}
                      </TableCell>
                      <TableCell className="text-white text-right">
                        {score.tiles_count}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Button
        variant="outline"
        onClick={onHome}
        className="mt-6 text-white border-white/30 hover:bg-white/10"
      >
        Back to Home
      </Button>
    </div>
  );
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
