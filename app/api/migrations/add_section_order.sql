-- Add section_order column to video_case_studies
ALTER TABLE video_case_studies
ADD COLUMN section_order TEXT[] DEFAULT ARRAY['problem', 'insight', 'approach', 'flow', 'interaction', 'outcome'];

-- Add sections_order column to brand_case_studies
ALTER TABLE brand_case_studies
ADD COLUMN sections_order TEXT[] DEFAULT ARRAY['idea', 'system', 'shape', 'motion', 'applications', 'color', 'type'];
