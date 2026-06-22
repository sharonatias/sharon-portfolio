-- Add brand_applications column to brand_case_studies
ALTER TABLE brand_case_studies
ADD COLUMN IF NOT EXISTS brand_applications JSONB DEFAULT '[]'::JSONB;
