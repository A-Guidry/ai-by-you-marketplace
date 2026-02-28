-- Phase 1 Initial Schema

CREATE TABLE projects (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  developer_id UUID REFERENCES auth.users(id),
  developer_name TEXT NOT NULL,
  category TEXT NOT NULL,
  genre TEXT NOT NULL,
  type TEXT NOT NULL,
  platforms TEXT[] NOT NULL DEFAULT '{}',
  os TEXT[] NOT NULL DEFAULT '{}',
  aiFeatures TEXT[] NOT NULL DEFAULT '{}',
  description TEXT NOT NULL,
  price_model TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE metrics (
  project_id BIGINT PRIMARY KEY REFERENCES projects(id) ON DELETE CASCADE,
  downloads_count BIGINT NOT NULL DEFAULT 0,
  upvotes BIGINT NOT NULL DEFAULT 0,
  downvotes BIGINT NOT NULL DEFAULT 0,
  hot_score BIGINT NOT NULL DEFAULT 0
);

CREATE TABLE votes (
  user_id UUID NOT NULL REFERENCES auth.users(id),
  project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  vote_type INT NOT NULL CHECK (vote_type IN (1, -1)),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, project_id)
);

-- RLS Setup
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Projects are visible to everyone" ON projects FOR SELECT USING (true);
CREATE POLICY "Only authenticated users can insert projects" ON projects FOR INSERT TO authenticated WITH CHECK (developer_id = auth.uid());
CREATE POLICY "Metrics are visible to everyone" ON metrics FOR SELECT USING (true);
CREATE POLICY "Users can see their own votes" ON votes FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert their own votes" ON votes FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update their own votes" ON votes FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can delete their own votes" ON votes FOR DELETE TO authenticated USING (user_id = auth.uid());

-- Initial Mock Data Set (For MVP)
INSERT INTO projects (id, title, developer_name, category, genre, type, platforms, os, aiFeatures, description, price_model, image_url) VALUES 
(1, 'Neon Protocol: Awakened', 'Polymath Studios', 'Game', 'Action', 'AAA', ARRAY['PC'], ARRAY['Windows', 'macOS'], ARRAY['Agentic NPCs', 'Procedural Narrative'], 'A massive cyberpunk RPG where every NPC has an autonomous routine and long-term memory driven by a custom LLaMA-4 model.', '$59.99', 'bg-gradient-to-br from-purple-600 to-blue-900'),
(2, 'Pocket Romantic Agent', 'Loneliness Econ Apps', 'Game', 'Simulation', 'Mobile', ARRAY['Mobile'], ARRAY['iOS', 'Android'], ARRAY['Memory-First AI', 'Emotional Voice Synthesis'], 'The #1 AI companion game. Form a deep emotional bond with an agent that remembers every conversation across thousands of sessions.', 'Free (IAP)', 'bg-gradient-to-br from-pink-500 to-rose-400'),
(3, 'AutoTax & Finance LAM', 'FinTech AI', 'App', 'Finance', 'Utility', ARRAY['PC', 'Web'], ARRAY['Windows', 'macOS', 'Web'], ARRAY['Large Action Model', 'Secure Local Exec'], 'A Large Action Model application that securely reads your financial documents and autonomously files your taxes. BYOK required for privacy.', 'Free + API Costs', 'bg-gradient-to-br from-emerald-700 to-slate-900'),
(4, 'Galactic Trade Syndicate', 'DePIN Gaming', 'Game', 'Simulation', 'Indie', ARRAY['PC'], ARRAY['Windows', 'Linux'], ARRAY['Decentralized Compute', 'LAM Economy'], 'A space trading simulator where the global economy is run by Large Action Models (LAMs) trading against each other in real-time.', '$14.99', 'bg-gradient-to-br from-emerald-600 to-teal-900'),
(5, 'NeuroDraft Pro', 'WriteTech AI', 'App', 'Productivity', 'Productivity', ARRAY['PC', 'Web'], ARRAY['macOS', 'Windows', 'Web'], ARRAY['Contextual Memory', 'Auto-Research'], 'The ultimate word processor. The AI reads your entire project folder and suggests edits, plots, and research notes in real-time.', '$9.99/mo', 'bg-gradient-to-br from-cyan-700 to-blue-900'),
(6, 'Local Detective: SLM Edition', 'PrivacyFirst Games', 'Game', 'Mystery', 'AA', ARRAY['PC'], ARRAY['Windows', 'Linux'], ARRAY['Local SLM', 'No Cloud Processing'], 'A noir detective game where you interrogate suspects by speaking into your mic. Runs entirely locally on an RTX 4000+ GPU using a Small Language Model.', '$19.99', 'bg-gradient-to-br from-slate-700 to-indigo-900');

INSERT INTO metrics (project_id, downloads_count, upvotes, downvotes, hot_score) VALUES
(1, 1250430, 15000, 500, 14500),
(2, 3400000, 9500, 600, 8900),
(3, 85000, 12500, 100, 12400),
(4, 42000, 3200, 100, 3100),
(5, 312000, 11000, 500, 10500),
(6, 210000, 10000, 200, 9800);

-- Update ID sequence
SELECT setval('projects_id_seq', (SELECT MAX(id) FROM projects));
