-- Create client_galleries table for private photo collections
CREATE TABLE public.client_galleries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create gallery_photos table
CREATE TABLE public.gallery_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gallery_id UUID REFERENCES public.client_galleries(id) ON DELETE CASCADE NOT NULL,
  photo_id UUID REFERENCES public.photos(id) ON DELETE CASCADE NOT NULL,
  is_downloadable BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create invoices table
CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL,
  invoice_number TEXT NOT NULL UNIQUE,
  amount NUMERIC NOT NULL,
  paid_amount NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'pending',
  due_date DATE,
  issued_date DATE DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create invoice_items table
CREATE TABLE public.invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE NOT NULL,
  description TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  unit_price NUMERIC NOT NULL,
  total NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create price_calculator_logs table (untuk menyimpan hasil kalkulasi)
CREATE TABLE public.price_calculator_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  service_type TEXT NOT NULL,
  selections JSONB NOT NULL,
  total_price NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create quiz_results table
CREATE TABLE public.quiz_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  answers JSONB NOT NULL,
  recommended_package TEXT NOT NULL,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.client_galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_calculator_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;

-- RLS Policies for client_galleries
CREATE POLICY "Users can view their own galleries"
  ON public.client_galleries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all galleries"
  ON public.client_galleries FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for gallery_photos
CREATE POLICY "Users can view photos in their galleries"
  ON public.gallery_photos FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.client_galleries
      WHERE id = gallery_photos.gallery_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all gallery photos"
  ON public.gallery_photos FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for invoices
CREATE POLICY "Users can view their own invoices"
  ON public.invoices FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all invoices"
  ON public.invoices FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for invoice_items
CREATE POLICY "Users can view their invoice items"
  ON public.invoice_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.invoices
      WHERE id = invoice_items.invoice_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all invoice items"
  ON public.invoice_items FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for price_calculator_logs
CREATE POLICY "Users can view their own calculator logs"
  ON public.price_calculator_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can create calculator logs"
  ON public.price_calculator_logs FOR INSERT
  WITH CHECK (true);

-- RLS Policies for quiz_results
CREATE POLICY "Users can view their own quiz results"
  ON public.quiz_results FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can create quiz results"
  ON public.quiz_results FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all quiz results"
  ON public.quiz_results FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create triggers for updated_at
CREATE TRIGGER update_client_galleries_updated_at
  BEFORE UPDATE ON public.client_galleries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON public.invoices
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();