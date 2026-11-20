import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { DEFAULT_PAGE_CONTENT, withTextDefaults } from '@/lib/site'

export const dynamic = 'force-dynamic'

const defaultContent = DEFAULT_PAGE_CONTENT

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

async function readPageContent() {
  const supabase = getClient()
  if (!supabase) return defaultContent
  try {
    const { data, error } = await supabase
      .from('page_content')
      .select('*')
      .eq('id', 1)
      .single()

    if (error || !data) {
      console.error('page_content read error:', error?.message)
      return defaultContent
    }

    // Supabase stores lowercase column names
    return {
      heroTitle: data.herotitle || data.heroTitle || defaultContent.heroTitle,
      heroRole: data.herorole || data.heroRole || defaultContent.heroRole,
      heroSubtitle: data.herosubtitle || data.heroSubtitle || defaultContent.heroSubtitle,
      heroVideoUrl: data.herovideourl || data.heroVideoUrl || defaultContent.heroVideoUrl,
      featured_project_ids: data.featured_project_ids || defaultContent.featured_project_ids,
      featured_visible: data.featured_visible !== undefined && data.featured_visible !== null ? data.featured_visible : defaultContent.featured_visible,
      exploring_ids: data.exploring_ids || defaultContent.exploring_ids,
      exploring_visible: data.exploring_visible !== undefined && data.exploring_visible !== null ? data.exploring_visible : defaultContent.exploring_visible,
      ai_experiments_ids: data.ai_experiments_ids || defaultContent.ai_experiments_ids,
      ai_experiments_visible: data.ai_experiments_visible !== undefined && data.ai_experiments_visible !== null ? data.ai_experiments_visible : defaultContent.ai_experiments_visible,
      site_texts: withTextDefaults(data.site_texts),
      site_texts_supported: 'site_texts' in data,
    }
  } catch {
    return defaultContent
  }
}

export async function GET() {
  const content = await readPageContent()
  return NextResponse.json(content, { headers: { 'Cache-Control': 'no-store' } })
}

export async function POST(request: NextRequest) {
  const supabase = getClient()
  if (!supabase) {
    return NextResponse.json({ error: 'Database is not configured' }, { status: 500 })
  }
  try {
    const body = await request.json()
    const current: any = await readPageContent()
    const pick = (key: string) => (body[key] !== undefined ? body[key] : current[key])

    const row: Record<string, any> = {
      id: 1,
      herotitle: pick('heroTitle'),
      herorole: pick('heroRole'),
      herosubtitle: pick('heroSubtitle'),
      herovideourl: pick('heroVideoUrl'),
      featured_project_ids: pick('featured_project_ids') || '',
      featured_visible: pick('featured_visible'),
      exploring_ids: pick('exploring_ids') || '',
      exploring_visible: pick('exploring_visible'),
      ai_experiments_ids: pick('ai_experiments_ids') || '',
      ai_experiments_visible: pick('ai_experiments_visible'),
      site_texts: withTextDefaults(body.site_texts ?? current.site_texts),
      updated_at: new Date().toISOString(),
    }

    let { error } = await supabase.from('page_content').upsert(row)
    let textsSaved = true

    // The site_texts column is added by SQL_MIGRATION_SITE_TEXTS.sql.
    // Until that migration runs, save everything else and tell the admin.
    if (error && /site_texts/i.test(error.message)) {
      textsSaved = false
      const { site_texts: _omit, ...rest } = row
      ;({ error } = await supabase.from('page_content').upsert(rest))
    }

    if (error) {
      console.error('page_content save error:', error.message)
      return NextResponse.json({ error: `Supabase error: ${error.message}` }, { status: 500 })
    }

    return NextResponse.json({ success: true, textsSaved })
  } catch (error) {
    console.error('Error saving page content:', error)
    return NextResponse.json({ error: 'Failed to save page content' }, { status: 500 })
  }
}
