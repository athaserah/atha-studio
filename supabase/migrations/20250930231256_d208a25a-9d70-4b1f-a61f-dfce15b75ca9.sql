-- Add interaction stats columns to photos table
ALTER TABLE public.photos 
ADD COLUMN IF NOT EXISTS likes_count integer DEFAULT 0 NOT NULL,
ADD COLUMN IF NOT EXISTS downloads_count integer DEFAULT 0 NOT NULL,
ADD COLUMN IF NOT EXISTS shares_count integer DEFAULT 0 NOT NULL;

-- Create function to safely increment photo stats
CREATE OR REPLACE FUNCTION public.increment_photo_stat(
  photo_id uuid,
  stat_type text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF stat_type = 'likes' THEN
    UPDATE public.photos 
    SET likes_count = likes_count + 1, updated_at = now()
    WHERE id = photo_id;
  ELSIF stat_type = 'downloads' THEN
    UPDATE public.photos 
    SET downloads_count = downloads_count + 1, updated_at = now()
    WHERE id = photo_id;
  ELSIF stat_type = 'shares' THEN
    UPDATE public.photos 
    SET shares_count = shares_count + 1, updated_at = now()
    WHERE id = photo_id;
  END IF;
END;
$$;