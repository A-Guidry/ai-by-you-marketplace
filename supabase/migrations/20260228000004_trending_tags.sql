-- Drop old function
DROP FUNCTION IF EXISTS get_projects(TEXT, TEXT, TEXT, TEXT, TEXT);

-- Recreate function with p_feature and elo_score
CREATE OR REPLACE FUNCTION get_projects(
  p_sort TEXT DEFAULT 'hot',
  p_category TEXT DEFAULT NULL,
  p_platform TEXT DEFAULT NULL,
  p_genre TEXT DEFAULT NULL,
  p_os TEXT DEFAULT NULL,
  p_feature TEXT DEFAULT NULL
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
  user_vote INT,
  elo_score FLOAT
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
    p."aiFeatures",
    p.description,
    p.price_model,
    p.image_url,
    p.created_at,
    COALESCE(m.downloads_count, 0),
    COALESCE(m.upvotes, 0),
    COALESCE(m.downvotes, 0),
    (COALESCE(m.upvotes, 0) - COALESCE(m.downvotes, 0)) AS score,
    COALESCE(v.vote_type, 0) AS user_vote,
    p.elo_score
  FROM projects p
  LEFT JOIN metrics m ON m.project_id = p.id
  LEFT JOIN votes v ON v.project_id = p.id AND v.user_id = auth.uid()
  WHERE 
    (p_category IS NULL OR p.category = p_category) AND
    (p_platform IS NULL OR p_platform = ANY(p.platforms)) AND
    (p_genre IS NULL OR p.genre = p_genre) AND
    (p_os IS NULL OR p_os = ANY(p.os)) AND
    (p_feature IS NULL OR p_feature = ANY(p."aiFeatures"))
  ORDER BY 
    CASE WHEN p_sort = 'new' THEN (EXTRACT(EPOCH FROM p.created_at)) END DESC,
    CASE WHEN p_sort = 'top' THEN (COALESCE(m.upvotes, 0) - COALESCE(m.downvotes, 0)) END DESC,
    CASE WHEN p_sort = 'arena' THEN p.elo_score END DESC,
    CASE WHEN p_sort = 'hot' OR p_sort NOT IN ('new', 'top', 'arena') THEN 
      ((COALESCE(m.upvotes, 0) - COALESCE(m.downvotes, 0)) / POWER(EXTRACT(EPOCH FROM (NOW() - p.created_at)) / 3600.0 + 2, 1.5)) 
    END DESC;
END;
$$;


CREATE OR REPLACE FUNCTION get_trending_tags()
RETURNS TABLE (
    feature TEXT,
    usage_count BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT unnest("aiFeatures") AS feature, COUNT(*) AS usage_count
    FROM projects
    WHERE created_at >= NOW() - INTERVAL '30 days'
    GROUP BY feature
    ORDER BY usage_count DESC
    LIMIT 6;
END;
$$;
