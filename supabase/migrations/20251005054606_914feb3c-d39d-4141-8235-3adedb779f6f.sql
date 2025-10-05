-- Create table for about page achievements
CREATE TABLE public.about_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  icon_name TEXT NOT NULL,
  value TEXT NOT NULL,
  label TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for about page skills
CREATE TABLE public.about_skills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  skill_name TEXT NOT NULL,
  percentage INTEGER NOT NULL CHECK (percentage >= 0 AND percentage <= 100),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for about page services
CREATE TABLE public.about_services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  specialties TEXT[] NOT NULL DEFAULT '{}',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for about page general content
CREATE TABLE public.about_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key TEXT NOT NULL UNIQUE,
  title TEXT,
  subtitle TEXT,
  description TEXT,
  button_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.about_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_content ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Anyone can view
CREATE POLICY "Anyone can view achievements" ON public.about_achievements FOR SELECT USING (true);
CREATE POLICY "Anyone can view skills" ON public.about_skills FOR SELECT USING (true);
CREATE POLICY "Anyone can view services" ON public.about_services FOR SELECT USING (true);
CREATE POLICY "Anyone can view content" ON public.about_content FOR SELECT USING (true);

-- RLS Policies - Only admins can manage
CREATE POLICY "Admins can manage achievements" ON public.about_achievements FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can manage skills" ON public.about_skills FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can manage services" ON public.about_services FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can manage content" ON public.about_content FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Add triggers for updated_at
CREATE TRIGGER update_about_achievements_updated_at BEFORE UPDATE ON public.about_achievements FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_about_skills_updated_at BEFORE UPDATE ON public.about_skills FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_about_services_updated_at BEFORE UPDATE ON public.about_services FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_about_content_updated_at BEFORE UPDATE ON public.about_content FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default data for achievements
INSERT INTO public.about_achievements (icon_name, value, label, sort_order) VALUES
  ('Users', '500+', 'Klien Puas', 1),
  ('Camera', '2000+', 'Momen Terabadikan', 2),
  ('Award', '15+', 'Penghargaan', 3),
  ('Star', '4.9/5', 'Rating', 4);

-- Insert default data for skills
INSERT INTO public.about_skills (skill_name, percentage, sort_order) VALUES
  ('Fotografi Wedding', 95, 1),
  ('Fotografi Produk', 90, 2),
  ('Editing & Retouching', 92, 3),
  ('Videografi', 85, 4);

-- Insert default data for services
INSERT INTO public.about_services (title, description, specialties, sort_order) VALUES
  ('Wedding Photography', 'Dokumentasi pernikahan dengan pendekatan candid dan artistic', ARRAY['Prewedding', 'Akad & Resepsi', 'Same Day Edit Video'], 1),
  ('Product Photography', 'Foto produk profesional untuk kebutuhan bisnis dan e-commerce', ARRAY['Catalog Shoot', 'Flat Lay', 'Lifestyle Product'], 2),
  ('Event Photography', 'Dokumentasi berbagai acara dengan hasil berkualitas tinggi', ARRAY['Corporate Event', 'Birthday Party', 'Conference'], 3);

-- Insert default data for content sections
INSERT INTO public.about_content (section_key, title, subtitle, description, button_text) VALUES
  ('hero', 'Tentang Atha Studio', 'Photographer Profesional', 'Dengan pengalaman lebih dari 5 tahun di industri fotografi, saya berdedikasi untuk mengabadikan momen-momen berharga Anda dengan sempurna. Setiap foto yang saya hasilkan adalah karya seni yang menceritakan kisah unik Anda.', NULL),
  ('cta', NULL, NULL, 'Siap untuk mengabadikan momen spesial Anda? Mari kita wujudkan foto impian Anda bersama!', 'Booking Sekarang');