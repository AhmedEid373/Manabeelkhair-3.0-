/*
  # Create volunteer_requests table

  ## Summary
  Creates a table to store volunteer registration submissions from the volunteer page.

  ## New Tables
  - `volunteer_requests`
    - `id` (uuid, primary key)
    - `full_name` (text) - Full name of the volunteer
    - `age` (text) - Age of the volunteer
    - `email` (text) - Email address
    - `phone` (text) - Phone number
    - `region` (text) - Region / governorate
    - `skills` (text) - Skills and prior experience
    - `availability` (text) - Available days/hours
    - `volunteer_type` (text) - Preferred type: field / admin / media / training
    - `notes` (text) - Additional notes
    - `terms_agreed` (boolean) - Consent checkbox
    - `created_at` (timestamptz) - Submission timestamp

  ## Security
  - RLS enabled
  - Anyone can insert (public form)
  - Only authenticated users can select (admin access)
*/

CREATE TABLE IF NOT EXISTS volunteer_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL DEFAULT '',
  age text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  region text NOT NULL DEFAULT '',
  skills text NOT NULL DEFAULT '',
  availability text NOT NULL DEFAULT '',
  volunteer_type text NOT NULL DEFAULT '',
  notes text NOT NULL DEFAULT '',
  terms_agreed boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE volunteer_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a volunteer request"
  ON volunteer_requests
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view volunteer requests"
  ON volunteer_requests
  FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);
