-- Create hero_stats table for managing hero section statistics
CREATE TABLE IF NOT EXISTS public.hero_stats (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  icon_name text NOT NULL,
  value text NOT NULL,
  label text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.hero_stats ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view hero stats" 
ON public.hero_stats 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage hero stats" 
ON public.hero_stats 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_hero_stats_updated_at
  BEFORE UPDATE ON public.hero_stats
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default hero stats data
INSERT INTO public.hero_stats (icon_name, value, label, sort_order) VALUES
  ('Camera', '500+', 'Foto Udah Diabadiin', 1),
  ('Users', '200+', 'Client Bahagia', 2),
  ('Award', '50+', 'Penghargaan Diraih', 3),
  ('Star', '4.9/5', 'Rating Kepuasan', 4);