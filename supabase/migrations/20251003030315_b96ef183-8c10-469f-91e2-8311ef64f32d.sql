-- Create testimonials table for social proof
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  client_role TEXT NOT NULL,
  client_photo_url TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  service_type TEXT NOT NULL,
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Anyone can view testimonials
CREATE POLICY "Anyone can view testimonials"
ON public.testimonials
FOR SELECT
USING (true);

-- Only admins can manage testimonials
CREATE POLICY "Admins can manage testimonials"
ON public.testimonials
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_testimonials_updated_at
BEFORE UPDATE ON public.testimonials
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample testimonials
INSERT INTO public.testimonials (client_name, client_role, rating, review_text, service_type, is_featured, display_order) VALUES
('Dimas Prasetyo', 'Groom - Wedding Client', 5, 'Hasilnya luar biasa! Foto wedding kami di Candi Prambanan jadi memorable banget. Atha Studio sangat profesional dan detail oriented.', 'Wedding Photography', true, 1),
('Sarah Wijaya', 'Owner - Warung Kopi Sarah', 5, 'Website yang dibuat untuk warung kopi saya keren banget! Sekarang orderan online meningkat 300%. Highly recommended!', 'Website Development', true, 2),
('Budi Santoso', 'Fresh Graduate', 5, 'Foto wisuda saya jadi kece abis! Hasilnya natural dan artistik. Terima kasih Atha Studio!', 'Graduation Photography', false, 3),
('Anisa Rahman', 'Bride - Wedding Client', 5, 'Pelayanan ramah, hasil memuaskan. Foto prewedding kami di Jogja sangat artistik dan natural. Love it!', 'Pre-Wedding Photography', true, 4);