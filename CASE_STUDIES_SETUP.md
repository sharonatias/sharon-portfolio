# Case Studies System Setup Guide

## Database Setup in Supabase

1. Go to https://supabase.com
2. Open your project
3. Go to SQL Editor
4. Create new query
5. Copy all code from scripts/setup-case-studies.sql
6. Run the query

This creates 4 tables:
- video_case_studies (main table)
- case_study_sections (editorial sections)
- case_study_images (gallery images)
- case_study_process_blocks (process blocks)

## API Endpoints

### Case Studies
- GET /api/case-studies - List all
- POST /api/case-studies - Create new
- GET /api/case-studies/[id] - Get single with relations
- PUT /api/case-studies/[id] - Update
- DELETE /api/case-studies/[id] - Delete

## Admin Panel

Access at: https://www.sharonmosheattias.com/admin

Login:
- Email: sharonatias@gmail.com
- Password: sma369369

Create a case study from the admin panel to test the system.

## Next Steps

1. Run SQL schema in Supabase
2. Create a test case study via admin
3. View at: https://www.sharonmosheattias.com/projects
4. Click on a Films & Video project to see details
