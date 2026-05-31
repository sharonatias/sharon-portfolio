-- Create video_case_studies table
CREATE TABLE IF NOT EXISTS video_case_studies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  client VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  year INTEGER,
  duration VARCHAR(50),
  format VARCHAR(255),
  category VARCHAR(50),
  hero_image_url TEXT,
  hero_video_url TEXT,
  watch_film_link TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS case_study_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_study_id UUID NOT NULL REFERENCES video_case_studies(id) ON DELETE CASCADE,
  label VARCHAR(255),
  heading VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  section_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS case_study_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_study_id UUID NOT NULL REFERENCES video_case_studies(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  image_type VARCHAR(50) DEFAULT 'gallery',
  caption VARCHAR(255),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS case_study_process_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_study_id UUID NOT NULL REFERENCES video_case_studies(id) ON DELETE CASCADE,
  block_number INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  block_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_case_study_sections_case_study_id ON case_study_sections(case_study_id);
CREATE INDEX IF NOT EXISTS idx_case_study_images_case_study_id ON case_study_images(case_study_id);
CREATE INDEX IF NOT EXISTS idx_case_study_process_blocks_case_study_id ON case_study_process_blocks(case_study_id);

ALTER TABLE video_case_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_study_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_study_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_study_process_blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on video_case_studies" ON video_case_studies FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert on video_case_studies" ON video_case_studies FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update on video_case_studies" ON video_case_studies FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete on video_case_studies" ON video_case_studies FOR DELETE USING (true);

CREATE POLICY "Allow public read on case_study_sections" ON case_study_sections FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert on case_study_sections" ON case_study_sections FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update on case_study_sections" ON case_study_sections FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete on case_study_sections" ON case_study_sections FOR DELETE USING (true);

CREATE POLICY "Allow public read on case_study_images" ON case_study_images FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert on case_study_images" ON case_study_images FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update on case_study_images" ON case_study_images FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete on case_study_images" ON case_study_images FOR DELETE USING (true);

CREATE POLICY "Allow public read on case_study_process_blocks" ON case_study_process_blocks FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert on case_study_process_blocks" ON case_study_process_blocks FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update on case_study_process_blocks" ON case_study_process_blocks FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete on case_study_process_blocks" ON case_study_process_blocks FOR DELETE USING (true);
