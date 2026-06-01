-- Add missing columns to video_case_studies table for section storage

ALTER TABLE video_case_studies
ADD COLUMN IF NOT EXISTS subtitle TEXT,
ADD COLUMN IF NOT EXISTS hero_description TEXT,
ADD COLUMN IF NOT EXISTS year TEXT,
ADD COLUMN IF NOT EXISTS role TEXT,
ADD COLUMN IF NOT EXISTS hero_image TEXT,
ADD COLUMN IF NOT EXISTS brand_color TEXT DEFAULT '#000000',
ADD COLUMN IF NOT EXISTS client TEXT,
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'films_video',
ADD COLUMN IF NOT EXISTS problem JSONB,
ADD COLUMN IF NOT EXISTS insight JSONB,
ADD COLUMN IF NOT EXISTS approach JSONB,
ADD COLUMN IF NOT EXISTS flow JSONB,
ADD COLUMN IF NOT EXISTS interaction JSONB,
ADD COLUMN IF NOT EXISTS outcome JSONB;

-- Drop the old columns that we don't need anymore if they exist
ALTER TABLE video_case_studies
DROP COLUMN IF EXISTS duration,
DROP COLUMN IF EXISTS format,
DROP COLUMN IF EXISTS hero_image_url,
DROP COLUMN IF EXISTS hero_video_url,
DROP COLUMN IF EXISTS watch_film_link,
DROP COLUMN IF EXISTS description;

-- Ensure RLS is enabled
ALTER TABLE video_case_studies ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Allow public read on video_case_studies" ON video_case_studies;
DROP POLICY IF EXISTS "Allow authenticated insert on video_case_studies" ON video_case_studies;
DROP POLICY IF EXISTS "Allow authenticated update on video_case_studies" ON video_case_studies;
DROP POLICY IF EXISTS "Allow authenticated delete on video_case_studies" ON video_case_studies;

-- Create policies for video_case_studies
CREATE POLICY "Allow public read on video_case_studies" ON video_case_studies FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert on video_case_studies" ON video_case_studies FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update on video_case_studies" ON video_case_studies FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete on video_case_studies" ON video_case_studies FOR DELETE USING (auth.role() = 'authenticated');
