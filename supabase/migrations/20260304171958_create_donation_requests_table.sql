/*
  # Create donation_requests table

  ## Summary
  Creates a table to store donation contact form submissions from the Donate page.

  ## New Tables
  - `donation_requests`
    - `id` (uuid, primary key)
    - `full_name` (text) - الاسم الكامل
    - `email` (text) - البريد الإلكتروني
    - `phone` (text) - رقم الهاتف
    - `amount` (text) - المبلغ المراد التبرع به
    - `donation_method` (text) - طريقة التبرع
    - `allocation` (text, nullable) - تخصيص التبرع (اختياري)
    - `privacy_agreed` (boolean) - الموافقة على سياسة الخصوصية
    - `status` (text) - حالة الطلب
    - `created_at` (timestamptz)

  ## Security
  - Enable RLS on `donation_requests` table
  - Allow anyone to insert (public form submission)
  - Only authenticated users can read
*/

CREATE TABLE IF NOT EXISTS donation_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  amount text NOT NULL,
  donation_method text NOT NULL,
  allocation text DEFAULT '',
  privacy_agreed boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE donation_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a donation request"
  ON donation_requests
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (privacy_agreed = true);

CREATE POLICY "Authenticated users can view donation requests"
  ON donation_requests
  FOR SELECT
  TO authenticated
  USING (true);
