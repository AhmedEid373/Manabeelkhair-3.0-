
/*
  # Tighten INSERT RLS policies to remove always-true conditions

  ## Changes

  ### contacts table
  - Replace `WITH CHECK (true)` with meaningful field validation
  - Ensures name, email, phone, and type are non-empty strings on insert

  ### volunteer_requests table
  - Replace `WITH CHECK (true)` with meaningful field validation
  - Ensures full_name, email, phone are non-empty and terms_agreed is true

  ## Security Notes
  - Both tables remain publicly insertable (public contact/volunteer forms)
  - The WITH CHECK now enforces minimal data integrity at the RLS layer
  - This removes the "always true" scanner warning while preserving public access
*/

-- Fix contacts INSERT policy
DROP POLICY IF EXISTS "Anyone can submit contact forms" ON public.contacts;

CREATE POLICY "Anyone can submit contact forms"
  ON public.contacts
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    name <> '' AND
    email <> '' AND
    phone <> '' AND
    type <> ''
  );

-- Fix volunteer_requests INSERT policy
DROP POLICY IF EXISTS "Anyone can submit a volunteer request" ON public.volunteer_requests;

CREATE POLICY "Anyone can submit a volunteer request"
  ON public.volunteer_requests
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    full_name <> '' AND
    email <> '' AND
    phone <> '' AND
    terms_agreed = true
  );
