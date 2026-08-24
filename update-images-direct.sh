#!/bin/bash

# Update projects with Cloudinary image URLs using curl
SUPABASE_URL="https://whqqammiamoajavokauw.supabase.co"
ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndocXFhbW1pYW1vYWphdm9rYXV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2ODk5OTQsImV4cCI6MjA5NDI2NTk5NH0.JfVa6S_J0vTz4z5Sf8BqE6T7A2KBw8Yk1qL9m-P3KcE"

echo "📸 Updating featured project images to Cloudinary URLs..."

# Update 1: Creating storytelling for production studios
curl -s -X PATCH \
  "${SUPABASE_URL}/rest/v1/projects?id=eq.3e200378-1a5e-4cea-ada4-473b0395410e" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"image_url":"https://res.cloudinary.com/dy9toyl3s/image/upload/f_auto,q_auto/v1/sharon-featured-images/storytelling"}' \
  && echo "✅ Updated: Creating storytelling for production studios"

# Update 2: El Mistater Music Video
curl -s -X PATCH \
  "${SUPABASE_URL}/rest/v1/projects?id=eq.01e1b575-fc71-48e4-8894-aa4df8dafd40" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"image_url":"https://res.cloudinary.com/dy9toyl3s/image/upload/f_auto,q_auto/v1/sharon-featured-images/el-mistater"}' \
  && echo "✅ Updated: El Mistater Music Video"

# Update 3: Shlomo - La Vie Est Belle
curl -s -X PATCH \
  "${SUPABASE_URL}/rest/v1/projects?id=eq.3b107b7e-d191-49e7-8886-e6ec9663173e" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"image_url":"https://res.cloudinary.com/dy9toyl3s/image/upload/f_auto,q_auto/v1/sharon-featured-images/shlomo"}' \
  && echo "✅ Updated: Shlomo - La Vie Est Belle"

echo ""
echo "✨ Database updated with Cloudinary URLs!"
