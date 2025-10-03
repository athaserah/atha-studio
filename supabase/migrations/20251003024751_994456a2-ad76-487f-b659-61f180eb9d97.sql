-- Remove the redundant ALL policy that conflicts with specific policies
DROP POLICY IF EXISTS "Admins can manage all bookings" ON public.bookings;

-- Create specific admin policies for UPDATE and DELETE operations
CREATE POLICY "Admins can update all bookings"
ON public.bookings
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete all bookings"
ON public.bookings
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- The existing policies remain:
-- "Admins can view all bookings" (SELECT) - only admins can read
-- "Anyone can create bookings" (INSERT) - public can submit bookings