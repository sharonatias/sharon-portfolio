-- Update the 3 featured projects with Cloudinary image URLs
UPDATE projects 
SET image_url = 'https://res.cloudinary.com/dy9toyl3s/image/upload/f_auto,q_auto/v1/sharon-featured-images/storytelling'
WHERE title ILIKE '%Creating storytelling%';

UPDATE projects 
SET image_url = 'https://res.cloudinary.com/dy9toyl3s/image/upload/f_auto,q_auto/v1/sharon-featured-images/el-mistater'
WHERE title ILIKE '%El Mistater%';

UPDATE projects 
SET image_url = 'https://res.cloudinary.com/dy9toyl3s/image/upload/f_auto,q_auto/v1/sharon-featured-images/shlomo'
WHERE title ILIKE '%Shlomo%';

-- Verify the updates
SELECT id, title, image_url FROM projects WHERE image_url LIKE 'https://res.cloudinary%';
