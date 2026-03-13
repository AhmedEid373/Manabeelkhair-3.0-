/*
  # Add admin update/delete policies for donations and volunteers, add missing columns

  ## Summary
  Adds UPDATE and DELETE policies so authenticated admins can manage donation and volunteer
  submissions from the dashboard. Also adds status/admin_notes columns to both tables.

  ## Changes
  - donation_requests: Add UPDATE and DELETE for authenticated users, add admin_notes column
  - volunteer_requests: Add UPDATE and DELETE for authenticated users, add status and admin_notes columns
*/

-- donation_requests: allow admin to update status/notes
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'donation_requests' AND policyname = 'Authenticated users can update donation requests'
  ) THEN
    CREATE POLICY "Authenticated users can update donation requests"
      ON donation_requests
      FOR UPDATE
      TO authenticated
      USING (auth.uid() IS NOT NULL)
      WITH CHECK (auth.uid() IS NOT NULL);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'donation_requests' AND policyname = 'Authenticated users can delete donation requests'
  ) THEN
    CREATE POLICY "Authenticated users can delete donation requests"
      ON donation_requests
      FOR DELETE
      TO authenticated
      USING (auth.uid() IS NOT NULL);
  END IF;
END $$;

-- volunteer_requests: allow admin to update/delete
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'volunteer_requests' AND policyname = 'Authenticated users can update volunteer requests'
  ) THEN
    CREATE POLICY "Authenticated users can update volunteer requests"
      ON volunteer_requests
      FOR UPDATE
      TO authenticated
      USING (auth.uid() IS NOT NULL)
      WITH CHECK (auth.uid() IS NOT NULL);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'volunteer_requests' AND policyname = 'Authenticated users can delete volunteer requests'
  ) THEN
    CREATE POLICY "Authenticated users can delete volunteer requests"
      ON volunteer_requests
      FOR DELETE
      TO authenticated
      USING (auth.uid() IS NOT NULL);
  END IF;
END $$;

-- Add admin_notes to donation_requests
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'donation_requests' AND column_name = 'admin_notes'
  ) THEN
    ALTER TABLE donation_requests ADD COLUMN admin_notes text DEFAULT '';
  END IF;
END $$;

-- Add status to volunteer_requests
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'volunteer_requests' AND column_name = 'status'
  ) THEN
    ALTER TABLE volunteer_requests ADD COLUMN status text NOT NULL DEFAULT 'pending';
  END IF;
END $$;

-- Add admin_notes to volunteer_requests
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'volunteer_requests' AND column_name = 'admin_notes'
  ) THEN
    ALTER TABLE volunteer_requests ADD COLUMN admin_notes text DEFAULT '';
  END IF;
END $$;
