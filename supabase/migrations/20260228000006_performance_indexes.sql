-- Phase 5.2 Performance Optimization: Indexing
-- Adding indexes to frequently filtered and sorted columns to ensure scalability

-- 1. Index for Categories and Genres
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_genre ON projects(genre);

-- 2. GIN Indexes for Array Filtering (Platforms, OS, AI Features)
CREATE INDEX IF NOT EXISTS idx_projects_platforms ON projects USING GIN(platforms);
CREATE INDEX IF NOT EXISTS idx_projects_os ON projects USING GIN(os);
CREATE INDEX IF NOT EXISTS idx_projects_ai_features ON projects USING GIN("aiFeatures");

-- 3. Indexes for Sorting (New Arrivals, Arena)
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_elo_score ON projects(elo_score DESC);

-- 4. Indexes for Metrics Table to speed up the JOIN and Hot/Top sorts
CREATE INDEX IF NOT EXISTS idx_metrics_project_id ON metrics(project_id);
CREATE INDEX IF NOT EXISTS idx_metrics_hot_score ON metrics(hot_score DESC);
-- Expressions index for (upvotes - downvotes) isn't straightforward without a generated column, 
-- but ensuring project_id is indexed helps the join significantly.

-- 5. Foreign Key indexing for Votes (already has a primary key which covers user_id and project_id, 
-- but an index on project_id helps when aggregating votes for a specific project)
CREATE INDEX IF NOT EXISTS idx_votes_project_id ON votes(project_id);
