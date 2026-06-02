-- Add missing columns to app_cases table
ALTER TABLE app_cases
ADD COLUMN IF NOT EXISTS client TEXT,
ADD COLUMN IF NOT EXISTS duration TEXT,
ADD COLUMN IF NOT EXISTS format TEXT,
ADD COLUMN IF NOT EXISTS watch_film_link TEXT,
ADD COLUMN IF NOT EXISTS video_file TEXT,
ADD COLUMN IF NOT EXISTS gallery_images TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS process_blocks JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS my_role_title TEXT,
ADD COLUMN IF NOT EXISTS my_role_description TEXT,
ADD COLUMN IF NOT EXISTS custom_sections JSONB DEFAULT '[]'::jsonb;

-- Add comments for clarity
COMMENT ON COLUMN app_cases.client IS 'Client name or organization';
COMMENT ON COLUMN app_cases.duration IS 'Project duration (e.g., "3 months")';
COMMENT ON COLUMN app_cases.format IS 'Project format (e.g., "Short Film", "App", "Brand Design")';
COMMENT ON COLUMN app_cases.watch_film_link IS 'External link to watch the film (YouTube, Vimeo, etc.)';
COMMENT ON COLUMN app_cases.video_file IS 'Uploaded video file URL';
COMMENT ON COLUMN app_cases.gallery_images IS 'Array of gallery image URLs';
COMMENT ON COLUMN app_cases.process_blocks IS 'Array of process block objects with: number, title, description, image';
COMMENT ON COLUMN app_cases.my_role_title IS 'Title for the "My Role" section';
COMMENT ON COLUMN app_cases.my_role_description IS 'Description for the "My Role" section';
COMMENT ON COLUMN app_cases.custom_sections IS 'Array of custom sections with format: [{id, label, title, description, images: [], order}]';
