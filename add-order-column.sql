-- Add order column to hero_videos table if it doesn't exist
ALTER TABLE hero_videos 
ADD COLUMN IF NOT EXISTS "order" bigint DEFAULT 0;

-- Update existing records with order based on creation date (oldest first)
UPDATE hero_videos
SET "order" = ROW_NUMBER() OVER (ORDER BY created_at ASC) - 1
WHERE "order" IS NULL OR "order" = 0;
