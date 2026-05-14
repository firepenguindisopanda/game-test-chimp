import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY in .env"
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface ScoreRow {
  id: string;
  player_name: string;
  best_level: number;
  tiles_count: number;
  mode: string;
  view_time: number | null;
  played_at: string;
}

export async function saveScore(
  playerName: string,
  bestLevel: number,
  tilesCount: number,
  mode: string = "beginner",
  viewTime: number | null = null
): Promise<void> {
  try {
    const { error } = await supabase.from("scores").insert({
      player_name: playerName,
      best_level: bestLevel,
      tiles_count: tilesCount,
      mode,
      view_time: viewTime,
    });
    if (error) throw error;
  } catch (error) {
    console.error("Failed to save score:", error);
  }
}

export async function fetchLeaderboard(
  limit = 50,
  mode?: string
): Promise<ScoreRow[]> {
  try {
    let query = supabase
      .from("scores")
      .select("*")
      .order("best_level", { ascending: false })
      .order("tiles_count", { ascending: false })
      .limit(limit);

    if (mode) {
      query = query.eq("mode", mode);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data ?? [];
  } catch (error) {
    console.error("Failed to fetch leaderboard:", error);
    return [];
  }
}

export async function fetchPlayerScores(
  playerName: string
): Promise<ScoreRow[]> {
  try {
    const { data, error } = await supabase
      .from("scores")
      .select("*")
      .eq("player_name", playerName)
      .order("played_at", { ascending: false })
      .limit(20);

    if (error) throw error;
    return data ?? [];
  } catch (error) {
    console.error("Failed to fetch player scores:", error);
    return [];
  }
}
