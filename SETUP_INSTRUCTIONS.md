# Setup Instructions for Enhanced Case Studies

## Current Status

✅ **Working Features:**
- Section labels are now editable in the admin form
- Section labels are saved and displayed correctly
- Admin form shows label input for: THE BRIEF, THE CHALLENGE, CREATIVE CONCEPT, VISUAL LANGUAGE, OUTCOME

❌ **Pending Features (Need Database Schema Update):**
- Custom sections feature (requires `custom_sections` column)
- Other optional fields: client, duration, format, watch_film_link, video_file, gallery_images, process_blocks, my_role_title, my_role_description

## Step 1: Update Database Schema

The application needs several new columns in the `app_cases` table. You must add these through the Supabase dashboard:

### Method 1: Using Supabase Dashboard (Recommended)

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **SQL Editor**
4. Create a new query
5. Copy and paste the following SQL:

```sql
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
```

6. Click **RUN**
7. Wait for the migration to complete

### Method 2: Using Table Editor (UI)

1. Go to Supabase Dashboard
2. Select **Tables** → **app_cases**
3. Click the **+** button to add new columns
4. Add each column:
   - `client` (TEXT)
   - `duration` (TEXT)
   - `format` (TEXT)
   - `watch_film_link` (TEXT)
   - `video_file` (TEXT)
   - `gallery_images` (TEXT ARRAY, default: '{}')
   - `process_blocks` (JSONB, default: '[]'::jsonb)
   - `my_role_title` (TEXT)
   - `my_role_description` (TEXT)
   - `custom_sections` (JSONB, default: '[]'::jsonb)

## Step 2: Verify the Setup

After applying the schema changes:

1. Go to **Admin Dashboard**: http://localhost:3000/admin/dashboard
2. Open an existing case study or create a new one
3. Verify you can:
   - ✓ Edit section labels (THE BRIEF, THE CHALLENGE, etc.)
   - ✓ See the "Custom Sections (Optional)" section
   - ✓ Add up to 5 custom sections
   - ✓ Save the case study

## Step 3: Test the Features

### Testing Section Labels:
1. Edit a case study
2. Scroll to a section (e.g., "The Brief")
3. You should see: **Section Label (Editable)** input field
4. Change the label (e.g., "THE BRIEF" → "MY CHALLENGE")
5. Save the case study
6. View the case study page - the label should display your custom text

### Testing Custom Sections:
1. Edit a case study
2. Scroll to **Custom Sections (Optional)**
3. Click **+ Add Custom Section**
4. Fill in:
   - Section Label (required): e.g., "MY RESULTS"
   - Title: e.g., "Results Overview"
   - Description: e.g., "The outcomes we achieved"
   - Images: Click "+ Add Image" to upload images
5. You can add up to 5 custom sections
6. Click the 6th button - it should be disabled
7. Save the case study
8. View the case study page - custom sections should appear after the standard sections

## Troubleshooting

### Error: "Could not find the 'custom_sections' column"
- **Solution**: The database columns haven't been added yet. Follow Step 1 to add them.

### Changes not appearing in the admin form
- **Solution**: Clear browser cache (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows/Linux)
- **Alternative**: Kill the dev server (`pkill -f "next dev"`) and restart it

### Images not uploading
- **Solution**: Ensure Cloudinary credentials are set up in `.env.local`
- **Check**: `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` should be defined

## Files Modified

- `/app/api/app-cases/route.ts` - POST endpoint updated
- `/app/api/app-cases/[id]/route.ts` - PUT endpoint updated
- `/components/AppCaseForm.tsx` - Added label fields and custom sections UI
- `/lib/types.ts` - Updated interfaces
- `/app/case-studies/[id]/page.tsx` - Updated to display labels and custom sections

## Next Steps

1. ✅ Run the database migration (Step 1)
2. ✅ Refresh the admin dashboard
3. ✅ Test section label editing
4. ✅ Test custom sections creation
5. 🚀 Deploy to production when satisfied

## Database Schema Reference

The updated `app_cases` table will have these columns:

```
id (UUID, PK)
title (TEXT)
subtitle (TEXT)
year (TEXT)
role (TEXT)
client (TEXT) - NEW
duration (TEXT) - NEW
format (TEXT) - NEW
hero_image (TEXT)
hero_description (TEXT)
watch_film_link (TEXT) - NEW
video_file (TEXT) - NEW
problem (JSONB) - now with label & accentColor fields
insight (JSONB) - now with label & accentColor fields
approach (JSONB) - now with label & accentColor fields
flow (JSONB) - now with label & accentColor fields
interaction (JSONB) - now with label & accentColor fields
outcome (JSONB) - now with label & accentColor fields
gallery_images (TEXT[]) - NEW
process_blocks (JSONB) - NEW
my_role_title (TEXT) - NEW
my_role_description (TEXT) - NEW
custom_sections (JSONB) - NEW
brand_color (TEXT)
brand_design_id (UUID, FK)
category (TEXT)
display_order (INTEGER)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

## Support

If you encounter any issues:
1. Check the browser console for errors (F12 → Console)
2. Check the server logs in the terminal
3. Verify all environment variables are set
4. Ensure database migration was successful in Supabase
