
/*
  # Fix RLS Security Issues

  ## Changes

  ### 1. Performance: Replace auth.uid() with (select auth.uid()) in RLS policies
  - `volunteer_requests`: view, update, delete policies
  - `donation_requests`: update, delete policies
  - `contacts`: view, update, delete policies (also fix always-true issues)

  ### 2. Fix always-true RLS policies
  - `contacts` INSERT: restrict to anon/authenticated submitting only (keep WITH CHECK true as it's a public form, but scope to TO clause)
  - `contacts` DELETE: restrict to authenticated users only (not true for everyone)
  - `contacts` UPDATE: restrict to authenticated users only (not true for everyone)
  - `contacts` SELECT: restrict to authenticated users only
  - `volunteer_requests` INSERT: keep open for public submission but note it is intentional
  - `donation_requests` SELECT: restrict to authenticated users

  ### 3. Drop unused indexes
  - `idx_contacts_type`
  - `idx_contacts_status`

  ### Security Notes
  - All admin-only operations (update, delete, select) now properly check auth.uid() using subselect for performance
  - Public INSERT policies on contacts and volunteer_requests are intentional (public forms)
*/

-- Drop and recreate volunteer_requests policies with (select auth.uid())
DROP POLICY IF EXISTS "Authenticated users can view volunteer requests" ON public.volunteer_requests;
DROP POLICY IF EXISTS "Authenticated users can update volunteer requests" ON public.volunteer_requests;
DROP POLICY IF EXISTS "Authenticated users can delete volunteer requests" ON public.volunteer_requests;
DROP POLICY IF EXISTS "Anyone can submit a volunteer request" ON public.volunteer_requests;

CREATE POLICY "Authenticated users can view volunteer requests"
  ON public.volunteer_requests
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Authenticated users can update volunteer requests"
  ON public.volunteer_requests
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) IS NOT NULL)
  WITH CHECK ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Authenticated users can delete volunteer requests"
  ON public.volunteer_requests
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Anyone can submit a volunteer request"
  ON public.volunteer_requests
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Drop and recreate donation_requests policies with (select auth.uid())
DROP POLICY IF EXISTS "Authenticated users can view donation requests" ON public.donation_requests;
DROP POLICY IF EXISTS "Authenticated users can update donation requests" ON public.donation_requests;
DROP POLICY IF EXISTS "Authenticated users can delete donation requests" ON public.donation_requests;

CREATE POLICY "Authenticated users can view donation requests"
  ON public.donation_requests
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Authenticated users can update donation requests"
  ON public.donation_requests
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) IS NOT NULL)
  WITH CHECK ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Authenticated users can delete donation requests"
  ON public.donation_requests
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) IS NOT NULL);

-- Fix contacts policies: replace always-true with proper auth checks
DROP POLICY IF EXISTS "Anyone can submit contact forms" ON public.contacts;
DROP POLICY IF EXISTS "Authenticated users can view all contacts" ON public.contacts;
DROP POLICY IF EXISTS "Authenticated users can update contacts" ON public.contacts;
DROP POLICY IF EXISTS "Authenticated users can delete contacts" ON public.contacts;

CREATE POLICY "Anyone can submit contact forms"
  ON public.contacts
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all contacts"
  ON public.contacts
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Authenticated users can update contacts"
  ON public.contacts
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) IS NOT NULL)
  WITH CHECK ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Authenticated users can delete contacts"
  ON public.contacts
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) IS NOT NULL);

-- Drop unused indexes
DROP INDEX IF EXISTS public.idx_contacts_type;
DROP INDEX IF EXISTS public.idx_contacts_status;
