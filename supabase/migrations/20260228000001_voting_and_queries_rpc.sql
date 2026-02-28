-- Phase 2 Voting RPC and Query

CREATE OR REPLACE FUNCTION cast_vote(p_id BIGINT, v_type INT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id UUID;
    v_previous_vote INT;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    IF v_type NOT IN (1, 0, -1) THEN
        RAISE EXCEPTION 'Invalid vote type';
    END IF;

    -- Get previous vote
    SELECT vote_type INTO v_previous_vote
    FROM votes
    WHERE user_id = v_user_id AND project_id = p_id;

    -- Update votes table
    IF v_type = 0 THEN
        DELETE FROM votes WHERE user_id = v_user_id AND project_id = p_id;
    ELSE
        INSERT INTO votes (user_id, project_id, vote_type)
        VALUES (v_user_id, p_id, v_type)
        ON CONFLICT (user_id, project_id) 
        DO UPDATE SET vote_type = EXCLUDED.vote_type;
    END IF;

    -- Update metrics table
    -- Recalculate based on previous vote
    UPDATE metrics
    SET 
        upvotes = upvotes 
                  - CASE WHEN v_previous_vote = 1 THEN 1 ELSE 0 END 
                  + CASE WHEN v_type = 1 THEN 1 ELSE 0 END,
        downvotes = downvotes 
                    - CASE WHEN v_previous_vote = -1 THEN 1 ELSE 0 END
                    + CASE WHEN v_type = -1 THEN 1 ELSE 0 END,
        hot_score = hot_score 
                    - COALESCE(v_previous_vote, 0)
                    + v_type
    WHERE project_id = p_id;

END;
$$;


CREATE OR REPLACE FUNCTION get_projects(
  p_sort TEXT DEFAULT 'hot',
  p_category TEXT DEFAULT NULL,
  p_platform TEXT DEFAULT NULL,
  p_genre TEXT DEFAULT NULL,
  p_os TEXT DEFAULT NULL
)
RETURNS TABLE (
  id BIGINT,
  title TEXT,
  developer_name TEXT,
  category TEXT,
  genre TEXT,
  type TEXT,
  platforms TEXT[],
  os TEXT[],
  "aiFeatures" TEXT[],
  description TEXT,
  price_model TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ,
  downloads_count BIGINT,
  upvotes BIGINT,
  downvotes BIGINT,
  score BIGINT,
  user_vote INT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.title,
    p.developer_name,
    p.category,
    p.genre,
    p.type,
    p.platforms,
    p.os,
    p.aiFeatures,
    p.description,
    p.price_model,
    p.image_url,
    p.created_at,
    COALESCE(m.downloads_count, 0),
    COALESCE(m.upvotes, 0),
    COALESCE(m.downvotes, 0),
    (COALESCE(m.upvotes, 0) - COALESCE(m.downvotes, 0)) AS score,
    COALESCE(v.vote_type, 0) AS user_vote
  FROM projects p
  LEFT JOIN metrics m ON m.project_id = p.id
  LEFT JOIN votes v ON v.project_id = p.id AND v.user_id = auth.uid()
  WHERE 
    (p_category IS NULL OR p.category = p_category) AND
    (p_platform IS NULL OR p_platform = ANY(p.platforms)) AND
    (p_genre IS NULL OR p.genre = p_genre) AND
    (p_os IS NULL OR p_os = ANY(p.os))
  ORDER BY 
    CASE WHEN p_sort = 'new' THEN (EXTRACT(EPOCH FROM p.created_at)) END DESC,
    CASE WHEN p_sort = 'top' THEN (COALESCE(m.upvotes, 0) - COALESCE(m.downvotes, 0)) END DESC,
    CASE WHEN p_sort = 'hot' OR p_sort NOT IN ('new', 'top') THEN 
      ((COALESCE(m.upvotes, 0) - COALESCE(m.downvotes, 0)) / POWER(EXTRACT(EPOCH FROM (NOW() - p.created_at)) / 3600.0 + 2, 1.5)) 
    END DESC;
END;
$$;
