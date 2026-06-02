-- Add label field to all section columns for case studies
ALTER TABLE video_case_studies
ADD COLUMN IF NOT EXISTS problem_label TEXT,
ADD COLUMN IF NOT EXISTS insight_label TEXT,
ADD COLUMN IF NOT EXISTS approach_label TEXT,
ADD COLUMN IF NOT EXISTS interaction_label TEXT,
ADD COLUMN IF NOT EXISTS outcome_label TEXT,
ADD COLUMN IF NOT EXISTS custom_sections JSONB DEFAULT '[]'::jsonb;

-- Add comments for clarity
COMMENT ON COLUMN video_case_studies.problem_label IS 'Custom label for the problem section (defaults to THE BRIEF)';
COMMENT ON COLUMN video_case_studies.insight_label IS 'Custom label for the insight section (defaults to THE CHALLENGE)';
COMMENT ON COLUMN video_case_studies.approach_label IS 'Custom label for the approach section (defaults to CREATIVE CONCEPT)';
COMMENT ON COLUMN video_case_studies.interaction_label IS 'Custom label for the interaction section (defaults to VISUAL LANGUAGE)';
COMMENT ON COLUMN video_case_studies.outcome_label IS 'Custom label for the outcome section (defaults to OUTCOME)';
COMMENT ON COLUMN video_case_studies.custom_sections IS 'Array of custom sections with format: [{id, label, title, description, images: [], order}]';
