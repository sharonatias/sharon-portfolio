-- Adds a JSON column for the editable site texts (Admin → Home → Site texts).
-- Run once in Supabase → SQL Editor.
ALTER TABLE page_content ADD COLUMN IF NOT EXISTS site_texts jsonb DEFAULT '{}'::jsonb;
