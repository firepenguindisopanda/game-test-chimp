-- Create scores table
CREATE TABLE public.scores (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_name TEXT NOT NULL,
  best_level  INTEGER NOT NULL,
  tiles_count INTEGER NOT NULL,
  played_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit a score (no auth required)
CREATE POLICY "Anyone can insert scores" ON public.scores
  FOR INSERT WITH CHECK (true);

-- Allow anyone to read scores for the leaderboard
CREATE POLICY "Anyone can read scores" ON public.scores
  FOR SELECT USING (true);
