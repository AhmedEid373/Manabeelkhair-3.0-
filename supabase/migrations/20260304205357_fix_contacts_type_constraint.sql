/*
  # Fix contacts table type constraint

  ## Summary
  The contacts table currently restricts `type` to 'helper' or 'needer', but the
  Contact page form sends values like 'donation', 'volunteer', 'inquiry', 'partnership'.
  This migration drops the old constraint and adds a new one that matches the form values.

  ## Changes
  - contacts: Update type check constraint to accept form values
*/

ALTER TABLE contacts DROP CONSTRAINT IF EXISTS contacts_type_check;

ALTER TABLE contacts ADD CONSTRAINT contacts_type_check
  CHECK (type = ANY (ARRAY['donation'::text, 'volunteer'::text, 'inquiry'::text, 'partnership'::text, 'helper'::text, 'needer'::text]));
