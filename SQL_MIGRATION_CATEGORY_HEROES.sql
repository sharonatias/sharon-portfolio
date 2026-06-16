-- Create Category Heroes table
CREATE TABLE category_heroes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_key TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE category_heroes ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access" ON category_heroes FOR SELECT USING (true);

-- Create policy for authenticated write access (for admin)
CREATE POLICY "Allow authenticated write access" ON category_heroes FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update access" ON category_heroes FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete access" ON category_heroes FOR DELETE USING (auth.role() = 'authenticated');

-- Insert initial data for the 3 categories
INSERT INTO category_heroes (category_key, title, image_url, display_order) VALUES
  ('films_video', 'Films & Video', '', 0),
  ('brand_digital_design', 'Brand & Digital Design', '', 1),
  ('ai_creative_technology', 'AI & Creative Technology', '', 2)
ON CONFLICT (category_key) DO NOTHING;
