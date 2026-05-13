# Sharon's Portfolio & Admin Panel

A modern portfolio website with admin panel for managing projects, videos, and images.

## Features

- 🎬 Portfolio website with project gallery
- 🔐 Admin panel with login authentication
- 📤 Upload images and videos to Cloudinary
- ✏️ Create, Edit, Delete projects
- 📱 Responsive design
- 🚀 Deployed on Vercel

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Database**: Supabase PostgreSQL
- **Storage**: Cloudinary
- **Hosting**: Vercel

## Quick Start

### 1. Clone & Install

```bash
git clone [repository-url]
cd sharon-portfolio
npm install
```

### 2. Set up Supabase

1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Create `projects` table with columns:
   - `id` (UUID, Primary Key)
   - `title`, `description`, `category` (Text)
   - `image_url`, `video_url` (Text)
   - `created_at`, `updated_at` (Timestamp)
4. Copy URL and ANON KEY to `.env.local`

### 3. Set up Cloudinary

1. Create account at [cloudinary.com](https://cloudinary.com)
2. Create unsigned upload preset: `sharon_portfolio`
3. Copy Cloud Name to `.env.local`

### 4. Environment Variables

Create `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

### 5. Run Locally

```bash
npm run dev
```

- Homepage: http://localhost:3000
- Admin: http://localhost:3000/admin

**Admin Credentials:**
- Email: `sharonatias@gmail.com`
- Password: `sma369369`

## Deployment

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import repository
4. Add environment variables
5. Deploy!
