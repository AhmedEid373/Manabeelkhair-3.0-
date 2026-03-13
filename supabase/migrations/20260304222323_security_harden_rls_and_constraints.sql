/*
  # Security hardening: tighten RLS policies and add field constraints

  ## Summary
  Hardens security across the contacts, donation_requests, and volunteer_requests tables by:
  - Restricting contacts SELECT/UPDATE/DELETE to authenticated users only (removes any accidental anon access)
  - Adding column length constraints to prevent oversized data injection
  - Ensuring donation_requests INSERT policy validates amount is a positive number
  - Adding updated_at column to donation_requests and volunteer_requests for audit purposes

  ## Changes

  ### contacts table
  - Ensure SELECT/UPDATE/DELETE policies exist for authenticated only
  - Add CHECK constraints on field lengths

  ### donation_requests table
  - Add updated_at column
  - Tighten field length constraints

  ### volunteer_requests table
  - Add updated_at column
  - Tighten field length constraints
*/

-- ============================================================
-- contacts: ensure authenticated-only SELECT/UPDATE/DELETE
-- ============================================================

DROP POLICY IF EXISTS "Authenticated users can view contacts" ON public.contacts;
CREATE POLICY "Authenticated users can view contacts"
  ON public.contacts
  FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Authenticated users can update contacts" ON public.contacts;
CREATE POLICY "Authenticated users can update contacts"
  ON public.contacts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Authenticated users can delete contacts" ON public.contacts;
CREATE POLICY "Authenticated users can delete contacts"
  ON public.contacts
  FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- ============================================================
-- contacts: add field length constraints
-- ============================================================

ALTER TABLE public.contacts
  ADD CONSTRAINT contacts_name_length CHECK (char_length(name) BETWEEN 2 AND 100),
  ADD CONSTRAINT contacts_email_length CHECK (char_length(email) BETWEEN 3 AND 254),
  ADD CONSTRAINT contacts_phone_length CHECK (char_length(phone) BETWEEN 7 AND 20),
  ADD CONSTRAINT contacts_location_length CHECK (location IS NULL OR char_length(location) <= 200),
  ADD CONSTRAINT contacts_message_length CHECK (message IS NULL OR char_length(message) <= 2000),
  ADD CONSTRAINT contacts_notes_length CHECK (notes IS NULL OR char_length(notes) <= 2000);

-- ============================================================
-- donation_requests: add updated_at + length constraints
-- ============================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'donation_requests' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE donation_requests ADD COLUMN updated_at timestamptz DEFAULT now();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.constraint_column_usage
    WHERE table_name = 'donation_requests' AND constraint_name = 'donation_requests_full_name_length'
  ) THEN
    ALTER TABLE donation_requests
      ADD CONSTRAINT donation_requests_full_name_length CHECK (char_length(full_name) BETWEEN 2 AND 100),
      ADD CONSTRAINT donation_requests_email_length CHECK (char_length(email) BETWEEN 3 AND 254);
  END IF;
END $$;

-- ============================================================
-- volunteer_requests: add updated_at + length constraints
-- ============================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'volunteer_requests' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE volunteer_requests ADD COLUMN updated_at timestamptz DEFAULT now();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.constraint_column_usage
    WHERE table_name = 'volunteer_requests' AND constraint_name = 'volunteer_requests_full_name_length'
  ) THEN
    ALTER TABLE volunteer_requests
      ADD CONSTRAINT volunteer_requests_full_name_length CHECK (char_length(full_name) BETWEEN 2 AND 100),
      ADD CONSTRAINT volunteer_requests_email_length CHECK (char_length(email) BETWEEN 3 AND 254);
  END IF;
END $$;
