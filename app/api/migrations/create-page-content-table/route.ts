import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Create table
    const { error: createError } = await supabase.rpc('create_page_content_table', {}, {
      headers: { 'Content-Type': 'application/json' }
    }).catch(() => null)

    // Alternative: use exec for raw SQL (if available)
    // For now, manually create with insert
    const defaultContent = {
      id: 1,
      heroTitle: 'Creating documentaries, brands and visual experiences.',
      heroRole: 'DIRECTOR • PRODUCER',
      heroSubtitle: 'Blending design and AI-driven creation.',
      heroVideoUrl: ''
    }

    // Try to insert - will fail if table doesn't exist
    const { error: insertError } = await supabase
      .from('page_content')
      .upsert([{ ...defaultContent, updated_at: new Date() }])

    if (insertError && insertError.message.includes('does not exist')) {
      return NextResponse.json({
        status: 'Table needs to be created manually in Supabase dashboard',
        sql: `CREATE TABLE public.page_content (
  id INT PRIMARY KEY DEFAULT 1,
  heroTitle TEXT,
  heroRole TEXT,
  heroSubtitle TEXT,
  heroVideoUrl TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);`
      }, { status: 400 })
    }

    return NextResponse.json({
      status: 'success',
      message: 'page_content table created/updated'
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
