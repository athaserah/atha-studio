-- Add invoice-related fields to bookings table
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS invoice_number TEXT,
ADD COLUMN IF NOT EXISTS total_price DECIMAL(12, 2),
ADD COLUMN IF NOT EXISTS deposit_amount DECIMAL(12, 2),
ADD COLUMN IF NOT EXISTS deposit_paid BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS full_payment_paid BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS payment_method TEXT,
ADD COLUMN IF NOT EXISTS payment_notes TEXT,
ADD COLUMN IF NOT EXISTS invoice_date DATE,
ADD COLUMN IF NOT EXISTS due_date DATE,
ADD COLUMN IF NOT EXISTS admin_notes TEXT;

-- Create index for invoice_number for faster lookups
CREATE INDEX IF NOT EXISTS idx_bookings_invoice_number ON public.bookings(invoice_number);

-- Update status check constraint to include more statuses
ALTER TABLE public.bookings DROP CONSTRAINT IF EXISTS bookings_status_check;
ALTER TABLE public.bookings 
ADD CONSTRAINT bookings_status_check 
CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'invoiced', 'paid'));

-- Function to generate invoice number
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TEXT AS $$
DECLARE
  year_month TEXT;
  counter INTEGER;
  invoice_num TEXT;
BEGIN
  -- Format: INV-YYYYMM-XXXX
  year_month := TO_CHAR(CURRENT_DATE, 'YYYYMM');
  
  -- Get the count of invoices this month
  SELECT COUNT(*) + 1 INTO counter
  FROM public.bookings
  WHERE invoice_number LIKE 'INV-' || year_month || '%';
  
  -- Generate invoice number
  invoice_num := 'INV-' || year_month || '-' || LPAD(counter::TEXT, 4, '0');
  
  RETURN invoice_num;
END;
$$ LANGUAGE plpgsql;
