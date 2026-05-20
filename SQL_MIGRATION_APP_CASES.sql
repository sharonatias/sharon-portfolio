-- Create app_cases table
CREATE TABLE app_cases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  year TEXT,
  role TEXT,
  hero_image TEXT NOT NULL,
  hero_description TEXT,

  problem JSONB NOT NULL,
  insight JSONB NOT NULL,
  approach JSONB NOT NULL,
  flow JSONB NOT NULL,
  interaction JSONB NOT NULL,
  outcome JSONB NOT NULL,

  brand_color TEXT DEFAULT '#000000',
  brand_design_id UUID,
  display_order INTEGER,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),

  FOREIGN KEY (brand_design_id) REFERENCES brand_designs(id) ON DELETE SET NULL
);

-- Enable RLS
ALTER TABLE app_cases ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access" ON app_cases FOR SELECT USING (true);

-- Create policy for authenticated write access (for admin)
CREATE POLICY "Allow authenticated write access" ON app_cases FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update access" ON app_cases FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete access" ON app_cases FOR DELETE USING (auth.role() = 'authenticated');
