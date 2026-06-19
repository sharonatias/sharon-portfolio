-- Add applications_images column to brand_case_studies
ALTER TABLE brand_case_studies
ADD COLUMN IF NOT EXISTS applications_images TEXT[] DEFAULT ARRAY[]::TEXT[];
