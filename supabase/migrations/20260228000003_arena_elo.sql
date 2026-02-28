-- Phase 4 Arena Data Models and Elo Logic

CREATE TABLE arena_votes (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    winner_project_id BIGINT REFERENCES projects(id) ON DELETE CASCADE,
    loser_project_id BIGINT REFERENCES projects(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE projects ADD COLUMN elo_score FLOAT NOT NULL DEFAULT 1000.0;

-- Simple Elo Update formula
CREATE OR REPLACE FUNCTION process_arena_vote(
    p_winner_id BIGINT,
    p_loser_id BIGINT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_winner_elo FLOAT;
    v_loser_elo FLOAT;
    v_expected_winner FLOAT;
    v_expected_loser FLOAT;
    v_k_factor FLOAT := 32.0; -- Standard K-factor
BEGIN
    -- Record the vote
    INSERT INTO arena_votes (user_id, winner_project_id, loser_project_id)
    VALUES (auth.uid(), p_winner_id, p_loser_id);

    -- Fetch current Elo
    SELECT elo_score INTO v_winner_elo FROM projects WHERE id = p_winner_id;
    SELECT elo_score INTO v_loser_elo FROM projects WHERE id = p_loser_id;

    -- Calculate expected scores
    v_expected_winner := 1.0 / (1.0 + POWER(10.0, (v_loser_elo - v_winner_elo) / 400.0));
    v_expected_loser := 1.0 / (1.0 + POWER(10.0, (v_winner_elo - v_loser_elo) / 400.0));

    -- Update Elos
    UPDATE projects 
    SET elo_score = v_winner_elo + v_k_factor * (1.0 - v_expected_winner)
    WHERE id = p_winner_id;

    UPDATE projects 
    SET elo_score = v_loser_elo + v_k_factor * (0.0 - v_expected_loser)
    WHERE id = p_loser_id;

END;
$$;

-- Function to get 2 random uncompared projects for the user
CREATE OR REPLACE FUNCTION get_arena_matchup()
RETURNS TABLE (
    id BIGINT,
    title TEXT,
    developer_name TEXT,
    image_url TEXT,
    category TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT p.id, p.title, p.developer_name, p.image_url, p.category
    FROM projects p
    WHERE p.id NOT IN (
        -- Exclude projects the user has already voted on against EACH OTHER
        -- For simplicity in MVP: exclude projects they have voted on recently.
        SELECT winner_project_id FROM arena_votes WHERE user_id = auth.uid()
        UNION
        SELECT loser_project_id FROM arena_votes WHERE user_id = auth.uid()
    )
    ORDER BY RANDOM()
    LIMIT 2;

    -- Fallback: if we didn't get 2, just get any 2 random ones
    IF NOT FOUND OR (SELECT COUNT(*) FROM get_arena_matchup) < 2 THEN
        RETURN QUERY SELECT p.id, p.title, p.developer_name, p.image_url, p.category FROM projects p ORDER BY RANDOM() LIMIT 2;
    END IF;
END;
$$;

-- RLS setup
ALTER TABLE arena_votes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can see their own arena votes" ON arena_votes FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert their own arena votes" ON arena_votes FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
