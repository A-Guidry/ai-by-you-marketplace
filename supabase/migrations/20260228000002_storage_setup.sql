-- Phase 3 Storage Setup

INSERT INTO storage.buckets (id, name, public) 
VALUES ('thumbnails', 'thumbnails', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies
CREATE POLICY "Thumbnails are publicly accessible"
ON storage.objects FOR SELECT
USING ( bucket_id = 'thumbnails' );

CREATE POLICY "Users can upload their own thumbnails"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
    bucket_id = 'thumbnails' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own thumbnails"
ON storage.objects FOR UPDATE TO authenticated
USING (
    bucket_id = 'thumbnails' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own thumbnails"
ON storage.objects FOR DELETE TO authenticated
USING (
    bucket_id = 'thumbnails' AND
    auth.uid()::text = (storage.foldername(name))[1]
);
