-- Add custom_sections JSONB column to brand_case_studies table
ALTER TABLE brand_case_studies
ADD COLUMN IF NOT EXISTS custom_sections JSONB DEFAULT '[]'::jsonb;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_brand_case_studies_custom_sections
ON brand_case_studies USING GIN (custom_sections);
